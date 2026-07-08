import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useGetSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../api/purchasingHooks';

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

export function SuppliersPage() {
  const { data, isLoading } = useGetSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const suppliers = useMemo(() => (data?.success ? data.data : []), [data]);

  const emptyForm = { code: '', name: '', email: '', phone: '', address: '', tax_id: '', status: 'Active' };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const handleOpen = (supplier?: any) => {
    if (supplier) {
      setEditId(supplier.id);
      setForm({ code: supplier.code, name: supplier.name, email: supplier.email ?? '', phone: supplier.phone ?? '', address: supplier.address ?? '', tax_id: supplier.tax_id ?? '', status: supplier.status });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = { ...form };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload }, { onSuccess: () => { setOpen(false); setForm(emptyForm); setEditId(null); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { setOpen(false); setForm(emptyForm); } });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete supplier "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8">Loading Suppliers...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage your supplier master data and contacts.</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-1" /> New Supplier
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Tax ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No suppliers yet. Click "New Supplier" to add one.</td></tr>
            ) : (
              suppliers.map((s: any) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-xs">{s.code}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.phone || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.tax_id || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id, s.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Supplier' : 'New Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Code *</Label>
                <Input placeholder="e.g. SUP-001" value={form.code} disabled={!!editId} onChange={e => setForm({ ...form, code: e.target.value })} />
              </div>
              <div>
                <Label>Name *</Label>
                <Input placeholder="Supplier name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="contact@supplier.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+62 ..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Tax ID (NPWP)</Label>
                <Input placeholder="xx.xxx.xxx.x-xxx.xxx" value={form.tax_id} onChange={e => setForm({ ...form, tax_id: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input placeholder="Full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
