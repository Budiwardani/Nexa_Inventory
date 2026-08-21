# Nexa-Inv Project Gap Report

**Review date:** 2026-08-21
**Scope:** Backend API, frontend routes/pages, documented business rules, and automated tests
**Overall assessment:** The project is a substantial working scaffold, but it is not yet production-ready as an ERP/MRP system. The highest risks are authorization coverage, stock/accounting consistency, production completion controls, and insufficient integration tests.

## Validation Summary

- Backend: `php artisan test` passed **6 tests / 12 assertions**.
- Frontend: `npm run build` passed successfully.
- The passing checks confirm that the current code compiles and the narrow existing tests pass; they do not validate the core inventory, purchasing, accounting, or manufacturing invariants.

## Priority Findings

### 1. Critical: RBAC is not enforced across most mutating APIs

The authenticated API group applies `auth:sanctum`, but the route group does not apply permission middleware to inventory, purchasing, manufacturing, accounting, or Phase 3 operations: [backend/routes/api.php](backend/routes/api.php#L10-L118).

Some production-order request classes check permissions, but many controllers use ordinary `Request` validation. Examples include stock adjustments, purchase-order approval, and Phase 3 records. A normal authenticated account may therefore be able to post adjustments, approve or delete purchase orders, create QC/scrap/rework records, and create accounting-related data.

**Impact:** Unauthorized users can change operational and financial data.

**Required action:** Define a permission matrix for read/create/update/delete/approve/post/complete actions and enforce it server-side with policies or permission middleware. Add negative authorization tests for every high-risk action.

### 2. Critical: Stock-affecting workflows do not share one inventory ledger path

The documented rules require stock changes to create stock movement records and accounting postings to remain consistent: [Business Rules & Workflow Bible.md](Business%20Rules%20%26%20Workflow%20Bible.md#L7-L16).

Current implementations diverge:

- Material issue creates a journal using a hard-coded unit cost of `10`, but does not deduct inventory or create a stock card: [backend/app/Modules/Core/Presentation/Controllers/MaterialIssueController.php](backend/app/Modules/Core/Presentation/Controllers/MaterialIssueController.php#L75-L104).
- Goods receipt updates the legacy `inventories` table and hard-codes `Main Warehouse`, rather than using the transaction warehouse or the Inventory stock/ledger service: [backend/app/Modules/Purchasing/Application/Services/GoodsReceiptService.php](backend/app/Modules/Purchasing/Application/Services/GoodsReceiptService.php#L29-L49).
- Finished-goods receipt and material issue are not consistently coupled to stock movement creation, according to the current controller flow.

**Impact:** Inventory balances, stock cards, and journals can disagree; valuation and audit trails cannot be trusted.

**Required action:** Use one transactional posting service for receipts, issues, returns, transfers, adjustments, scrap, and finished goods. Derive cost from approved valuation data, require warehouse/location/batch context, and make posting idempotent.

### 3. Critical: Production QC completion gate references the wrong table

The Phase 3 migration creates `qc_inspections`, while production completion checks `quality_control_inspections`: [backend/app/Modules/Core/Services/ProductionOrderService.php](backend/app/Modules/Core/Services/ProductionOrderService.php#L123-L137).

Because the check defaults to allowing completion when the looked-up table does not exist, a production order can complete without a passed QC inspection. The specification requires QC approval before completion: [Manufacturing Functional Specification.md](Manufacturing%20Functional%20Specification.md#L139-L160).

**Required action:** Use the canonical `qc_inspections` table/model, remove the permissive missing-table fallback, and add a failing test proving completion is rejected without a passed inspection.

### 4. High: Production approval workflow is incomplete

The specification defines `Draft → Supervisor → Production Manager → Plant Manager → Released`: [Manufacturing Functional Specification.md](Manufacturing%20Functional%20Specification.md#L58-L66).

The service currently allows `Draft` or `Submitted` to move directly to `Approved`, then to `Released`: [backend/app/Modules/Core/Services/ProductionOrderService.php](backend/app/Modules/Core/Services/ProductionOrderService.php#L38-L53) and [backend/app/Modules/Core/Services/ProductionOrderService.php](backend/app/Modules/Core/Services/ProductionOrderService.php#L92-L115).

Missing controls include submit, stage-specific approvals, approval history, started/in-progress/delayed states, close, rejection ownership, and workflow notifications. Completion also needs explicit authorization and state validation.

### 5. High: Stock transfer receiving allows over-receipt and is vulnerable to concurrent updates

The receiving path accepts any numeric quantity and does not enforce `received <= shipped`: [backend/app/Modules/Inventory/Presentation/Controllers/StockTransferController.php](backend/app/Modules/Inventory/Presentation/Controllers/StockTransferController.php#L100-L108). The service then posts the supplied quantity and marks the entire transfer received: [backend/app/Modules/Inventory/Services/StockOperationService.php](backend/app/Modules/Inventory/Services/StockOperationService.php#L110-L151).

Stock rows are read and updated without row locking in adjustment and transfer operations: [backend/app/Modules/Inventory/Services/StockOperationService.php](backend/app/Modules/Inventory/Services/StockOperationService.php#L22-L38).

**Impact:** Over-receipt can create inventory from nothing, while concurrent posts can lose updates or duplicate stock.

**Required action:** Validate per-line remaining quantity, support partial receipts explicitly, use `lockForUpdate()` inside transactions, enforce unique stock keys, and make receive/ship operations idempotent.

### 6. High: Purchasing workflow is incomplete

The documented flow is `Purchase Request → RFQ → Quotation → PO → Goods Receipt → Supplier Invoice → Payment`: [Business Rules & Workflow Bible.md](Business%20Rules%20%26%20Workflow%20Bible.md#L18-L26).

The API exposes suppliers, purchase orders, and goods receipts, but no request, RFQ, quotation, supplier invoice, or payment endpoints: [backend/routes/api.php](backend/routes/api.php#L105-L130).

Goods receipts also do not visibly enforce PO-line remaining quantities or prevent duplicate inventory posting.

### 7. High: Phase 3 modules are mostly CRUD without business transitions

QC, scrap, rework, maintenance, downtime, capacity planning, and costing mostly expose index/store/delete or index/store operations: [backend/routes/api.php](backend/routes/api.php#L53-L99).

Records are created directly in statuses such as `Draft`, `Scheduled`, `Open`, or `Active`, but there are no complete submit/approve/reject/complete/close/post transitions. Costing accepts manually supplied costs rather than deriving material, labor, machine, and overhead from actual production records: [backend/app/Modules/Core/Presentation/Controllers/Phase3Controller.php](backend/app/Modules/Core/Presentation/Controllers/Phase3Controller.php#L326-L350).

**Required action:** Define state machines, role ownership, approval history, posting effects, and reversal rules for each Phase 3 module.

### 8. Medium: Product unit mapping is a confirmed frontend gap

The feature catalogue promises product mappings and unit overrides: [FEATURES.md](FEATURES.md#L14-L19). The current page is explicitly a placeholder with no data loading or mutation: [frontend/src/features/master-data/routes/ProductUnitMappingPage.tsx](frontend/src/features/master-data/routes/ProductUnitMappingPage.tsx#L1-L26).

### 9. Medium: CSV import is not production-safe

The shared CRUD importer parses CSV using `split(',')`, so quoted commas, escaped quotes, and multiline fields are corrupted. It submits each row independently without awaiting, batching, or reporting per-row failures: [frontend/src/components/shared/CrudPage.tsx](frontend/src/components/shared/CrudPage.tsx#L80-L111).

**Required action:** Use a real CSV parser, validate rows against the same schemas as manual entry, provide an import preview, and report successes/failures with row numbers.

### 10. Medium: Tenant and organizational isolation needs proof

The product is documented as multi-company and multi-branch, but the reviewed API route group does not show tenant-scoped middleware, and several data operations query by record ID or global fields. The project needs explicit tests proving that users cannot read or mutate another company/branch's records.

**Required action:** Add company/branch scoping at repository/query-policy level, validate foreign keys against the active tenant, and test cross-tenant access for every module.

### 11. Medium: Authentication requirements are incomplete

The authentication documentation calls for login rate limiting, password reset, session tracking, token/session termination, strong passwords, and optional 2FA: [USER_LOGIN.md](USER_LOGIN.md#L18-L42). The route file currently exposes login/logout/me only: [backend/routes/api.php](backend/routes/api.php#L10-L17), and the login controller does not accept or process the documented `remember` value: [backend/app/Modules/Core/Presentation/Controllers/AuthController.php](backend/app/Modules/Core/Presentation/Controllers/AuthController.php#L13-L29).

The frontend stores the bearer token in `localStorage`: [frontend/src/lib/api.ts](frontend/src/lib/api.ts#L3-L19), which increases exposure if an XSS vulnerability is introduced.

**Required action:** Add rate limiting and account abuse controls, password reset and session management, and choose an explicit token-storage strategy with its CSRF/XSS threat model documented.

### 12. Medium: Documentation does not reflect implementation status

The README labels Inventory, Production, Purchasing, QC, Finance, and Maintenance as planned: [README.md](README.md#L93-L109), while routes and pages for many of these modules already exist. At the same time, the README describes a production-grade platform while several workflows remain partial or unsafe.

**Required action:** Replace broad status claims with a module readiness matrix covering API completeness, UI completeness, authorization, accounting/stock posting, and automated test status.

## Test Coverage Gaps

The current test suite has no focused coverage for:

- RBAC on inventory, purchasing, Phase 3, accounting, and lifecycle actions.
- QC gating of production completion.
- Stock-card creation for every stock-affecting transaction.
- Transfer over-receipt, partial receipt, duplicate posting, and concurrency.
- PO-to-goods-receipt quantity enforcement.
- Balanced journals and valuation/costing calculations.
- Company/branch isolation.
- Audit-log immutability and soft-delete behavior.
- Frontend route/API integration and CSV import failures.

## Recommended Delivery Order

1. Enforce server-side authorization and tenant scoping.
2. Consolidate all inventory changes into one transactional, locked, idempotent posting service.
3. Fix the QC table mismatch and implement production state/approval transitions.
4. Complete PO/receipt controls and define the remaining purchasing workflow scope.
5. Replace Phase 3 CRUD endpoints with explicit lifecycle actions and accounting/stock effects.
6. Add integration tests for the invariants above before expanding feature scope.
7. Update the README and feature status matrix to match actual readiness.

## Conclusion

Nexa-Inv has a healthy compile baseline and a broad architectural scaffold. It should currently be treated as an internal development build rather than a production ERP release. The first release gate should be business-data integrity: no unauthorized mutation, no stock movement without a ledger entry, no accounting entry without a validated source transaction, and no production completion without the required approvals and QC evidence.
