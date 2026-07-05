# Manufacturing Business Rules & Workflow Bible

## Principles
- Every production transaction must be traceable.
- Every material consumption must be recorded.
- Every finished goods receipt must update inventory automatically.
- Every production order must have approval workflow.
- Every production cost must be posted to accounting.
- Every machine activity must be logged.
- Every quality inspection must be recorded.
- Every production history is immutable.
- No production order can bypass workflow.
- All manufacturing transactions are auditable.

---

## Standard Manufacturing Workflow
- Draft
- Planning
- Material Check
- Approval
- Material Reservation
- Production Release
- Production Process
- Quality Inspection
- Finished Goods Receipt
- Cost Posting
- Completed
- Closed

Terminal Status
- Cancelled
- Rejected
- On Hold

---

## Manufacturing Planning
- Demand Forecast
- MRP Calculation
- Capacity Planning
- Production Plan
- Production Schedule
- Production Order

Business Rules
- MRP recommendation can be auto-generated.
- Capacity must be validated before scheduling.
- Material availability must be checked.
- Alternative BOM can be selected.
- Alternative Routing can be selected.

---

## Bill of Materials (BOM)

Workflow
- Draft
- Review
- Approval
- Released
- Active
- Obsolete

Rules
- Every BOM has version.
- Multiple BOM versions allowed.
- Only one Active BOM per product.
- Historical BOM cannot be modified.
- Engineering Change Order creates new version.

---

## Routing

Workflow
- Draft
- Review
- Approval
- Released
- Active

Rules
- Routing defines operation sequence.
- Operation time must be recorded.
- Machine assignment required.
- Operator assignment optional.

---

## Production Order

Workflow
- Draft
- Material Check
- Approval
- Released
- In Progress
- Quality Inspection
- Completed
- Closed

Possible Status
- Cancelled
- Rejected
- Paused

Rules
- Cannot release if material unavailable.
- Cannot close before QC completed.
- Cannot receive FG before production completed.
- Every completion updates inventory.

---

## Work Order

Workflow
- Assigned
- Started
- Paused
- Resumed
- Completed
- Closed

Rules
- Each work order belongs to one production order.
- Machine assignment mandatory.
- Operator assignment required.
- Downtime must be recorded.

---

## Material Issue

Workflow
- Request
- Approval
- Issue Material
- Production Consumption
- Remaining Material Return

Rules
- Issue only available stock.
- FIFO supported.
- Average Cost supported.
- Batch tracking supported.
- Serial tracking supported.

---

## Material Return

Workflow
- Create Return
- Warehouse Validation
- Inventory Update
- Completed

Rules
- Unused material returns to warehouse.
- Return quantity cannot exceed issued quantity.

---

## Finished Goods Receipt

Workflow
- Production Complete
- QC Passed
- Receive Finished Goods
- Inventory Update
- Journal Posting
- Completed

Rules
- Inventory increases automatically.
- Cost automatically calculated.
- Batch automatically generated if enabled.
- Serial automatically generated if enabled.

---

## Quality Control

Workflow
- Incoming QC
- In Process QC
- Final QC
- Pass or Fail
- Rework or Scrap

Rules
- Failed inspection cannot become Finished Goods.
- QC history cannot be deleted.
- Corrective action required for failed QC.

---

## Scrap Management

Workflow
- Identify Scrap
- Approval
- Cost Calculation
- Inventory Adjustment
- Completed

Rules
- Scrap reason mandatory.
- Scrap affects production cost.
- Scrap recorded permanently.

---

## Rework

Workflow
- QC Failed
- Rework Request
- Approval
- Rework Production
- QC Reinspection
- Completed

Rules
- Multiple rework cycles supported.
- Rework cost tracked separately.

---

## Machine Maintenance

Workflow
- Schedule
- Notification
- Maintenance
- Inspection
- Completed

Rules
- Preventive maintenance supported.
- Corrective maintenance supported.
- Machine unavailable during maintenance.

---

## Machine Downtime

Workflow
- Machine Stop
- Downtime Record
- Root Cause
- Repair
- Resume Production

Rules
- Downtime reason mandatory.
- OEE affected automatically.

---

## Capacity Planning

Workflow
- Forecast
- Machine Capacity
- Operator Capacity
- Available Hours
- Production Allocation
- Approved

Rules
- Cannot exceed machine capacity.
- Cannot exceed operator capacity.
- Holiday calendar considered.
- Shift calendar considered.

---

## Costing

Automatically Calculate
- Material Cost
- Labor Cost
- Machine Cost
- Overhead
- Outsource Cost
= Production Cost

Rules
- Automatic journal posting.
- Variance calculated.
- Actual vs Standard Cost comparison.

---

## Inventory Integration

Workflow
- Production Release
- Material Issue
- Stock Out
- Production Complete
- Finished Goods
- Stock In
- Journal

Rules
- Every movement creates Stock Card.
- Every movement updates Inventory Valuation.

---

## Accounting Integration

Workflow
- Production Release
- WIP Account
- Production Complete
- Finished Goods Account
- COGS Ready
- General Ledger

Rules
- Automatic Journal Entry.
- Supports Cost Center.
- Supports Project Code.
- Supports Department.

---

## Notification Rules

Notify when
- Production Order Approved
- Production Started
- Production Delayed
- Machine Breakdown
- QC Failed
- QC Passed
- Material Shortage
- Finished Goods Completed
- Production Closed

Notifications
- Web
- Mobile
- Email
- WhatsApp
- In App

---

## Dashboard KPI
- Production Today
- Production Efficiency
- OEE
- Machine Utilization
- Downtime
- Scrap Rate
- Rework Rate
- Material Usage
- Production Cost
- Output
- Target vs Actual

---

## Audit Rules
Every Manufacturing transaction records
- Created By
- Updated By
- Approved By
- Timestamp
- Machine
- Operator
- Warehouse
- Branch
- Company
- IP Address
- Device

Rules
- Audit records are immutable.

---

## Enterprise Principles
- No production without approved BOM.
- No production without approved Routing.
- No inventory movement without transaction.
- No QC bypass.
- No journal bypass.
- No cost bypass.
- Everything is traceable.
- Everything is auditable.
- Everything is versioned.
- Everything is recoverable.
