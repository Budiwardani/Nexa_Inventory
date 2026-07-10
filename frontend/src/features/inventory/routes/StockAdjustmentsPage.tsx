import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileEdit, Plus, Check, Trash2 } from 'lucide-react';

export function StockAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    warehouse_id: '',
    reason: '',
    items: [{ product_id: '', quantity_adjusted: '', notes: '' }],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [adjRes, whRes, prodRes] = await Promise.all([
        api.get('/stock-adjustments'),
        api.get('/warehouses'),
        api.get('/products'),
      ]);
      setAdjustments(adjRes.data.data || []);
      setWarehouses(whRes.data || []);
      setProducts(prodRes.data?.data || prodRes.data || []);
    } catch (e) { console.error(e); }
  };

  const resetForm = () => setForm({
    warehouse_id: '',
    reason: '',
    items: [{ product_id: '', quantity_adjusted: '', notes: '' }],
  });

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', quantity_adjusted: '', notes: '' }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, value: string) =>
    setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/stock-adjustments', {
        warehouse_id: Number(form.warehouse_id),
        reason: form.reason,
        items: form.items.map(it => ({
          product_id: Number(it.product_id),
          quantity_adjusted: Number(it.quantity_adjusted),
          notes: it.notes,
        })),
      });
      setOpen(false);
      resetForm();
      fetchAll();
    } catch (e: any) {
      const msgs = e.response?.data?.errors;
      setError(msgs ? Object.values(msgs).flat().join(', ') : e.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (id: number) => {
    try {
      await api.post(`/stock-adjustments/${id}/post`);
      fetchAll();
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to post'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this adjustment?')) return;
    try {
      await api.delete(`/stock-adjustments/${id}`);
      fetchAll();
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments</h1>
          <p className="text-muted-foreground mt-1">Manual stock corrections for damages, losses, or cycle counts.</p>
        </div>
        <Button onClick={() => { resetForm(); setError(''); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Adjustment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adjustments.map(adj => (
          <Card key={adj.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-indigo-600" />
                  {adj.adjustment_number}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-normal ${adj.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {adj.status?.toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription>{adj.warehouse?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Items: {adj.items?.length || 0} | Reason: {adj.reason || '—'}</p>
              <div className="flex gap-2">
                {adj.status === 'draft' && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handlePost(adj.id)}>
                      <Check className="mr-1 h-3 w-3" /> Post
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(adj.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {adjustments.length === 0 && (
          <div className="col-span-full p-10 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <FileEdit className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No adjustments found. Click "New Adjustment" to create one.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Stock Adjustment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Warehouse *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.warehouse_id} onChange={e => setForm(f => ({ ...f, warehouse_id: e.target.value }))}>
                  <option value="">-- Select Warehouse --</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Reason</Label>
                <Input placeholder="e.g. Cycle count, Damage" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Items *</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>
                  <Plus className="mr-1 h-3 w-3" /> Add Item
                </Button>
              </div>
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 border rounded-lg">
                  <div className="col-span-5">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                      <option value="">-- Product --</option>
                      {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <Input type="number" placeholder="Qty (+/-)" value={item.quantity_adjusted}
                      onChange={e => updateItem(i, 'quantity_adjusted', e.target.value)} />
                  </div>
                  <div className="col-span-3">
                    <Input placeholder="Notes" value={item.notes} onChange={e => updateItem(i, 'notes', e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    {form.items.length > 1 && (
                      <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => removeItem(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Create Adjustment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
