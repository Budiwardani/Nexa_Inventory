import React from 'react';

type Loader = () => Promise<{ default: React.ComponentType }>;

const load = (importer: () => Promise<any>) =>
  importer as Loader;

/**
 * Central registry of every route's lazy chunk loader.
 * Used both by <App /> (via lazyRoute) and by the sidebar nav for
 * hover/focus prefetching so route transitions feel instant.
 */
export const routeLoaders: Record<string, Loader> = {
  '/login': load(() => import('@/features/auth/routes/LoginPage').then(m => ({ default: m.LoginPage }))),
  '/': load(() => import('@/features/dashboard/routes/DashboardPage').then(m => ({ default: m.DashboardPage }))),
  '/production': load(() => import('@/features/production/routes/ProductionPage').then(m => ({ default: m.ProductionPage }))),
  '/bom': load(() => import('@/features/bom/routes/BOMPage').then(m => ({ default: m.BOMPage }))),
  '/routing': load(() => import('@/features/routing/routes/RoutingPage').then(m => ({ default: m.RoutingPage }))),
  '/production-order': load(() => import('@/features/production-order/routes/ProductionOrderPage').then(m => ({ default: m.ProductionOrderPage }))),
  '/work-order': load(() => import('@/features/work-order/routes/WorkOrderPage').then(m => ({ default: m.WorkOrderPage }))),
  '/inventory': load(() => import('@/features/inventory/routes/InventoryPage').then(m => ({ default: m.InventoryPage }))),
  '/material-issue': load(() => import('@/features/material-issue/routes/MaterialIssuePage').then(m => ({ default: m.MaterialIssuePage }))),
  '/material-return': load(() => import('@/features/material-return/routes/MaterialReturnPage').then(m => ({ default: m.MaterialReturnPage }))),
  '/finished-goods': load(() => import('@/features/finished-goods/routes/FinishedGoodsPage').then(m => ({ default: m.FinishedGoodsPage }))),
  '/quality-control': load(() => import('@/features/quality-control/routes/QualityControlPage').then(m => ({ default: m.QualityControlPage }))),
  '/scrap-management': load(() => import('@/features/scrap-management/routes/ScrapManagementPage').then(m => ({ default: m.ScrapManagementPage }))),
  '/rework': load(() => import('@/features/rework/routes/ReworkPage').then(m => ({ default: m.ReworkPage }))),
  '/maintenance': load(() => import('@/features/maintenance/routes/MaintenancePage').then(m => ({ default: m.MaintenancePage }))),
  '/downtime': load(() => import('@/features/downtime/routes/DowntimePage').then(m => ({ default: m.DowntimePage }))),
  '/capacity-planning': load(() => import('@/features/capacity-planning/routes/CapacityPlanningPage').then(m => ({ default: m.CapacityPlanningPage }))),
  '/costing': load(() => import('@/features/costing/routes/CostingPage').then(m => ({ default: m.CostingPage }))),
  '/chart-of-accounts': load(() => import('@/features/common/routes/ChartOfAccountsPage').then(m => ({ default: m.ChartOfAccountsPage }))),
  '/journals': load(() => import('@/features/common/routes/JournalsPage').then(m => ({ default: m.JournalsPage }))),
  '/units': load(() => import('@/features/master-data/routes/UnitsPage').then(m => ({ default: m.UnitsPage }))),
  '/conversions': load(() => import('@/features/master-data/routes/ConversionsPage').then(m => ({ default: m.ConversionsPage }))),
  '/conversion-simulator': load(() => import('@/features/master-data/routes/ConversionSimulatorPage').then(m => ({ default: m.ConversionSimulatorPage }))),
  '/product-units': load(() => import('@/features/master-data/routes/ProductUnitMappingPage').then(m => ({ default: m.ProductUnitMappingPage }))),
  '/warehouses': load(() => import('@/features/inventory/routes/WarehousePage').then(m => ({ default: m.WarehousePage }))),
  '/stock-ledger': load(() => import('@/features/inventory/routes/StockLedgerPage').then(m => ({ default: m.StockLedgerPage }))),
  '/stock-adjustments': load(() => import('@/features/inventory/routes/StockAdjustmentsPage').then(m => ({ default: m.StockAdjustmentsPage }))),
  '/stock-transfers': load(() => import('@/features/inventory/routes/StockTransfersPage').then(m => ({ default: m.StockTransfersPage }))),
  '/departments': load(() => import('@/features/inventory/routes/DepartmentsPage').then(m => ({ default: m.DepartmentsPage }))),
  '/reports': load(() => import('@/features/reports/routes/ReportsPage').then(m => ({ default: m.ReportsPage }))),
  '/notifications': load(() => import('@/features/notifications/routes/NotificationsPage').then(m => ({ default: m.NotificationsPage }))),
  '/machines': load(() => import('@/features/machines/routes/MachinePage').then(m => ({ default: m.MachinePage }))),
  '/analytics': load(() => import('@/features/analytics/routes/AnalyticsPage').then(m => ({ default: m.AnalyticsPage }))),
  '/users': load(() => import('@/features/users/routes/UsersPage').then(m => ({ default: m.UsersPage }))),
  '/roles': load(() => import('@/features/roles/routes/RolesPage').then(m => ({ default: m.RolesPage }))),
  '/settings': load(() => import('@/features/settings/routes/SettingsPage').then(m => ({ default: m.SettingsPage }))),
  '/branding': load(() => import('@/features/branding/routes/BrandingPage').then(m => ({ default: m.BrandingPage }))),
  '/suppliers': load(() => import('@/features/purchasing/routes/SuppliersPage').then(m => ({ default: m.SuppliersPage }))),
  '/purchase-orders': load(() => import('@/features/purchasing/routes/PurchaseOrdersPage').then(m => ({ default: m.PurchaseOrdersPage }))),
  '/goods-receipt': load(() => import('@/features/purchasing/routes/GoodsReceiptPage').then(m => ({ default: m.GoodsReceiptPage }))),
};

export const layoutLoader: Loader = load(() =>
  import('@/components/layouts/MainLayout').then(m => ({ default: m.MainLayout })),
);

/** Wrap a loader in React.lazy for use in <Route>. */
export const lazyRoute = (loader: Loader) => React.lazy(loader);

/** Warm the chunk cache for a route so navigation is instant. */
export const prefetchRoute = (path: string) => {
  const loader = routeLoaders[path] ?? (path === '' ? routeLoaders['/'] : undefined);
  if (loader) {
    // Fire-and-forget; the dynamic import cache keeps the result for <React.lazy>.
    void loader();
  }
};
