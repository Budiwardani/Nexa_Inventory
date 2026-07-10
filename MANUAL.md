# Nexa-Inv — User Manual

## 1. Introduction
Nexa-Inv is a complete Enterprise Resource Planning (ERP) platform for manufacturing and inventory management. This manual covers how to navigate the system and execute standard business workflows.

## 2. Getting Started
- **Login:** Use your credentials to log in. Default superadmin: `superadmin@nexa-mfg.com` / `superadmin123`.
- **Navigation:** Use the left sidebar to access different modules. The sidebar is divided into logical sections like Production, Inventory, Master Data, Reports, etc.

## 3. Master Data Management
Before running transactions, ensure your Master Data is set up:
- **Units & Conversions:** Go to `Master Config -> Base Units` to create units (e.g., Kg, Pcs). Set up conversions in `Conversion Matrix`.
- **Departments:** Go to `Master Config -> Departments & Units` to create divisions like 'Production', 'QC', or 'Warehouse'.
- **Warehouses:** Go to `Inventory -> Warehouses & Zones` to define where physical stock is kept.

## 4. Inventory Workflows
- **Stock Adjustments:** If physical stock doesn't match the system, go to `Inventory -> Stock Adjustments`, select the warehouse, input the difference (+ or -), and post the adjustment.
- **Stock Transfers:** To move items, go to `Inventory -> Stock Transfers`. Select the Source Warehouse, then choose whether the destination is another Warehouse or a Department.
- **Viewing Stock:** Go to `Inventory Reports -> Stock Summary` to see current on-hand, reserved, and available quantities. View `Stock Ledger` for historical movements.

## 5. Manufacturing Workflows
- **Setup BOM & Routing:** Define the recipe in `Production -> BOM` and the steps in `Production -> Routing`.
- **Production Order:** Create an order in `Production -> Production Order`. Release the order to begin work.
- **Material Issue:** When production starts, issue raw materials via `Inventory -> Material Issue`.
- **Quality Control:** Inspect output in `Quality & Machines -> Quality Control`. Mark items as Pass or Fail.
- **Finished Goods:** After passing QC, receive the finished product into inventory via `Inventory -> Finished Goods`.

## 6. Advanced Operations (Phase 3)
- **Scrap & Rework:** If items fail QC, log them in `Scrap Management` or send them to `Rework`.
- **Machines & Maintenance:** Register machinery in `Machines`. Log regular maintenance or track breakdowns in `Downtime`.
- **Costing:** View the financial impact of production (Material, Labor, Overhead) in `Planning & Finance -> Costing`.
- **Analytics & Capacity:** Check machine availability and production schedules in `Capacity Planning`.

## 7. Purchasing Workflows
- **Suppliers:** Manage vendors in `Purchasing -> Suppliers`.
- **Purchase Orders:** Create orders in `Purchase Orders`.
- **Goods Receipt:** Once items arrive from the supplier, receive them via `Goods Receipt` to automatically update stock.

## 8. Roles & Permissions
- Users only see the modules their Role permits.
- If you encounter a "Forbidden" error or cannot see a menu item, contact your Administrator to update your permissions in `Administration -> Roles & Permissions`.

## 9. Exporting Data
Most lists and reports (like Inventory Reports) feature an "Export CSV" button. Clicking this will download the currently filtered view directly to your computer.
