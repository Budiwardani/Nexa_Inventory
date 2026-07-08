import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, CheckCircle, X } from 'lucide-react';
import {
  useGetPurchaseOrders,
  useCreatePurchaseOrder,
  useApprovePurchaseOrder,
  useDeletePurchaseOrder,
  useGetSuppliers,
} from '../api/purchasingHooks';

const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600',
  Approved: 'bg-blue-100 text-blue-700',
  Sent: 'bg-purple-100 text-purple-700',
  'Partial Receipt': 'bg-amber-100 text-amber-700',
  Received: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-gray-100 text-gray-500',
};

export function PurchaseOrdersPage() {
  const { data, isLoading } = useGetPurchaseOrders();
  const { data: supplierData } = useGetSuppliers();
  const createMutation = useCreatePurchaseOrder();
  const approveMutation = useApprovePurchaseOrder();
  const deleteMutation = useDeletePurchaseOrder();

  const orders = useMemo(() => (data?.success ? data.data : []), [data]);
  const suppliers = useMemo(() => (supplierData?.success ? supplierData.data : []), [supplierData]);

  const emptyHeader = { supplier_id: '', date: new Date().toISOString().split('T')[0], expected_delivery: '', tax_amount: 0, notes: '' };
  const emptyItem = { item_code: '', item_name: '', qty: 1, unit_price: 0, uom: 'PCS' };

  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState(emptyHeader);
  const [items, setItems] = useState([{ ...emptyItem }]);

  const handleAddItem = () => setItems(prev => [...prev, { ...emptyItem }]);
  const handleRemoveItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const handleItemChange = (idx: number, field: string, value: any) =>
    setItems(prev => { const next = [...prev]; next[idx] = { ...next[idx], [field]: value }; return next; });

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unit_price, 0);
  const total = subtotal + Number(header.tax_amount);

  const handleSubmit = () => {
    if (!header.supplier_id) return alert('Please select a supplier');
    createMutation.mutate({ ...header, supplier_id: Number(header.supplier_id), items }, {
      onSuccess: () => { setOpen(false); setHeader(emptyHeader); setItems([{ ...emptyItem }]); }
    });
  };

  if (isLoading) return <div className="p-8">Loading Purchase Orders...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Manage procurement from suppliers to your warehouse.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Purchase Order
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No purchase orders yet.</CardContent></Card>
        ) : (
          orders.map((po: any) => (
            <Card key={po.id} className="overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-mono">{po.po_no}</CardTitle>
                    <CardDescription className="mt-1">
                      Supplier: <span className="font-medium text-foreground">{po.supplier?.name ?? '—'}</span>
                      {' · '} Date: {po.date}
                      {po.expected_delivery ? ` · ETA: ${po.expected_delivery}` : ''}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[po.status] ?? ''}`}>{po.status}</span>
                    {po.status === 'Draft' && (
                      <>
                        <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-300 hover:bg-blue-50"
                          onClick={() => { if (confirm('Approve this purchase order?')) approveMutation.mutate(po.id); }}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm('Delete this purchase order?')) deleteMutation.mutate(po.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-4">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                    <tr>
                      <th className="px-3 py-2 text-left">Item Code</th>
                      <th className="px-3 py-2 text-left">Item Name</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-left">UOM</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(po.items ?? []).map((item: any) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-3 py-2 font-mono text-xs">{item.item_code}</td>
                        <td className="px-3 py-2">{item.item_name}</td>
                        <td className="px-3 py-2 text-right">{item.qty}</td>
                        <td className="px-3 py-2">{item.uom}</td>
                        <td className="px-3 py-2 text-right">{Number(item.unit_price).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-semibold">{Number(item.total_price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/20">
                      <td colSpan={5} className="px-3 py-2 text-right font-semibold text-sm">Total Amount</td>
                      <td className="px-3 py-2 text-right font-bold text-primary">{Number(po.total_amount).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create PO Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Supplier *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={header.supplier_id} onChange={e => setHeader({ ...header, supplier_id: e.target.value })}>
                  <option value="">— Select Supplier —</option>
                  {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
                </select>
              </div>
              <div>
                <Label>PO Date *</Label>
                <Input type="date" value={header.date} onChange={e => setHeader({ ...header, date: e.target.value })} />
              </div>
              <div>
                <Label>Expected Delivery</Label>
                <Input type="date" value={header.expected_delivery} onChange={e => setHeader({ ...header, expected_delivery: e.target.value })} />
              </div>
              <div>
                <Label>Tax Amount</Label>
                <Input type="number" value={header.tax_amount} onChange={e => setHeader({ ...header, tax_amount: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={header.notes} onChange={e => setHeader({ ...header, notes: e.target.value })} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Order Items</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
                    <tr>
                      <th className="px-2 py-2 text-left">Item Code</th>
                      <th className="px-2 py-2 text-left">Item Name</th>
                      <th className="px-2 py-2 w-24">Qty</th>
                      <th className="px-2 py-2 w-28">Unit Price</th>
                      <th className="px-2 py-2 w-20">UOM</th>
                      <th className="px-2 py-2 w-28 text-right">Total</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.item_code} onChange={e => handleItemChange(idx, 'item_code', e.target.value)} /></td>
                        <td className="p-2"><Input value={item.item_name} onChange={e => handleItemChange(idx, 'item_name', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.qty} onChange={e => handleItemChange(idx, 'qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input type="number" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                        <td className="p-2 text-right font-semibold text-sm">{(item.qty * item.unit_price).toLocaleString()}</td>
                        <td className="p-2"><Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveItem(idx)}><X className="w-4 h-4" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/30">
                      <td colSpan={5} className="px-3 py-2 text-right text-sm font-semibold">Subtotal</td>
                      <td className="px-3 py-2 text-right font-bold">{subtotal.toLocaleString()}</td>
                      <td></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td colSpan={5} className="px-3 py-2 text-right text-sm font-semibold text-primary">Total (incl. Tax)</td>
                      <td className="px-3 py-2 text-right font-bold text-primary">{total.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Create Purchase Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
