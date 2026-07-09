import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useGetUnits, useGetUnitGroups, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../api/unitConversionHooks';

export function UnitsPage() {
  const { data: unitsData, isLoading } = useGetUnits();
  const { data: groupsData } = useGetUnitGroups();
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const deleteMutation = useDeleteUnit();

  const units = useMemo(() => (unitsData?.success ? unitsData.data : []), [unitsData]);
  const groups = useMemo(() => (groupsData?.success ? groupsData.data : []), [groupsData]);

  const emptyForm = { unit_code: '', unit_name: '', group_id: '', is_base_unit: false, is_active: true };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const handleOpen = (unit?: any) => {
    if (unit) {
      setEditId(unit.id);
      setForm({
        unit_code: unit.unit_code,
        unit_name: unit.unit_name,
        group_id: unit.group_id || '',
        is_base_unit: unit.is_base_unit,
        is_active: unit.is_active,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      group_id: form.group_id ? parseInt(form.group_id) : null
    };

    if (editId) {
      updateMutation.mutate({ id: editId, data: payload }, {
        onSuccess: () => { setOpen(false); setForm(emptyForm); setEditId(null); }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { setOpen(false); setForm(emptyForm); }
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete unit "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8">Loading Units...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Units</h1>
          <p className="text-muted-foreground mt-1">Manage physical units of measure (UOM).</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-1" /> New Unit
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Group</th>
              <th className="px-4 py-3 text-left">Base Unit</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No units configured.</td></tr>
            ) : (
              units.map((u: any) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold text-xs">{u.unit_code}</td>
                  <td className="px-4 py-3">{u.unit_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.group?.group_name || '—'}</td>
                  <td className="px-4 py-3">{u.is_base_unit ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(u)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(u.id, u.unit_name)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Unit' : 'New Unit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Unit Code</Label>
              <Input placeholder="e.g. PCS, KG" value={form.unit_code} onChange={e => setForm({ ...form, unit_code: e.target.value })} disabled={!!editId} />
            </div>
            <div className="space-y-1">
              <Label>Unit Name</Label>
              <Input placeholder="e.g. Pieces, Kilograms" value={form.unit_name} onChange={e => setForm({ ...form, unit_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Unit Group (Optional)</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.group_id} onChange={e => setForm({ ...form, group_id: e.target.value })}>
                <option value="">-- No Group --</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.group_name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="base_unit" checked={form.is_base_unit} onChange={e => setForm({ ...form, is_base_unit: e.target.checked })} className="rounded border-gray-300" />
              <Label htmlFor="base_unit">Is Base Unit</Label>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
