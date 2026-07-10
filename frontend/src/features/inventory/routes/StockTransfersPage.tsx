import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowRightLeft, Plus, Truck, Check, Trash2 } from 'lucide-react';

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  intransit: 'bg-blue-100 text-blue-700',
  received: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function StockTransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    source_warehouse_id: '',
    destination_type: 'warehouse',
    destination_warehouse_id: '',
    destination_department_id: '',
    notes: '',
    items: [{ product_id: '', quantity: '' }],
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [trfRes, whRes, deptRes, prodRes] = await Promise.all([
        api.get('/stock-transfers'),
        api.get('/warehouses'),
        api.get('/departments'),
        api.get('/products'),
      ]);
      setTransfers(trfRes.data.data || []);
      setWarehouses(whRes.data || []);
      setDepartments(deptRes.data || []);
      setProducts(prodRes.data?.data || prodRes.data || []);
    } catch (e) { console.error(e); }
  };

  const resetForm = () => setForm({
    source_warehouse_id: '',
    destination_type: 'warehouse',
    destination_warehouse_id: '',
    destination_department_id: '',
    notes: '',
    items: [{ product_id: '', quantity: '' }],
  });

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', quantity: '' }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, value: string) =>
    setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        source_warehouse_id: Number(form.source_warehouse_id),
        destination_type: form.destination_type,
        notes: form.notes,
        items: form.items.map(it => ({ product_id: Number(it.product_id), quantity: Number(it.quantity) })),
      };
      if (form.destination_type === 'warehouse') {
        payload.destination_warehouse_id = Number(form.destination_warehouse_id);
      } else {
        payload.destination_department_id = Number(form.destination_department_id);
        // Use a placeholder warehouse_id for validation (same as source, will be handled backend)
        payload.destination_warehouse_id = Number(form.source_warehouse_id);
      }
      await api.post('/stock-transfers', payload);
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

  const handleShip = async (id: number) => {
    try { await api.post(`/stock-transfers/${id}/ship`); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to ship'); }
  };

  const handleReceive = async (id: number) => {
    try { await api.post(`/stock-transfers/${id}/receive`, {}); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to receive'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transfer?')) return;
    try { await api.delete(`/stock-transfers/${id}`); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Transfers</h1>
          <p className="text-muted-foreground mt-1">Transfer stock between warehouses or to a department/unit.</p>
        </div>
        <Button onClick={() => { resetForm(); setError(''); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transfers.map(trf => (
          <Card key={trf.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  {trf.transfer_number}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-normal ${STATUS_STYLE[trf.status] || 'bg-gray-100 text-gray-700'}`}>
                  {trf.status?.toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription>
                {trf.sourceWarehouse?.name} →{' '}
                {trf.destination_type === 'department'
                  ? `Dept: ${trf.destinationDepartment?.name || '—'}`
                  : trf.destinationWarehouse?.name || '—'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Items: {trf.items?.length || 0}</p>
              <div className="flex gap-2">
                {trf.status === 'draft' && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShip(trf.id)}>
                      <Truck className="mr-1 h-3 w-3" /> Ship
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(trf.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
                {trf.status === 'intransit' && (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReceive(trf.id)}>
                    <Check className="mr-1 h-3 w-3" /> Receive
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {transfers.length === 0 && (
          <div className="col-span-full p-10 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <ArrowRightLeft className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No transfers found. Click "New Transfer" to create one.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Stock Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

            <div className="space-y-1">
              <Label>Source Warehouse *</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.source_warehouse_id} onChange={e => setForm(f => ({ ...f, source_warehouse_id: e.target.value }))}>
                <option value="">-- Select Source Warehouse --</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Destination Type *</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="dest_type" value="warehouse"
                    checked={form.destination_type === 'warehouse'}
                    onChange={() => setForm(f => ({ ...f, destination_type: 'warehouse', destination_department_id: '' }))} />
                  <span className="text-sm">Warehouse</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="dest_type" value="department"
                    checked={form.destination_type === 'department'}
                    onChange={() => setForm(f => ({ ...f, destination_type: 'department', destination_warehouse_id: '' }))} />
                  <span className="text-sm">Department / Unit</span>
                </label>
              </div>
            </div>

            {form.destination_type === 'warehouse' ? (
              <div className="space-y-1">
                <Label>Destination Warehouse *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.destination_warehouse_id} onChange={e => setForm(f => ({ ...f, destination_warehouse_id: e.target.value }))}>
                  <option value="">-- Select Destination --</option>
                  {warehouses.filter(w => w.id !== Number(form.source_warehouse_id)).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label>Destination Department / Unit *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.destination_department_id} onChange={e => setForm(f => ({ ...f, destination_department_id: e.target.value }))}>
                  <option value="">-- Select Department --</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <Label>Notes</Label>
              <Input placeholder="Optional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
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
                  <div className="col-span-7">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                      <option value="">-- Product --</option>
                      {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <Input type="number" placeholder="Quantity" min="0.001" step="0.001"
                      value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
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
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Create Transfer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
