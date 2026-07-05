# Nexa-Inv — Feature Overview

## Core
- Multi-company / branches support
- Role-based access control (roles, permissions, policies)
- Audit & activity logs
- Settings & global configuration

## Master Data
- Products, SKUs, variants, attributes
- Categories, brands, units, price lists
- Suppliers & customers

## Inventory & Warehouse
- Warehouses, zones, racks, bins
- Stock ledger (stock cards) and movements
- Stock adjustments, transfers, opnames, cycle counts
- FIFO and Average costing
- Batch and serial number tracking

## Purchasing
- PR → RFQ → Quotation → PO → Goods Receipt → Supplier Invoice → Payment
- Supplier management and contacts
- Receiving, returns, and matching

## Manufacturing (MRP Lite)
- BOM management (versions)
- Routings and operations
- Production planning, production orders, work orders
- Material reservations, issues, and consumption
- Finished goods receipt and costing
- Machine assignments, maintenance & downtime
- QC inspection and rework/scrap handling

## Sales & POS
- Quotations, Sales Orders, Deliveries, Invoicing
- POS transactions, shifts, receipts, payments

## Finance
- Chart of accounts, journals, GL posting
- Accounts payable / receivable, payments, receipts
- Costing integration with production and inventory

## HR & CRM
- Employee profiles, attendance, leave
- Leads, prospects, campaigns, customer activities

## Reporting & Notifications
- Dashboards, KPI widgets, OEE and production reports
- Event notifications (email, web, mobile, WhatsApp, in-app)

## Security & Integration
- API-first design (/api/v1)
- JWT / token-based auth for APIs
- Audit trails and immutable production histories
- Queue-ready for async jobs and notifications

## Notes
- Features follow modular-monolith architecture.
- Every business action must include audit records and validations.
