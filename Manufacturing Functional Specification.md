# Nexa-MFG Enterprise - Manufacturing Functional Specification (UI & Form Bible)

This document serves as the single source of truth for the User Interface, Form Fields, Validation Rules, CRUD Actions, and Business Workflow for all Manufacturing Modules. It ensures UI consistency and functional completeness across the platform.

---

## 1. Production Order

### 1.1 Header Form
- **Production Order No** *(Required, Auto-generated/String)*
- **Production Date** *(Required, DatePicker)*
- **Company** *(Required, Lookup/Dropdown)*
- **Branch** *(Required, Lookup/Dropdown)*
- **Plant** *(Required, Lookup/Dropdown)*
- **Warehouse** *(Required, Lookup/Dropdown)*
- **Production Plan** *(Required, Lookup/Dropdown)*
- **BOM** *(Required, Lookup/Dropdown)*
- **BOM Version** *(Required, Dropdown)*
- **Routing** *(Required, Lookup/Dropdown)*
- **Production Type** *(Dropdown)*
- **Priority** *(Dropdown: Low, Medium, High, Critical)*
- **Production Status** *(System Managed: Draft, Pending Approval, Released, Started, Delayed, Finished, Closed)*
- **Due Date** *(DatePicker)*
- **Description** *(TextArea)*
- **Remarks** *(TextArea)*

### 1.2 Detail Form (Tabs)

#### Tab 1: Products
- **Product** *(Lookup)*
- **Variant** *(Dropdown)*
- **Batch** *(Text)*
- **Serial** *(Text)*
- **Target Qty** *(Number)*
- **UOM** *(Dropdown)*
- **Completed Qty** *(Number, ReadOnly)*
- **Reject Qty** *(Number, ReadOnly)*
- **Scrap Qty** *(Number, ReadOnly)*
- **Remaining Qty** *(Number, ReadOnly)*

#### Tab 2: Material Requirement
- **Material Code** *(Lookup)*
- **Material Name** *(Text, ReadOnly)*
- **Warehouse** *(Dropdown)*
- **Required Qty** *(Number)*
- **Reserved Qty** *(Number, ReadOnly)*
- **Issued Qty** *(Number, ReadOnly)*
- **Returned Qty** *(Number, ReadOnly)*
- **Consumed Qty** *(Number, ReadOnly)*
- **Remaining Qty** *(Number, ReadOnly)*

#### Tab 3: Machine Assignment
- **Machine** *(Lookup)*
- **Machine Group** *(Dropdown)*
- **Work Center** *(Dropdown)*
- **Production Line** *(Dropdown)*
- **Start Time** *(DateTimePicker)*
- **End Time** *(DateTimePicker)*
- **Estimated Hours** *(Number)*
- **Actual Hours** *(Number, ReadOnly)*

#### Tab 4: Operator Assignment
- **Employee** *(Lookup)*
- **Role** *(Dropdown)*
- **Shift** *(Dropdown)*
- **Start Time** *(DateTimePicker)*
- **End Time** *(DateTimePicker)*
- **Performance %** *(Number, ReadOnly)*

### 1.3 Approval Flow
`Draft` ➔ `Supervisor` ➔ `Production Manager` ➔ `Plant Manager` ➔ `Released`

### 1.4 Actions & CRUD
- Create
- Edit
- Submit
- Approve
- Reject
- Cancel
- Release
- Close
- Print
- Export PDF
- Export Excel
- History
- Audit Log

### 1.5 Notification Triggers
- Production Created
- Production Approved
- Production Released
- Production Started
- Production Delayed
- Production Finished
- Production Closed

### 1.6 Audit Trail (Applied to all modules)
- Created By
- Created At
- Updated By
- Updated At
- Approved By
- Approved At
- Branch
- Company
- IP
- Device

---

## 2. Bill of Materials (BOM)

### 2.1 Header Form
- **BOM No** *(Required, Auto-generated)*
- **Product** *(Required, Lookup)*
- **Variant** *(Dropdown)*
- **UOM** *(Required, Dropdown)*
- **Base Qty** *(Required, Number)*
- **Description** *(TextArea)*
- **Status** *(System Managed: Draft, Active, Obsolete)*

### 2.2 Detail/Grid
- **Component Item** *(Lookup)*
- **Quantity** *(Number)*
- **UOM** *(Dropdown)*
- **Scrap %** *(Number)*
- **Is Critical** *(Checkbox)*

### 2.3 Versioning
- **Version Number** *(Auto-increment)*
- **Effective Date** *(DatePicker)*
- **End Date** *(DatePicker)*
- **Change Notes** *(TextArea)*

### 2.4 Approval Flow
`Draft` ➔ `Engineering Manager` ➔ `Active`

### 2.5 Actions & CRUD
- Create, Edit, View, Obsolete, Create New Version, Approve, Reject, Export, Audit Log.

---

## 3. Routing

