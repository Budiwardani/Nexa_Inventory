# Nexa-Inv Database Blueprint (Enterprise)

This is a logical database blueprint for PostgreSQL. It is intended as the master reference before writing Laravel migrations.

## Core
- companies
- branches
- users
- roles
- permissions
- role_permissions
- user_roles
- user_sessions
- audit_logs
- activity_logs
- settings

## Master Data
- categories
- brands
- units
- product_attributes
- attribute_values
- products
- product_variants
- product_barcodes
- product_images
- serial_numbers
- batch_numbers
- price_lists
- taxes
- currencies

## Warehouse
- warehouses
- warehouse_zones
- warehouse_racks
- warehouse_bins
- warehouse_locations

## Inventory
- stocks
- stock_cards
- stock_movements
- stock_adjustments
- stock_adjustment_items
- stock_transfers
- stock_transfer_items
- stock_opnames
- stock_opname_items
- cycle_counts
- inventory_valuations

## Purchasing
- suppliers
- supplier_contacts
- purchase_requests
- purchase_request_items
- rfqs
- rfq_items
- quotations
- quotation_items
- purchase_orders
- purchase_order_items
- goods_receipts
- goods_receipt_items
- purchase_returns
- purchase_return_items
- supplier_invoices

## Sales
- customers
- customer_addresses
- quotations_sales
- quotation_sales_items
- sales_orders
- sales_order_items
- deliveries
- delivery_items
- sales_invoices
- sales_invoice_items
- sales_returns
- sales_return_items

## POS
- cash_registers
- shifts
- pos_transactions
- pos_transaction_items
- pos_payments
- pos_discounts
- pos_receipts

## Restaurant
- dining_tables
- table_sessions
- qr_menus
- customer_orders
- customer_order_items
- kitchen_orders
- kitchen_order_items
- waiter_calls

## CRM
- leads
- prospects
- customer_activities
- follow_ups
- campaigns

## HR
- employees
- departments
- attendance
- leave_requests
- payroll_profiles

## Finance
- chart_of_accounts
- journal_headers
- journal_details
- cash_accounts
- bank_accounts
- account_receivables
- account_payables
- payments
- receipts
- fixed_assets
- depreciations

## Manufacturing Lite
- bill_of_materials
- bom_items
- production_orders
- production_order_items
- material_consumptions
- finished_goods

## Documents
- attachments
- document_versions
- approvals
- approval_histories
- digital_signatures

## Notifications
- notifications
- notification_templates
- notification_logs

## Reporting
- report_snapshots
- dashboard_widgets

## Core Relationships
- companies └── branches ├── warehouses ├── users ├── customers ├── suppliers
- products ├── product_variants ├── product_barcodes ├── serial_numbers ├── batch_numbers └── stocks
- stocks └── stock_movements
- purchase_orders ├── purchase_order_items └── goods_receipts └── goods_receipt_items
- sales_orders ├── sales_order_items ├── deliveries └── sales_invoices
- customer_orders └── kitchen_orders
- journal_headers └── journal_details

## Estimated Tables
- Master : 25
- Inventory : 20
- Purchasing : 18
- Sales : 18
- POS : 10
- Restaurant : 10
- Finance : 25
- CRM : 8
- HR : 10
- Manufacturing : 10
- Others : 20
- Estimated Total: 160-180 tables after complete implementation.

## Database Standards
- PostgreSQL 17+
- snake_case naming
- bigint identity PK
- UUID for public references where needed
- Foreign keys on all relationships
- Composite indexes where required
- Soft deletes for business entities

## Audit Columns
- created_at
- updated_at
- deleted_at
- created_by
- updated_by

This blueprint is the mandatory reference before generating Laravel migrations.
