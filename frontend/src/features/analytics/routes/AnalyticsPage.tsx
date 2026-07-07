import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, LineChart, PieChart, Activity } from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Deep dive into production efficiency, scrap rates, and overall costs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Production Efficiency" value="92.4%" icon={<Activity className="h-5 w-5 text-green-500" />} />
        <StatCard title="Scrap Rate" value="1.2%" icon={<PieChart className="h-5 w-5 text-destructive" />} />
        <StatCard title="OEE Score" value="85.7%" icon={<BarChart3 className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Total Cost Variance" value="- $4,500" icon={<LineChart className="h-5 w-5 text-orange-500" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Output vs Target</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border/50">
            [Bar Chart: Output vs Target]
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Downtime Causes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border/50">
            [Pie Chart: Downtime by Reason]
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Cost Analysis (Material vs Labor vs Overhead)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border/50">
            [Line Chart: Cost breakdown over time]
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