### 3.1 Header Form
- **Routing No** *(Required, Auto-generated)*
- **Product** *(Required, Lookup)*
- **Description** *(TextArea)*
- **Status** *(Draft, Active, Obsolete)*

### 3.2 Operation Details
- **Operation Seq** *(Number)*
- **Operation Name** *(Text)*
- **Work Center** *(Lookup)*
- **Machine Group** *(Lookup)*

### 3.3 Time Standard
- **Setup Time** *(Number, Minutes)*
- **Run Time** *(Number, Minutes/Unit)*
- **Move Time** *(Number, Minutes)*

### 3.4 Actions & CRUD
- Create, Edit, View, Approve, Reject, Audit Log.

---

## 4. Work Order

### 4.1 Header Form
- **Work Order No** *(Auto-generated)*
- **Production Order No** *(Lookup)*
- **Product** *(Lookup)*
- **Target Qty** *(Number)*
- **Status** *(Pending, In Progress, On Hold, Completed)*

### 4.2 Material & Operator Details (Tabs)
- **Material Allocation** *(List of materials to pick)*
- **Assigned Operators** *(List of employees/shifts)*
- **QC Parameters** *(List of quality checks)*

### 4.3 Actions & CRUD
- Create, Edit, View, Start, Pause, Complete, Audit Log.

---

## 5. Material Issue

### 5.1 Header Form
- **Issue No** *(Auto-generated)*
- **Production Order No** *(Lookup)*
- **Warehouse** *(Lookup)*
- **Issue Date** *(DatePicker)*
- **Status** *(Draft, Issued)*

### 5.2 Item Detail (Batch/Serial)
- **Material** *(Lookup)*
- **Batch No** *(Lookup/Dropdown)*
- **Serial No** *(Lookup/Dropdown)*
- **Issue Qty** *(Number)*

### 5.3 Approval Flow
`Draft` ➔ `Warehouse Manager` ➔ `Issued`

### 5.4 Actions & CRUD
- Create, Edit, Submit, Approve, Reject, Print Pick List, Audit Log.

---

## 6. Quality Control (QC)

### 6.1 Header Form
- **Inspection No** *(Auto-generated)*
- **Reference Document** *(Production Order / Receipt)*
- **Item** *(Lookup)*
- **Inspector** *(Lookup)*
- **Inspection Date** *(DatePicker)*
- **Overall Result** *(Pass, Fail, Conditional)*

### 6.2 Checklist & Result
- **Parameter** *(Text)*
- **Expected Value / Range** *(Text/Number)*
- **Actual Value** *(Text/Number)*
- **Result** *(Pass/Fail)*
- **Attachment** *(File Upload)*

### 6.3 Approval Flow
`Draft` ➔ `QC Manager` ➔ `Approved`

---

## 7. Maintenance

### 7.1 Header Form
- **Maintenance Order No** *(Auto-generated)*
- **Machine** *(Lookup)*
- **Maintenance Type** *(Preventive, Breakdown)*
- **Status** *(Scheduled, In Progress, Completed)*

### 7.2 Details
- **Schedule Date** *(DatePicker)*
- **Checklist** *(List of tasks)*
- **Cost Details** *(Spare parts, Labor hours)*

---

## 8. Scrap & Rework

### 8.1 Scrap Header & Details
- **Scrap No** *(Auto-generated)*
- **Production Order** *(Lookup)*
- **Item & Qty** *(Number)*
- **Reason Code** *(Dropdown)*
- **Approval Flow** `Draft` ➔ `Production Manager` ➔ `Approved`

### 8.2 Rework Header & Details
- **Rework No** *(Auto-generated)*
- **Original Production Order** *(Lookup)*
- **Root Cause** *(TextArea)*
- **Additional Material/Cost** *(Grid)*

---

## 9. Capacity Planning

### 9.1 Capacity Details
- **Machine/Work Center** *(Lookup)*
- **Shift** *(Dropdown)*
- **Calendar** *(Working Days/Holidays)*
- **Allocation** *(Gantt Chart / Grid View)*

---

## 10. Costing

### 10.1 Cost Details
- **Material Cost** *(Calculated from consumed materials)*
- **Labor Cost** *(Calculated from operator hours)*
- **Overhead Cost** *(Fixed/Variable allocations)*
- **Variance Analysis** *(Target vs Actual)*

---

## 11. Notification & Dashboard

### 11.1 Notification Configuration
- **Rule Name** *(Text)*
- **Trigger Event** *(Dropdown: On Create, On Approve, On Delay, etc.)*
- **Channel** *(In-App, Email, SMS)*
- **Recipient** *(Roles / Specific Users)*

### 11.2 Dashboard
- **Widgets** *(Charts, KPI Cards, Data Tables)*
- **Filters** *(Date Range, Branch, Plant)*
- **KPIs** *(OEE, Yield Rate, Downtime, Cost Variance)*
