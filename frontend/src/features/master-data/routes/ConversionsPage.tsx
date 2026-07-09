import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, ArrowRightLeft } from 'lucide-react';
import { useGetConversions, useCreateConversion, useUpdateConversion, useDeleteConversion, useGetUnits } from '../api/unitConversionHooks';

export function ConversionsPage() {
  const { data: convData, isLoading } = useGetConversions();
  const { data: unitsData } = useGetUnits();
  
  const createMutation = useCreateConversion();
  const updateMutation = useUpdateConversion();
  const deleteMutation = useDeleteConversion();

  const conversions = useMemo(() => (convData?.success ? convData.data : []), [convData]);
  const units = useMemo(() => (unitsData?.success ? unitsData.data : []), [unitsData]);

  const emptyForm = { 
    conversion_code: '', conversion_name: '', source_unit_id: '', target_unit_id: '', 
    conversion_factor: 1, reverse_factor: '', precision: 2, 
    rounding_method: 'Round Half Up', is_active: true 
  };
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const handleOpen = (conv?: any) => {
    if (conv) {
      setEditId(conv.id);
      setForm({
        conversion_code: conv.conversion_code,
        conversion_name: conv.conversion_name || '',
        source_unit_id: conv.source_unit_id,
        target_unit_id: conv.target_unit_id,
        conversion_factor: conv.conversion_factor,
        reverse_factor: conv.reverse_factor || '',
        precision: conv.precision,
        rounding_method: conv.rounding_method,
        is_active: conv.is_active,
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
      source_unit_id: parseInt(form.source_unit_id),
      target_unit_id: parseInt(form.target_unit_id),
      conversion_factor: parseFloat(form.conversion_factor),
      reverse_factor: form.reverse_factor ? parseFloat(form.reverse_factor) : null,
      precision: parseInt(form.precision)
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

  const handleDelete = (id: number, code: string) => {
    if (confirm(`Delete conversion rule "${code}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8">Loading Conversion Rules...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversion Matrix</h1>
          <p className="text-muted-foreground mt-1">Configure global material and unit conversion logic.</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-1" /> New Rule
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Source Unit</th>
              <th className="px-4 py-3 text-center">Factor</th>
              <th className="px-4 py-3 text-left">Target Unit</th>
              <th className="px-4 py-3 text-right">Rounding</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversions.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No conversion rules configured.</td></tr>
            ) : (
              conversions.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold text-xs">{c.conversion_code}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{c.source_unit?.unit_name} ({c.source_unit?.unit_code})</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono bg-muted/50 py-1 rounded">
                      <span>1</span>
                      <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                      <span className="font-bold text-emerald-600">{Number(c.conversion_factor).toString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-orange-700">{c.target_unit?.unit_name} ({c.target_unit?.unit_code})</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {c.rounding_method} ({c.precision})
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(c)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id, c.conversion_code)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Conversion Rule' : 'New Conversion Rule'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Rule Code</Label>
              <Input placeholder="e.g. BOX_TO_PCS" value={form.conversion_code} onChange={e => setForm({ ...form, conversion_code: e.target.value })} disabled={!!editId} />
            </div>
            <div className="space-y-1">
              <Label>Rule Name</Label>
              <Input placeholder="e.g. 1 Box = 12 PCS" value={form.conversion_name} onChange={e => setForm({ ...form, conversion_name: e.target.value })} />
            </div>
            
            <div className="space-y-1">
              <Label>Source Unit (From)</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.source_unit_id} onChange={e => setForm({ ...form, source_unit_id: e.target.value })}>
                <option value="">Select Unit...</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.unit_name} ({u.unit_code})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Target Unit (To)</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.target_unit_id} onChange={e => setForm({ ...form, target_unit_id: e.target.value })}>
                <option value="">Select Unit...</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.unit_name} ({u.unit_code})</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Conversion Factor</Label>
              <Input type="number" step="0.0001" value={form.conversion_factor} onChange={e => setForm({ ...form, conversion_factor: e.target.value })} />
              <p className="text-xs text-muted-foreground mt-1">1 Source = X Target</p>
            </div>
            <div className="space-y-1">
              <Label>Reverse Factor (Optional)</Label>
              <Input type="number" step="0.0001" value={form.reverse_factor} onChange={e => setForm({ ...form, reverse_factor: e.target.value })} />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-invert</p>
            </div>

            <div className="space-y-1">
              <Label>Rounding Method</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.rounding_method} onChange={e => setForm({ ...form, rounding_method: e.target.value })}>
                <option value="Round Half Up">Round Half Up (Standard)</option>
                <option value="Round Down">Round Down (Floor)</option>
                <option value="Round Up">Round Up (Ceil)</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Precision (Decimals)</Label>
              <Input type="number" min="0" max="6" value={form.precision} onChange={e => setForm({ ...form, precision: e.target.value })} />
            </div>

            <div className="flex items-center space-x-2 pt-2 col-span-2">
              <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
