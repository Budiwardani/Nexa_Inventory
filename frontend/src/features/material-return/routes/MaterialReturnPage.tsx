import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const useGetMaterialReturns = (page = 1) => useQuery({
  queryKey: ['material-returns', page],
  queryFn: async () => (await api.get(`/material-returns?page=${page}`)).data,
});

const useCreateMaterialReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/material-returns', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['material-returns'] }),
  });
};

const useDeleteMaterialReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/material-returns/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['material-returns'] }),
  });
};

export function MaterialReturnPage() {
  const { data, isLoading } = useGetMaterialReturns();
  const createMutation = useCreateMaterialReturn();
  const deleteMutation = useDeleteMaterialReturn();

  const returns = useMemo(() => (data?.success ? data.data : []), [data]);

  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState({ return_date: new Date().toISOString().split('T')[0], warehouse: '', notes: '' });
  const [items, setItems] = useState([{ material_code: '', material_name: '', return_qty: 0, uom: 'PCS', reason: '' }]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { material_code: '', material_name: '', return_qty: 0, uom: 'PCS', reason: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this material return?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...header,
      items
    }, {
      onSuccess: () => {
        setOpen(false);
        setHeader({ return_date: new Date().toISOString().split('T')[0], warehouse: '', notes: '' });
        setItems([{ material_code: '', material_name: '', return_qty: 0, uom: 'PCS', reason: '' }]);
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading Material Returns...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Material Return</h1>
          <p className="text-muted-foreground mt-2">Return unused or excess materials back to warehouse.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Material Return
        </Button>
      </div>

      <div className="grid gap-4">
        {returns.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No Material Returns found. Click "New Material Return" to create one.</CardContent></Card>
        ) : (
          returns.map((ret: any) => (
            <Card key={ret.id}>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ret.mr_no}</CardTitle>
                    <CardDescription className="mt-1">
                      Return Date: {ret.return_date} | Warehouse: {ret.warehouse || '—'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">{ret.status}</span>
                    {['Draft', 'Pending'].includes(ret.status) && (
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(ret.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Material Code</th>
                      <th className="px-4 py-2 text-left">Material Name</th>
                      <th className="px-4 py-2 text-left">Return Qty</th>
                      <th className="px-4 py-2 text-left">UOM</th>
                      <th className="px-4 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(ret.items || []).map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2 font-mono">{item.material_code}</td>
                        <td className="px-4 py-2 font-medium">{item.material_name}</td>
                        <td className="px-4 py-2">{item.return_qty}</td>
                        <td className="px-4 py-2">{item.uom}</td>
                        <td className="px-4 py-2 text-muted-foreground">{item.reason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Material Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Return Date *</Label>
                <Input type="date" value={header.return_date} onChange={e => setHeader({...header, return_date: e.target.value})} />
              </div>
              <div>
                <Label>Warehouse</Label>
                <Input placeholder="e.g. WH-RAW" value={header.warehouse} onChange={e => setHeader({...header, warehouse: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <Label>Notes</Label>
                <Input placeholder="Optional remarks" value={header.notes} onChange={e => setHeader({...header, notes: e.target.value})} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Return Items</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem}><Plus className="w-4 h-4 mr-1" /> Add Row</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-2 py-2">Material Code</th>
                      <th className="px-2 py-2">Material Name</th>
                      <th className="px-2 py-2 w-24">Return Qty</th>
                      <th className="px-2 py-2 w-24">UOM</th>
                      <th className="px-2 py-2">Reason</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.material_code} onChange={e => handleItemChange(idx, 'material_code', e.target.value)} /></td>
                        <td className="p-2"><Input value={item.material_name} onChange={e => handleItemChange(idx, 'material_name', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.return_qty} onChange={e => handleItemChange(idx, 'return_qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                        <td className="p-2"><Input value={item.reason} onChange={e => handleItemChange(idx, 'reason', e.target.value)} /></td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4 mr-1"/> Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save Return'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

