import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Plus, X } from 'lucide-react';
import { useGetBoms, useCreateBom } from '../api/bomApi';

export function BOMPage() {
  const { data: bomsData, isLoading, isError } = useGetBoms(1);
  const createBomMutation = useCreateBom();

  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState({ product: '', uom: 'PCS', base_qty: 1, description: '' });
  const [items, setItems] = useState([{ component_item: '', quantity: 1, uom: 'PCS', scrap_percentage: 0 }]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { component_item: '', quantity: 1, uom: 'PCS', scrap_percentage: 0 }]);
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

  const handleSubmit = () => {
    createBomMutation.mutate({
      ...header,
      items
    }, {
      onSuccess: () => {
        setOpen(false);
        setHeader({ product: '', uom: 'PCS', base_qty: 1, description: '' });
        setItems([{ component_item: '', quantity: 1, uom: 'PCS', scrap_percentage: 0 }]);
      }
    });
  };

  const boms = useMemo(() => {
    if (bomsData?.success) {
      return bomsData.data;
    }
    return [];
  }, [bomsData]);

  if (isLoading) return <div className="p-8">Loading BOMs...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading BOMs.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill of Materials (BOM)</h1>
          <p className="text-muted-foreground mt-2">Manage production formulas and component requirements.</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> New BOM
          </Button>
          <Button variant="outline">Import</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {boms.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No Bill of Materials found. Click "New BOM" to generate one.
            </CardContent>
          </Card>
        ) : (
          boms.map((bom: any) => (
            <Card key={bom.id}>
              <CardHeader className="pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{bom.bom_no}</CardTitle>
                    <CardDescription className="mt-1">
                      Product: {bom.product} | Base Qty: {bom.base_qty} {bom.uom}
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {bom.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-3">Active Version: {bom.active_version?.version_number}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Component</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2">UOM</th>
                        <th className="px-4 py-2">Scrap %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bom.active_version?.items.map((item: any) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-2 font-medium">{item.component_item}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{item.uom}</td>
                          <td className="px-4 py-2">{item.scrap_percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Bill of Materials</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Product *</Label>
                <Input value={header.product} onChange={e => setHeader({...header, product: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Base Qty *</Label>
                  <Input type="number" value={header.base_qty} onChange={e => setHeader({...header, base_qty: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>UOM</Label>
                  <Input value={header.uom} onChange={e => setHeader({...header, uom: e.target.value})} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input value={header.description} onChange={e => setHeader({...header, description: e.target.value})} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Components</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem}><Plus className="w-4 h-4 mr-1" /> Add Component</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-2 py-2">Component Item</th>
                      <th className="px-2 py-2 w-32">Quantity</th>
                      <th className="px-2 py-2 w-32">UOM</th>
                      <th className="px-2 py-2 w-32">Scrap %</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.component_item} onChange={e => handleItemChange(idx, 'component_item', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.scrap_percentage} onChange={e => handleItemChange(idx, 'scrap_percentage', Number(e.target.value))} /></td>
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
            <Button onClick={handleSubmit} disabled={createBomMutation.isPending}>{createBomMutation.isPending ? 'Saving...' : 'Save BOM'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
