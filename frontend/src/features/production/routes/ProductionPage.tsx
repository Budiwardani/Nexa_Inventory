import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardList, Factory, Package, ArrowRight,
  CheckCircle2, Clock, AlertTriangle, BarChart3,
} from 'lucide-react';

const useProductionStats = () => useQuery({
  queryKey: ['production-stats'],
  queryFn: async () => {
    const [poRes, woRes] = await Promise.allSettled([
      api.get('/production-orders?page=1&per_page=100'),
      api.get('/work-orders?page=1&per_page=100'),
    ]);
    const orders = poRes.status === 'fulfilled' && poRes.value.data?.success
      ? (poRes.value.data.data ?? []) : [];
    const workOrders = woRes.status === 'fulfilled' && woRes.value.data?.success
      ? (woRes.value.data.data ?? []) : [];
    return { orders, workOrders };
  },
});

const statusColor: Record<string, string> = {
  Draft:       'bg-gray-100 text-gray-700',
  Submitted:   'bg-blue-100 text-blue-700',
  Approved:    'bg-indigo-100 text-indigo-700',
  Released:    'bg-cyan-100 text-cyan-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Completed:   'bg-green-100 text-green-700',
  Closed:      'bg-purple-100 text-purple-700',
  Cancelled:   'bg-red-100 text-red-700',
};

export const ProductionPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useProductionStats();

  const orders: any[] = data?.orders ?? [];
  const workOrders: any[] = data?.workOrders ?? [];

  const totalPO       = orders.length;
  const inProgressPO  = orders.filter(o => o.status === 'In Progress' || o.status === 'Released').length;
  const completedPO   = orders.filter(o => o.status === 'Completed').length;
  const draftPO       = orders.filter(o => o.status === 'Draft').length;

  const modules = [
    {
      icon: <ClipboardList size={22} className="text-blue-600" />,
      title: 'Bill of Materials',
      description: 'Define product structure, components, and quantities',
      to: '/bom',
      color: 'bg-blue-50',
    },
    {
      icon: <BarChart3 size={22} className="text-violet-600" />,
      title: 'Routing',
      description: 'Set up work centers, operations, and production steps',
      to: '/routing',
      color: 'bg-violet-50',
    },
    {
      icon: <Factory size={22} className="text-orange-600" />,
      title: 'Production Order',
      description: 'Create, approve, and track production orders',
      to: '/production-order',
      color: 'bg-orange-50',
    },
    {
      icon: <Package size={22} className="text-green-600" />,
      title: 'Work Order',
      description: 'Manage tasks, machines, and operators per operation',
      to: '/work-order',
      color: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Production</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview production workflow — orders, work orders, BOM, and routing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Orders', value: isLoading ? '…' : totalPO, icon: <Factory size={18} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'In Progress', value: isLoading ? '…' : inProgressPO, icon: <Clock size={18} />, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Completed', value: isLoading ? '…' : completedPO, icon: <CheckCircle2 size={18} />, color: 'text-green-600 bg-green-50' },
          { label: 'Draft', value: isLoading ? '…' : draftPO, icon: <AlertTriangle size={18} />, color: 'text-gray-600 bg-gray-100' },
        ].map(stat => (
          <Card key={stat.label} className="border border-border/60">
            <CardContent className="flex items-center gap-3 p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module shortcuts */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map(mod => (
          <Card
            key={mod.to}
            className="cursor-pointer border border-border/60 hover:border-primary/40 hover:shadow-md transition-all group"
            onClick={() => navigate(mod.to)}
          >
            <CardHeader className="pb-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${mod.color}`}>
                {mod.icon}
              </div>
              <CardTitle className="text-base">{mod.title}</CardTitle>
              <CardDescription className="text-xs">{mod.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" size="sm" className="px-0 text-primary group-hover:underline">
                Open <ArrowRight size={14} className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Production Orders */}
      <Card className="border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Recent Production Orders</CardTitle>
            <CardDescription className="text-xs">Latest 10 production orders</CardDescription>
          </div>
          <Button size="sm" onClick={() => navigate('/production-order')}>
            <Factory size={14} className="mr-1" /> Manage Orders
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Factory size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No production orders yet.</p>
              <Button className="mt-3" size="sm" onClick={() => navigate('/production-order')}>
                + Create First Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-2 px-3">Order No</th>
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Description</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => navigate('/production-order')}
                    >
                      <td className="py-2.5 px-3 font-medium">{order.production_order_no}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{order.production_date}</td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">{order.description || '—'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Work Orders */}
      {workOrders.length > 0 && (
        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Work Orders</CardTitle>
              <CardDescription className="text-xs">Latest 5 work orders</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/work-order')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-2 px-3">WO No</th>
                    <th className="text-left py-2 px-3">Product</th>
                    <th className="text-left py-2 px-3">Target Qty</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.slice(0, 5).map((wo: any) => (
                    <tr
                      key={wo.id}
                      className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => navigate('/work-order')}
                    >
                      <td className="py-2.5 px-3 font-medium">{wo.wo_no}</td>
                      <td className="py-2.5 px-3">{wo.product}</td>
                      <td className="py-2.5 px-3">{wo.target_qty} {wo.uom}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[wo.status] || 'bg-gray-100 text-gray-700'}`}>
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
