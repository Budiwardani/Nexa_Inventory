import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';

const DEPT_TYPES = [
  { value: 'production', label: 'Production' },
  { value: 'qc', label: 'Quality Control (QC)' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'assembly', label: 'Assembly' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'admin', label: 'Administration' },
];

const TYPE_BADGE: Record<string, string> = {
  production: 'bg-blue-100 text-blue-700',
  qc: 'bg-purple-100 text-purple-700',
  maintenance: 'bg-orange-100 text-orange-700',
  assembly: 'bg-teal-100 text-teal-700',
  logistics: 'bg-yellow-100 text-yellow-700',
  warehouse: 'bg-gray-100 text-gray-700',
  admin: 'bg-pink-100 text-pink-700',
};

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', name: '', type: 'production', description: '', is_active: true });

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data || []);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', name: '', type: 'production', description: '', is_active: true });
    setError('');
    setOpen(true);
  };

  const openEdit = (dept: any) => {
    setEditing(dept);
    setForm({ code: dept.code, name: dept.name, type: dept.type, description: dept.description || '', is_active: dept.is_active });
    setError('');
    setOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (editing) {
        await api.put(`/departments/${editing.id}`, form);
      } else {
        await api.post('/departments', form);
      }
      setOpen(false);
      fetchDepartments();
    } catch (e: any) {
      const msgs = e.response?.data?.errors;
      setError(msgs ? Object.values(msgs).flat().join(', ') : e.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments & Units</h1>
          <p className="text-muted-foreground mt-1">Master data unit/bagian untuk relasi manufacturing dan inventory.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  {dept.name}
                </span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(dept)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(dept.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><span className="font-medium text-foreground">Code:</span> {dept.code}</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${TYPE_BADGE[dept.type] || 'bg-gray-100 text-gray-700'}`}>
                  {DEPT_TYPES.find(t => t.value === dept.type)?.label || dept.type}
                </span>
                {dept.description && <p className="text-xs">{dept.description}</p>}
                <p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dept.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full p-10 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No departments found. Click "Add Department" to get started.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Department' : 'Add New Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Code *</Label>
                <Input placeholder="e.g. PROD-01" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} disabled={!!editing} />
              </div>
              <div className="space-y-1">
                <Label>Type *</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {DEPT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input placeholder="Department name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input placeholder="Optional description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4" />
              <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
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
