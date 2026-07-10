# Nexa-Inv — Feature Overview

Nexa-Inv is a comprehensive Enterprise Resource Planning (ERP) platform designed to handle manufacturing, inventory, purchasing, and finance. Below is a breakdown of its core capabilities.

## 1. Core & Administration
- **Multi-company / Branches Support:** Manage multiple organizational units.
- **Role-Based Access Control (RBAC):** Flexible roles, permissions, and module-level policies.
- **Audit & Activity Logs:** Immutable tracking of user actions.
- **Settings & Global Configuration:** Centralized app settings and branding (Custom Logos, Themes).
- **Notifications Engine:** In-app alerts, read/unread status for critical business events.

## 2. Master Data Management
- **Products & Items:** Manage SKUs, variants, and item attributes.
- **Base Units & Conversions:** Define UOMs (Unit of Measure) and conversion matrices.
- **Conversion Simulator:** Test unit conversions dynamically.
- **Product Mappings:** Link specific products to custom units.
- **Departments & Units:** Manage organizational divisions (Production, QC, Logistics, etc.).

## 3. Inventory & Warehouse
- **Warehouses & Zones:** Manage physical locations, racks, and bins.
- **Stock Ledger:** Immutable log of all stock movements (In/Out/Balance).
- **Stock Adjustments:** Cycle counts, manual corrections for damages/losses.
- **Stock Transfers:** Move inventory between warehouses or to specific departments.
- **Material Issue & Return:** Track raw materials consumed or returned from production.
- **Finished Goods Receipt:** Log output from the production floor into inventory.
- **Inventory Reports:** Comprehensive stock summary, ledger views, transfer history, and adjustment logs with CSV export.

## 4. Manufacturing & Production (MRP)
- **Bill of Materials (BOM):** Define raw materials required for finished goods, including versions.
- **Routings & Operations:** Define the steps and machinery required for production.
- **Production Planning:** Capacity planning, scheduling, and tracking.
- **Work Orders & Production Orders:** Executable tickets for the factory floor.
- **Machine Management:** Track machine status, specifications, and assignments.

## 5. Phase 3 Specialized Modules
- **Quality Control (QC):** Log inspection parameters, samples, and pass/fail statuses.
- **Scrap Management:** Record waste, reasons for scrap, and financial impact.
- **Rework:** Track defective items sent back for repair and associated costs.
- **Maintenance & Downtime:** Log scheduled maintenance, unplanned breakdowns, and measure OEE (Overall Equipment Effectiveness).
- **Production Costing:** Calculate direct materials, labor, and overhead costs per order.

## 6. Purchasing
- **Supplier Management:** Maintain supplier contacts and profiles.
- **Purchase Orders (PO):** Create, approve, and track orders to suppliers.
- **Goods Receipt (GR):** Receive items against POs and update inventory.

## 7. Finance & Accounting
- **Chart of Accounts (COA):** Standardized financial accounts structure.
- **Journals & Ledgers:** Double-entry accounting for financial movements.
- **Costing Integration:** Automatic financial journal entries tied to production and purchasing.

## 8. Security & Architecture
- **API-First Design:** Fully decoupled backend exposing `/api/v1` RESTful endpoints.
- **Modular Monolith Backend:** Domain-Driven Design (DDD) separating Core, Inventory, and Purchasing modules.
- **Modern Frontend:** React + Vite + TypeScript for a blazing fast user experience.
