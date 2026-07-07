import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetRoutings, useCreateRouting } from '../api/routingApi';

export function RoutingPage() {
  const { data: routingsData, isLoading, isError } = useGetRoutings(1);
  const createRoutingMutation = useCreateRouting();

  const handleCreateSampleRouting = () => {
    createRoutingMutation.mutate({
      product: 'Sample Product ' + Math.floor(Math.random() * 1000),
      description: 'Standard assembly routing',
      operations: [
        {
          operation_seq: 10,
          operation_name: 'Cutting',
          work_center: 'WC-01',
          setup_time: 15,
          run_time: 5,
        },
        {
          operation_seq: 20,
          operation_name: 'Assembly',
          work_center: 'WC-02',
          setup_time: 10,
          run_time: 12,
        }
      ]
    });
  };

  const routings = useMemo(() => {
    if (routingsData?.success) {
      return routingsData.data;
    }
    return [];
  }, [routingsData]);

  if (isLoading) return <div className="p-8">Loading Routings...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading Routings.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routings</h1>
          <p className="text-muted-foreground mt-2">Define operation sequences and machine assignments.</p>
        </div>
        <div className="space-x-2">
          <Button onClick={handleCreateSampleRouting} disabled={createRoutingMutation.isPending}>
            {createRoutingMutation.isPending ? 'Creating...' : 'Create Sample Routing via API'}
          </Button>
          <Button variant="outline">Import</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {routings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No Routings found. Click "Create Sample Routing via API" to generate one.
            </CardContent>
          </Card>
        ) : (
          routings.map((routing: any) => (
            <Card key={routing.id}>
              <CardHeader className="pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{routing.routing_no}</CardTitle>
                    <CardDescription className="mt-1">
                      Product: {routing.product} | {routing.description}
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {routing.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Seq</th>
                        <th className="px-4 py-2">Operation</th>
                        <th className="px-4 py-2">Work Center</th>
                        <th className="px-4 py-2">Setup Time (m)</th>
                        <th className="px-4 py-2">Run Time (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routing.operations.map((op: any) => (
                        <tr key={op.id} className="border-b">
                          <td className="px-4 py-2 font-medium">{op.operation_seq}</td>
                          <td className="px-4 py-2">{op.operation_name}</td>
                          <td className="px-4 py-2">{op.work_center || '-'}</td>
                          <td className="px-4 py-2">{op.setup_time}</td>
                          <td className="px-4 py-2">{op.run_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
