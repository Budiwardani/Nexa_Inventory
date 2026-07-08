import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, CheckCircle, X } from 'lucide-react';
import {
  useGetGoodsReceipts,
  useCreateGoodsReceipt,
  useReceiveGoods,
  useDeleteGoodsReceipt,
  useGetPurchaseOrders,
} from '../api/purchasingHooks';

const STATUS_COLORS: Record<string, string> = {
  Draft:    'bg-slate-100 text-slate-600',
  Received: 'bg-emerald-100 text-emerald-700',
  Partial:  'bg-amber-100 text-amber-700',
};

export function GoodsReceiptPage() {
  const { data, isLoading }       = useGetGoodsReceipts();
  const { data: poData }          = useGetPurchaseOrders();
  const createMutation            = useCreateGoodsReceipt();
  const receiveMutation           = useReceiveGoods();
  const deleteMutation            = useDeleteGoodsReceipt();

  const receipts  = useMemo(() => (data?.success  ? data.data  : []), [data]);
  const orders    = useMemo(() => (poData?.success ? poData.data : []), [poData]);

  const emptyHeader = {
    purchase_order_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
    notes: '',
  };
  const emptyItem = { item_code: '', item_name: '', ordered_qty: 1, received_qty: 1, uom: 'PCS' };

  const [open, setOpen]     = useState(false);
  const [header, setHeader] = useState(emptyHeader);
  const [items, setItems]   = useState([{ ...emptyItem }]);

  const handleAddItem    = () => setItems(prev => [...prev, { ...emptyItem }]);
  const handleRemoveItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const handleItemChange = (idx: number, field: string, value: any) =>
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const handleSubmit = () => {
    const payload = { ...header, purchase_order_id: header.purchase_order_id ? Number(header.purchase_order_id) : null, items };
    createMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        setHeader(emptyHeader);
        setItems([{ ...emptyItem }]);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Goods Receipt</h2>
          <p className="text-muted-foreground text-sm mt-1">Record incoming goods from suppliers.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Receipt
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : receipts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No goods receipts found. Create your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">PO #</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Items</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((gr: any) => (
                <tr key={gr.id} className="border-t hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">GR-{String(gr.id).padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {gr.purchase_order_id ? `PO-${String(gr.purchase_order_id).padStart(4, '0')}` : '—'}
                  </td>
                  <td className="px-4 py-3">{gr.receipt_date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[gr.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {gr.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{gr.items?.length ?? 0} line(s)</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[160px]">{gr.notes || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {gr.status === 'Draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-300"
                        onClick={() => receiveMutation.mutate(gr.id)}
                        disabled={receiveMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Receive
                      </Button>
                    )}
                    {gr.status === 'Draft' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => { if (confirm('Delete this receipt?')) deleteMutation.mutate(gr.id); }}
                        disabled={deleteMutation.isPending}
                      >
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

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Goods Receipt</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Purchase Order (optional)</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={header.purchase_order_id}
                  onChange={e => setHeader(prev => ({ ...prev, purchase_order_id: e.target.value }))}
                >
                  <option value="">— None —</option>
                  {orders.map((po: any) => (
                    <option key={po.id} value={po.id}>
                      PO-{String(po.id).padStart(4, '0')} ({po.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Receipt Date</Label>
                <Input
                  type="date"
                  value={header.receipt_date}
                  onChange={e => setHeader(prev => ({ ...prev, receipt_date: e.target.value }))}
                />
              </div>
              <div className="space-y-1 sm:col-span-1">
                <Label>Notes</Label>
                <Input
                  value={header.notes}
                  onChange={e => setHeader(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base">Receipt Items</Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-2 py-2 text-left">Item Code</th>
                      <th className="px-2 py-2 text-left">Item Name</th>
                      <th className="px-2 py-2 text-left w-24">Ordered Qty</th>
                      <th className="px-2 py-2 text-left w-24">Received Qty</th>
                      <th className="px-2 py-2 text-left w-20">UOM</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.item_code} onChange={e => handleItemChange(idx, 'item_code', e.target.value)} placeholder="MAT-001" /></td>
                        <td className="p-2"><Input value={item.item_name} onChange={e => handleItemChange(idx, 'item_name', e.target.value)} placeholder="Item name" /></td>
                        <td className="p-2"><Input type="number" value={item.ordered_qty} onChange={e => handleItemChange(idx, 'ordered_qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input type="number" value={item.received_qty} onChange={e => handleItemChange(idx, 'received_qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)} className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Save Receipt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
