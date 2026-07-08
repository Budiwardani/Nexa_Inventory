import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, X, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const useGetFinishedGoods = (page = 1) => useQuery({
  queryKey: ['finished-goods', page],
  queryFn: async () => (await api.get(`/finished-goods?page=${page}`)).data,
});

const useCreateFinishedGoods = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/finished-goods', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finished-goods'] }),
  });
};

const useDeleteFinishedGoods = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/finished-goods/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finished-goods'] }),
  });
};

export function FinishedGoodsPage() {
  const { data, isLoading } = useGetFinishedGoods();
  const createMutation = useCreateFinishedGoods();
  const deleteMutation = useDeleteFinishedGoods();

  const receipts = useMemo(() => (data?.success ? data.data : []), [data]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: '', warehouse: 'WH-FG', receipt_date: new Date().toISOString().split('T')[0], receipt_qty: 0, uom: 'PCS', unit_cost: 0, notes: '' });

  const handleSubmit = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ product: '', warehouse: 'WH-FG', receipt_date: new Date().toISOString().split('T')[0], receipt_qty: 0, uom: 'PCS', unit_cost: 0, notes: '' });
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading Finished Goods Receipts...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finished Goods Receipt</h1>
          <p className="text-muted-foreground mt-2">Receive completed products and post to inventory automatically.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New FG Receipt
        </Button>
      </div>

      <div className="grid gap-4">
        {receipts.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No Finished Goods Receipts found. Click "New FG Receipt" to create one.</CardContent></Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Receipt No</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Warehouse</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Cost</th>
                  <th className="px-4 py-3 text-right">Total Cost</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r: any) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-blue-600">{r.fgr_no}</td>
                    <td className="px-4 py-3 font-medium">{r.product}</td>
                    <td className="px-4 py-3">{r.warehouse}</td>
                    <td className="px-4 py-3">{r.receipt_date}</td>
                    <td className="px-4 py-3 text-right">{Number(r.receipt_qty).toLocaleString()} {r.uom}</td>
                    <td className="px-4 py-3 text-right">{Number(r.unit_cost).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                    <td className="px-4 py-3 text-right font-semibold">{Number(r.total_cost).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.status === 'Draft' && (
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => {
                          if (confirm('Are you sure you want to delete this receipt?')) deleteMutation.mutate(r.id);
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Finished Goods Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 grid sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2 mt-4">
              <Label>Product *</Label>
              <Input value={form.product} onChange={e => setForm({...form, product: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Receipt Date *</Label>
              <Input type="date" value={form.receipt_date} onChange={e => setForm({...form, receipt_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Receipt Qty *</Label>
              <Input type="number" value={form.receipt_qty} onChange={e => setForm({...form, receipt_qty: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>UOM</Label>
              <Input value={form.uom} onChange={e => setForm({...form, uom: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Unit Cost</Label>
              <Input type="number" value={form.unit_cost} onChange={e => setForm({...form, unit_cost: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Input value={form.warehouse} onChange={e => setForm({...form, warehouse: e.target.value})} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4 mr-1"/> Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save Receipt'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
