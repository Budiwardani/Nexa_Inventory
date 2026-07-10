import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { lazyRoute, layoutLoader, routeLoaders } from './lib/lazyRoutes';
import { RouteFallback } from './components/shared/RouteFallback';

const LoginPage = lazyRoute(routeLoaders['/login']);
const MainLayout = lazyRoute(layoutLoader);
const DashboardPage = lazyRoute(routeLoaders['/']);
const ProductionPage = lazyRoute(routeLoaders['/production']);
const BOMPage = lazyRoute(routeLoaders['/bom']);
const RoutingPage = lazyRoute(routeLoaders['/routing']);
const ProductionOrderPage = lazyRoute(routeLoaders['/production-order']);
const WorkOrderPageReal = lazyRoute(routeLoaders['/work-order']);
const MaterialIssuePageReal = lazyRoute(routeLoaders['/material-issue']);
const MaterialReturnPageReal = lazyRoute(routeLoaders['/material-return']);
const FinishedGoodsPageReal = lazyRoute(routeLoaders['/finished-goods']);
const InventoryPage = lazyRoute(routeLoaders['/inventory']);
const AnalyticsPage = lazyRoute(routeLoaders['/analytics']);

const QualityControlPage = lazyRoute(routeLoaders['/quality-control']);
const ScrapManagementPage = lazyRoute(routeLoaders['/scrap-management']);
const ReworkPage = lazyRoute(routeLoaders['/rework']);
const MachinePage = lazyRoute(routeLoaders['/machines']);
const MaintenancePage = lazyRoute(routeLoaders['/maintenance']);
const DowntimePage = lazyRoute(routeLoaders['/downtime']);
const CapacityPlanningPage = lazyRoute(routeLoaders['/capacity-planning']);
const CostingPage = lazyRoute(routeLoaders['/costing']);
const ChartOfAccountsPage = lazyRoute(routeLoaders['/chart-of-accounts']);
const JournalsPage = lazyRoute(routeLoaders['/journals']);

// Master Data & Conversions
const UnitsPage = lazyRoute(routeLoaders['/units']);
const ConversionsPage = lazyRoute(routeLoaders['/conversions']);
const ConversionSimulatorPage = lazyRoute(routeLoaders['/conversion-simulator']);
const ProductUnitMappingPage = lazyRoute(routeLoaders['/product-units']);
// Inventory
const WarehousePage = lazyRoute(routeLoaders['/warehouses']);
const StockLedgerPage = lazyRoute(routeLoaders['/stock-ledger']);
const StockAdjustmentsPage = lazyRoute(routeLoaders['/stock-adjustments']);
const StockTransfersPage = lazyRoute(routeLoaders['/stock-transfers']);
const DepartmentsPage = lazyRoute(routeLoaders['/departments']);
// Reports
const ReportsPage = lazyRoute(routeLoaders['/reports']);

const NotificationPage = lazyRoute(routeLoaders['/notifications']);
const UsersPage = lazyRoute(routeLoaders['/users']);
const RolesPage = lazyRoute(routeLoaders['/roles']);
const SettingsPage = lazyRoute(routeLoaders['/settings']);
const BrandingPage = lazyRoute(routeLoaders['/branding']);
const SuppliersPage = lazyRoute(routeLoaders['/suppliers']);
const PurchaseOrdersPage = lazyRoute(routeLoaders['/purchase-orders']);
const GoodsReceiptPage = lazyRoute(routeLoaders['/goods-receipt']);

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <Suspense fallback={<RouteFallback />}>
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
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
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
