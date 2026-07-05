# Nexa-Inv Manufacturing Database Blueprint (Enterprise)

This is the logical PostgreSQL blueprint for the Manufacturing (MRP Lite) module.

## Engineering
- engineering_change_orders
- engineering_documents
- product_specifications
- bill_of_materials
- bom_versions
- bom_items
- routings
- routing_operations
- operation_instructions

## Planning
- production_plans
- production_plan_items
- mrp_runs
- mrp_recommendations
- demand_forecasts
- capacity_plans
- production_calendars
- work_shifts

## Production
- production_orders
- production_order_items
- work_orders
- work_order_operations
- operator_assignments
- machine_assignments
- production_progress
- production_outputs
- finished_goods_receipts

## Material
- material_reservations
- material_issue_headers
- material_issue_items
- material_returns
- material_return_items
- material_consumptions
- production_scraps
- production_reworks
- by_products

## Quality
- qc_plans
- qc_checklists
- qc_inspections
- qc_results
- qc_nonconformities
- qc_corrective_actions

## Machine & Maintenance
- machines
- machine_groups
- work_centers
- production_lines
- machine_maintenance_plans
- machine_maintenance_logs
- machine_downtimes
- calibration_records

## Costing
- production_costs
- labor_costs
- overhead_costs
- material_costs
- production_variances

## Reporting
- production_dashboards
- production_kpis
- oee_reports
- production_histories

## Core Relationships
- products
  └── bill_of_materials
  └── bom_items
- bill_of_materials
  └── bom_versions
- routings
  └── routing_operations
- production_plans
  └── production_orders
  └── work_orders
    ├── work_order_operations
    ├── material_issue_items
    ├── qc_inspections
    └── production_outputs
- machines
  ├── machine_downtimes
  └── machine_maintenance_logs
- work_centers
  └── production_lines
- production_orders
  └── production_costs

## Workflow
- Forecast
- MRP
- Production Plan
- Production Order
- Work Order
- Material Issue
- Production
- QC
- Finished Goods Receipt
- Cost Posting
- Close Order

## Estimated Tables
- Engineering: 10
- Planning: 8
- Production: 9
- Material: 8
- Quality: 6
- Machine: 8
- Costing: 5
- Reporting: 4
- Estimated Total: 58–65 tables.

## Database Standards
- PostgreSQL 17+
- snake_case
- bigint identity PK
- UUID for external references
- Foreign keys on all business relationships
- Composite indexes
- Audit columns:
  - created_at
  - updated_at
  - deleted_at
  - created_by
  - updated_by
- Soft deletes on master tables
- Transaction-based production posting
- Immutable production history
- Queue and notification ready

This document is the manufacturing database reference before creating Laravel migrations.
