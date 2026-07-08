import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const useGetWorkOrders = (page = 1) => useQuery({
  queryKey: ['work-orders', page],
  queryFn: async () => (await api.get(`/work-orders?page=${page}`)).data,
});

const useCreateWorkOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/work-orders', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
};

const useDeleteWorkOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/work-orders/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
};

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Released: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Closed: 'bg-purple-100 text-purple-700',
};

export function WorkOrderPage() {
  const { data, isLoading } = useGetWorkOrders();
  const createMutation = useCreateWorkOrder();
  const deleteMutation = useDeleteWorkOrder();

  const workOrders = useMemo(() => (data?.success ? data.data : []), [data]);

  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState({ product: '', target_qty: 0, uom: 'PCS', work_center: '', machine: '', scheduled_start: new Date().toISOString().slice(0, 16) });
  const [operations, setOperations] = useState([{ operation_seq: 10, operation_name: '', work_center: '', setup_time: 0, run_time: 0 }]);

  const handleAddOp = () => {
    setOperations(prev => [...prev, { operation_seq: (prev.length + 1) * 10, operation_name: '', work_center: '', setup_time: 0, run_time: 0 }]);
  };

  const handleRemoveOp = (index: number) => {
    setOperations(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpChange = (index: number, field: string, value: string | number) => {
    setOperations(prev => {
      const newOps = [...prev];
      newOps[index] = { ...newOps[index], [field]: value };
      return newOps;
    });
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...header,
      operations
    }, {
      onSuccess: () => {
        setOpen(false);
        setHeader({ product: '', target_qty: 0, uom: 'PCS', work_center: '', machine: '', scheduled_start: new Date().toISOString().slice(0, 16) });
        setOperations([{ operation_seq: 10, operation_name: '', work_center: '', setup_time: 0, run_time: 0 }]);
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading Work Orders...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground mt-2">Track production execution tasks, machine assignments, and operator progress.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Work Order
        </Button>
      </div>

      <div className="grid gap-4">
        {workOrders.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No Work Orders yet. Click "New Work Order" to create one.</CardContent></Card>
        ) : (
          workOrders.map((wo: any) => (
            <Card key={wo.id}>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{wo.wo_no}</CardTitle>
                    <CardDescription className="mt-1">
                      {wo.product} | Target: {wo.target_qty} {wo.uom} | Work Center: {wo.work_center || '—'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[wo.status] || 'bg-gray-100 text-gray-700'}`}>
                      {wo.status}
                    </span>
                    {(wo.status === 'Draft' || wo.status === 'Pending') && (
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => {
                        if (confirm('Are you sure you want to delete this work order?')) deleteMutation.mutate(wo.id);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Operations</p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Seq</th>
                      <th className="px-4 py-2 text-left">Operation</th>
                      <th className="px-4 py-2 text-left">Work Center</th>
                      <th className="px-4 py-2 text-left">Setup (m)</th>
                      <th className="px-4 py-2 text-left">Run (m)</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(wo.operations || []).map((op: any) => (
                      <tr key={op.id} className="border-b">
                        <td className="px-4 py-2">{op.operation_seq}</td>
                        <td className="px-4 py-2 font-medium">{op.operation_name}</td>
                        <td className="px-4 py-2">{op.work_center || '—'}</td>
                        <td className="px-4 py-2">{op.setup_time}</td>
                        <td className="px-4 py-2">{op.run_time}</td>
                        <td className="px-4 py-2">{op.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label>Product *</Label>
                <Input value={header.product} onChange={e => setHeader({...header, product: e.target.value})} />
              </div>
              <div>
                <Label>Target Qty *</Label>
                <Input type="number" value={header.target_qty} onChange={e => setHeader({...header, target_qty: Number(e.target.value)})} />
              </div>
              <div>
                <Label>UOM</Label>
                <Input value={header.uom} onChange={e => setHeader({...header, uom: e.target.value})} />
              </div>
              <div>
                <Label>Work Center</Label>
                <Input value={header.work_center} onChange={e => setHeader({...header, work_center: e.target.value})} />
              </div>
              <div>
                <Label>Machine</Label>
                <Input value={header.machine} onChange={e => setHeader({...header, machine: e.target.value})} />
              </div>
              <div className="sm:col-span-3">
                <Label>Scheduled Start</Label>
                <Input type="datetime-local" value={header.scheduled_start} onChange={e => setHeader({...header, scheduled_start: e.target.value})} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Operations</h3>
                <Button variant="outline" size="sm" onClick={handleAddOp}><Plus className="w-4 h-4 mr-1" /> Add Operation</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-2 py-2 w-16">Seq</th>
                      <th className="px-2 py-2">Operation Name</th>
                      <th className="px-2 py-2">Work Center</th>
                      <th className="px-2 py-2 w-24">Setup (m)</th>
                      <th className="px-2 py-2 w-24">Run (m)</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {operations.map((op, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input type="number" value={op.operation_seq} onChange={e => handleOpChange(idx, 'operation_seq', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={op.operation_name} onChange={e => handleOpChange(idx, 'operation_name', e.target.value)} /></td>
                        <td className="p-2"><Input value={op.work_center} onChange={e => handleOpChange(idx, 'work_center', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={op.setup_time} onChange={e => handleOpChange(idx, 'setup_time', Number(e.target.value))} /></td>
                        <td className="p-2"><Input type="number" value={op.run_time} onChange={e => handleOpChange(idx, 'run_time', Number(e.target.value))} /></td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveOp(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4 mr-1"/> Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save Work Order'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
