import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Factory, PackageCheck, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface DashboardMetrics {
  total_users: number;
  total_work_orders: number;
  active_work_orders: number;
  total_production_orders: number;
  inventory_value: number;
  total_inventory_items: number;
}

export const Dashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data.data as DashboardMetrics;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your manufacturing operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Employees" 
          value={isLoading ? '...' : metrics?.total_users?.toString() || '0'} 
          icon={<Users className="h-5 w-5 text-blue-500" />} 
        />
        <StatCard 
          title="Active Production" 
          value={isLoading ? '...' : `${metrics?.active_work_orders || 0} Orders`} 
          icon={<Factory className="h-5 w-5 text-orange-500" />} 
        />
        <StatCard 
          title="Inventory Items" 
          value={isLoading ? '...' : metrics?.total_inventory_items?.toString() || '0'} 
          icon={<PackageCheck className="h-5 w-5 text-green-500" />} 
        />
        <StatCard 
          title="Inventory Value" 
          value={isLoading ? '...' : `$${(metrics?.inventory_value || 0).toFixed(2)}`} 
          icon={<AlertTriangle className="h-5 w-5 text-primary" />} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Production Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border/50">
            [Chart Placeholder]
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="border-t border-border/50">
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs">A{i}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Production Order #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">Completed phase {i}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{i}h ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
