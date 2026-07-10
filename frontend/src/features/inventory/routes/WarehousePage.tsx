import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Package, Plus, Pencil, Trash2, Warehouse } from 'lucide-react';

const WAREHOUSE_TYPES = [
  { value: 'raw_material', label: 'Raw Material' },
  { value: 'finished_goods', label: 'Finished Goods' },
  { value: 'wip', label: 'Work In Progress (WIP)' },
  { value: 'general', label: 'General' },
];

export function WarehousePage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: '', name: '', type: 'general', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchWarehouses(); }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/warehouses');
      setWarehouses(res.data);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', name: '', type: 'general', address: '' });
    setError('');
    setOpen(true);
  };

  const openEdit = (wh: any) => {
    setEditing(wh);
    setForm({ code: wh.code, name: wh.name, type: wh.type || 'general', address: wh.address || '' });
    setError('');
    setOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (editing) {
        await api.put(`/warehouses/${editing.id}`, form);
      } else {
        await api.post('/warehouses', form);
      }
      setOpen(false);
      fetchWarehouses();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this warehouse?')) return;
    try {
      await api.delete(`/warehouses/${id}`);
      fetchWarehouses();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses & Zones</h1>
          <p className="text-muted-foreground mt-1">Manage physical locations, zones, racks, and bins.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map(wh => (
          <Card key={wh.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <Warehouse className="w-5 h-5 text-indigo-600" />
                  {wh.name}
                </span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(wh)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(wh.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">Code:</span> {wh.code}</p>
                <p><span className="font-medium text-foreground">Type:</span> {wh.type || 'General'}</p>
                <p><span className="font-medium text-foreground">Zones:</span> {wh.zones?.length || 0}</p>
                {wh.address && <p><span className="font-medium text-foreground">Address:</span> {wh.address}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
        {warehouses.length === 0 && (
          <div className="col-span-full p-10 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No warehouses configured. Click "Add Warehouse" to get started.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}
            <div className="space-y-1">
              <Label>Code</Label>
              <Input placeholder="e.g. WH-001" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} disabled={!!editing} />
            </div>
            <div className="space-y-1">
              <Label>Name</Label>
              <Input placeholder="Warehouse name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                {WAREHOUSE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input placeholder="Physical address (optional)" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
