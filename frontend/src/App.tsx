import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('./features/auth/routes/LoginPage').then(m => ({ default: m.LoginPage })));
const MainLayout = React.lazy(() => import('./components/layouts/MainLayout').then(m => ({ default: m.MainLayout })));
const DashboardPage = React.lazy(() => import('./features/dashboard/routes/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProductionPage = React.lazy(() => import('./features/production/routes/ProductionPage').then(m => ({ default: m.ProductionPage })));
const BOMPage = React.lazy(() => import('./features/bom/routes/BOMPage').then(m => ({ default: m.BOMPage })));
const RoutingPage = React.lazy(() => import('./features/routing/routes/RoutingPage').then(m => ({ default: m.RoutingPage })));
const WorkOrderPageReal = React.lazy(() => import('./features/work-order/routes/WorkOrderPage').then(m => ({ default: m.WorkOrderPage })));
const MaterialIssuePageReal = React.lazy(() => import('./features/material-issue/routes/MaterialIssuePage').then(m => ({ default: m.MaterialIssuePage })));
const MaterialReturnPageReal = React.lazy(() => import('./features/material-return/routes/MaterialReturnPage').then(m => ({ default: m.MaterialReturnPage })));
const FinishedGoodsPageReal = React.lazy(() => import('./features/finished-goods/routes/FinishedGoodsPage').then(m => ({ default: m.FinishedGoodsPage })));
const ProductionOrderPage = React.lazy(() => import('./features/production-order/routes/ProductionOrderPage').then(m => ({ default: m.ProductionOrderPage })));
const InventoryPage = React.lazy(() => import('./features/inventory/routes/InventoryPage').then(m => ({ default: m.InventoryPage })));
const AnalyticsPage = React.lazy(() => import('./features/analytics/routes/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));


const QualityControlPage = React.lazy(() => import('./features/quality-control/routes/QualityControlPage').then(m => ({ default: m.QualityControlPage })));
const ScrapManagementPage = React.lazy(() => import('./features/scrap-management/routes/ScrapManagementPage').then(m => ({ default: m.ScrapManagementPage })));
const ReworkPage = React.lazy(() => import('./features/rework/routes/ReworkPage').then(m => ({ default: m.ReworkPage })));
const MachinePage = React.lazy(() => import('./features/machines/routes/MachinePage').then(m => ({ default: m.MachinePage })));
const MaintenancePage = React.lazy(() => import('./features/maintenance/routes/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const DowntimePage = React.lazy(() => import('./features/downtime/routes/DowntimePage').then(m => ({ default: m.DowntimePage })));
const CapacityPlanningPage = React.lazy(() => import('./features/capacity-planning/routes/CapacityPlanningPage').then(m => ({ default: m.CapacityPlanningPage })));
const CostingPage = React.lazy(() => import('./features/costing/routes/CostingPage').then(m => ({ default: m.CostingPage })));
const ChartOfAccountsPage = React.lazy(() => import('./features/common/routes/ChartOfAccountsPage').then(m => ({ default: m.ChartOfAccountsPage })));
const JournalsPage = React.lazy(() => import('./features/common/routes/JournalsPage').then(m => ({ default: m.JournalsPage })));

// Master Data & Conversions
const UnitsPage = React.lazy(() => import('./features/master-data/routes/UnitsPage').then(m => ({ default: m.UnitsPage })));
const ConversionsPage = React.lazy(() => import('./features/master-data/routes/ConversionsPage').then(m => ({ default: m.ConversionsPage })));
const ConversionSimulatorPage = React.lazy(() => import('./features/master-data/routes/ConversionSimulatorPage').then(m => ({ default: m.ConversionSimulatorPage })));
const ProductUnitMappingPage = React.lazy(() => import('./features/master-data/routes/ProductUnitMappingPage').then(m => ({ default: m.ProductUnitMappingPage })));
// Inventory
const WarehousePage = React.lazy(() => import('./features/inventory/routes/WarehousePage').then(m => ({ default: m.WarehousePage })));
const StockLedgerPage = React.lazy(() => import('./features/inventory/routes/StockLedgerPage').then(m => ({ default: m.StockLedgerPage })));
const StockAdjustmentsPage = React.lazy(() => import('./features/inventory/routes/StockAdjustmentsPage').then(m => ({ default: m.StockAdjustmentsPage })));
const StockTransfersPage = React.lazy(() => import('./features/inventory/routes/StockTransfersPage').then(m => ({ default: m.StockTransfersPage })));

const NotificationPage = React.lazy(() => import('./features/notifications/routes/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const UsersPage = React.lazy(() => import('./features/users/routes/UsersPage').then(m => ({ default: m.UsersPage })));
const RolesPage = React.lazy(() => import('./features/roles/routes/RolesPage').then(m => ({ default: m.RolesPage })));
const SettingsPage = React.lazy(() => import('./features/settings/routes/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BrandingPage = React.lazy(() => import('./features/branding/routes/BrandingPage').then(m => ({ default: m.BrandingPage })));
const SuppliersPage = React.lazy(() => import('./features/purchasing/routes/SuppliersPage').then(m => ({ default: m.SuppliersPage })));
const PurchaseOrdersPage = React.lazy(() => import('./features/purchasing/routes/PurchaseOrdersPage').then(m => ({ default: m.PurchaseOrdersPage })));
const GoodsReceiptPage = React.lazy(() => import('./features/purchasing/routes/GoodsReceiptPage').then(m => ({ default: m.GoodsReceiptPage })));

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
          <Route path="work-order" element={<WorkOrderPageReal />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="material-issue" element={<MaterialIssuePageReal />} />
          <Route path="material-return" element={<MaterialReturnPageReal />} />
          <Route path="finished-goods" element={<FinishedGoodsPageReal />} />
          <Route path="quality-control" element={<QualityControlPage />} />
          <Route path="scrap-management" element={<ScrapManagementPage />} />
          <Route path="rework" element={<ReworkPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="downtime" element={<DowntimePage />} />
          <Route path="capacity-planning" element={<CapacityPlanningPage />} />
          <Route path="costing" element={<CostingPage />} />
          <Route path="chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="journals" element={<JournalsPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="conversions" element={<ConversionsPage />} />
          <Route path="conversion-simulator" element={<ConversionSimulatorPage />} />
          <Route path="product-units" element={<ProductUnitMappingPage />} />
          <Route path="warehouses" element={<WarehousePage />} />
          <Route path="stock-ledger" element={<StockLedgerPage />} />
          <Route path="stock-adjustments" element={<StockAdjustmentsPage />} />
          <Route path="stock-transfers" element={<StockTransfersPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="machines" element={<MachinePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="branding" element={<BrandingPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="goods-receipt" element={<GoodsReceiptPage />} />
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
