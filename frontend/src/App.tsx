import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('./features/auth/routes/LoginPage').then(m => ({ default: m.LoginPage })));
const MainLayout = React.lazy(() => import('./components/layouts/MainLayout').then(m => ({ default: m.MainLayout })));
const DashboardPage = React.lazy(() => import('./features/dashboard/routes/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProductionPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Production" description="Manage production workflow, orders, and manufacturing execution according to the business rules." highlights={[
  'Every production order must have approval workflow.',
  'Production cannot complete before QC and inventory update.',
  'Material availability is validated before release.',
]}/> })));
const BOMPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Bill of Materials (BOM)" description="Create, version, and approve BOMs for manufacturing bills of materials." highlights={[
  'Every BOM has version.',
  'Only one active BOM per product.',
  'Engineering change order creates a new version.',
]}/> })));
const RoutingPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Routing" description="Define operation sequences and machine assignments for manufacturing routes." highlights={[
  'Routing defines operation sequence.',
  'Operation time must be recorded.',
  'Machine assignment is required.',
]}/> })));
const ProductionOrderPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Production Order" description="Manage production orders from planning through completion and QC." highlights={[
  'Cannot release if material unavailable.',
  'Cannot close before QC is completed.',
  'Every completion updates inventory.',
]}/> })));
const InventoryPage = React.lazy(() => import('./features/inventory/routes/InventoryPage').then(m => ({ default: m.InventoryPage })));
const AnalyticsPage = React.lazy(() => import('./features/analytics/routes/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));

const WorkOrderPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Work Order" description="Track work orders, machine assignment, and operator progress for production execution." highlights={[
  'Each work order belongs to one production order.',
  'Machine assignment is mandatory.',
  'Downtime must be recorded.',
]}/> })));
const MaterialIssuePage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Material Issue" description="Issue materials for production with stock checks and tracking rules." highlights={[
  'Issue only available stock.',
  'FIFO and batch tracking are supported.',
  'Serial tracking is supported when enabled.',
]}/> })));
const MaterialReturnPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Material Return" description="Process material returns, warehouse validation, and inventory updates." highlights={[
  'Unused material returns to warehouse.',
  'Return quantity cannot exceed issued quantity.',
  'Inventory is updated on completed returns.',
]}/> })));
const FinishedGoodsPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Finished Goods Receipt" description="Receive finished goods and post inventory and journal updates automatically." highlights={[
  'Inventory increases automatically.',
  'Cost is calculated automatically.',
  'Batch and serial generation is supported.',
]}/> })));
const QualityControlPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Quality Control" description="Manage QC workflows and inspections for incoming, in-process, and final checks." highlights={[
  'Failed inspection cannot become finished goods.',
  'QC history cannot be deleted.',
  'Corrective action is required for failed QC.',
]}/> })));
const ScrapManagementPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Scrap Management" description="Record scrap, calculate costs, and adjust inventory permanently." highlights={[
  'Scrap reason is mandatory.',
  'Scrap affects production cost.',
  'Scrap is recorded permanently.',
]}/> })));
const ReworkPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Rework" description="Coordinate rework cycles after QC failures and track reinspection workflow." highlights={[
  'Multiple rework cycles are supported.',
  'Rework cost is tracked separately.',
  'Rework follows approval and QC reinspection.',
]}/> })));
const MaintenancePage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Machine Maintenance" description="Schedule and record preventive and corrective machine maintenance." highlights={[
  'Maintenance is scheduled and inspected.',
  'Machine is unavailable during maintenance.',
  'Preventive and corrective maintenance are supported.',
]}/> })));
const DowntimePage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Machine Downtime" description="Capture downtime events, root causes, and repair status for OEE tracking." highlights={[
  'Downtime reason is mandatory.',
  'OEE is affected automatically.',
  'Root cause and repair are recorded.',
]}/> })));
const CapacityPlanningPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Capacity Planning" description="Manage capacity forecasts, machine availability, and shift planning." highlights={[
  'Cannot exceed machine and operator capacity.',
  'Holiday and shift calendars are considered.',
  'Production allocation requires approval.',
]}/> })));
const CostingPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Costing" description="Track material, labor, machine, and overhead costs against production output." highlights={[
  'Automatic journal posting is supported.',
  'Variance between actual and standard cost is computed.',
  'Production cost includes material, labor, and overhead.',
]}/> })));
const AccountingPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Accounting Integration" description="Integrate production and inventory movements with general ledger and WIP accounting." highlights={[
  'Automatic journal entries are created on production events.',
  'Supports cost center, project code, and department.',
  'Finished goods and COGS accounts are updated automatically.',
]}/> })));
const NotificationPage = React.lazy(() => import('./features/common/routes/ModulePage').then(m => ({ default: () => <m.ModulePage title="Notifications" description="Notify stakeholders about key manufacturing events via web, email, and mobile channels." highlights={[
  'Notifications trigger for production approval, delay, and failure.',
  'Supports web, mobile, email, WhatsApp and in-app alerts.',
  'Critical events are surfaced immediately.',
]}/> })));
const UsersPage = React.lazy(() => import('./features/users/routes/UsersPage').then(m => ({ default: m.UsersPage })));
const RolesPage = React.lazy(() => import('./features/roles/routes/RolesPage').then(m => ({ default: m.RolesPage })));
const SettingsPage = React.lazy(() => import('./features/settings/routes/SettingsPage').then(m => ({ default: m.SettingsPage })));

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="bom" element={<BOMPage />} />
          <Route path="routing" element={<RoutingPage />} />
          <Route path="production-order" element={<ProductionOrderPage />} />
          <Route path="work-order" element={<WorkOrderPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="material-issue" element={<MaterialIssuePage />} />
          <Route path="material-return" element={<MaterialReturnPage />} />
          <Route path="finished-goods" element={<FinishedGoodsPage />} />
          <Route path="quality-control" element={<QualityControlPage />} />
          <Route path="scrap-management" element={<ScrapManagementPage />} />
          <Route path="rework" element={<ReworkPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="downtime" element={<DowntimePage />} />
          <Route path="capacity-planning" element={<CapacityPlanningPage />} />
          <Route path="costing" element={<CostingPage />} />
          <Route path="accounting" element={<AccountingPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
