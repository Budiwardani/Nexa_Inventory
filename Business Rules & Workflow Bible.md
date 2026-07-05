# Business Rules & Workflow Bible

## Principles
- Every transaction has a lifecycle.
- Every approval is auditable.
- No stock changes without stock movement records.
- No financial posting without journal entries.

## Standard Workflow
- Draft
- Submitted
- Reviewed
- Approved
- Executed
- Completed
- Closed

Terminal states:
- Rejected
- Cancelled

## Inventory Rules
- Negative stock configurable.
- FIFO/Average cost supported.
- Every stock movement creates a stock card and audit log.
- Cycle count creates adjustment transactions.

## Purchasing Workflow
- Purchase Request (PR)
- Request for Quotation (RFQ)
- Quotation
- Purchase Order (PO)
- Goods Receipt
- Supplier Invoice
- Payment

## Manufacturing Focus
This project is focused on manufacturing and should incorporate:
- material flow control
- production orders and finished goods tracking
- stock movement and valuation tied to manufacturing processes
- audit and lifecycle tracking across purchasing, inventory, and production
