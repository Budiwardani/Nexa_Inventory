import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useProductionOrders } from '../api/getProductionOrders';
import { useCreateProductionOrder } from '../api/createProductionOrder';
import { Loader2, Plus, X, Trash2 } from 'lucide-react';

const gridHeaders = [
  'Product',
  'Variant',
  'Batch',
  'Serial',
  'Target Qty',
  'UOM',
  'Completed Qty',
  'Reject Qty',
  'Scrap Qty',
  'Remaining Qty',
];

const materialHeaders = [
  'Material Code',
  'Material Name',
  'Warehouse',
  'Required Qty',
  'Reserved Qty',
  'Issued Qty',
  'Returned Qty',
  'Consumed Qty',
  'Remaining Qty',
];

const machineHeaders = [
  'Machine',
  'Machine Group',
  'Work Center',
  'Production Line',
  'Start Time',
  'End Time',
  'Estimated Hours',
  'Actual Hours',
];

const operatorHeaders = [
  'Employee',
  'Role',
  'Shift',
  'Start Time',
  'End Time',
  'Performance %',
];

export const ProductionOrderPage = () => {
  const { data: orders, isLoading } = useProductionOrders();
  const createOrder = useCreateProductionOrder();

  const currentOrder = orders && orders.length > 0 ? orders[0] : null;

  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState({
    production_order_no: `PO-${Date.now()}`,
    production_date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [items, setItems] = useState([{ product: '', target_qty: 0, uom: 'PCS' }]);

  const handleAddItem = () => setItems(prev => [...prev, { product: '', target_qty: 0, uom: 'PCS' }]);
  const handleRemoveItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleCreateSubmit = () => {
    createOrder.mutate({
      ...header,
      company_id: 1,
      branch_id: 1,
      status: 'Draft',
      items
    }, {
      onSuccess: () => {
        setOpen(false);
        setHeader({
          production_order_no: `PO-${Date.now()}`,
          production_date: new Date().toISOString().split('T')[0],
          description: ''
        });
        setItems([{ product: '', target_qty: 0, uom: 'PCS' }]);
      }
    });
  };

  const fieldGroups = [
    {
      title: 'Header',
      fields: [
        { label: 'Production Order No', value: currentOrder?.production_order_no || 'PO-0001' },
        { label: 'Production Date', value: currentOrder?.production_date || '2026-07-06' },
        { label: 'Company', value: currentOrder?.company_id?.toString() || '1' },
        { label: 'Branch', value: currentOrder?.branch_id?.toString() || '1' },
        { label: 'Plant', value: 'Plant Alpha' },
        { label: 'Warehouse', value: 'Main Warehouse' },
        { label: 'Production Plan', value: 'Plan 2026-01' },
        { label: 'BOM', value: 'BOM-001' },
        { label: 'BOM Version', value: 'v2' },
        { label: 'Routing', value: 'Routing-001' },
        { label: 'Production Type', value: 'Make-to-Order' },
        { label: 'Priority', value: 'High' },
        { label: 'Production Status', value: currentOrder?.status || 'Draft' },
        { label: 'Due Date', value: '2026-07-15' },
        { label: 'Description', value: currentOrder?.description || 'Manufacture 100 units of product X' },
        { label: 'Remarks', value: 'Schedule around planned maintenance' },
      ],
    },
  ];

  const detailRows = useMemo(
    () => {
      if (currentOrder && currentOrder.items?.length > 0) {
        return currentOrder.items.map((item: any) => [
          item.product, 'Standard', '-', '-', item.target_qty, item.uom, '0', '0', '0', item.target_qty
        ]);
      }
      return [
        ['Product A', 'Standard', 'BAT001', 'SN-1001', '100', 'PCS', '0', '0', '0', '100'],
        ['Product B', 'Premium', 'BAT002', 'SN-1002', '50', 'PCS', '0', '0', '0', '50'],
      ];
    },
    [currentOrder]
  );

  const materialRows = useMemo(
    () => [
      ['MAT-001', 'Steel', 'Main Warehouse', '120', '0', '0', '0', '0', '120'],
      ['MAT-002', 'Paint', 'Main Warehouse', '20', '0', '0', '0', '0', '20'],
    ],
    []
  );

  const machineRows = useMemo(
    () => [
      ['Machine A', 'Group 1', 'WC-01', 'Line 1', '2026-07-06 08:00', '2026-07-06 16:00', '8', '0'],
      ['Machine B', 'Group 1', 'WC-02', 'Line 2', '2026-07-06 08:00', '2026-07-06 16:00', '8', '0'],
    ],
    []
  );

  const operatorRows = useMemo(
    () => [
      ['Alice Johnson', 'Operator', 'Shift A', '2026-07-06 08:00', '2026-07-06 16:00', '0'],
      ['Bob Smith', 'Supervisor', 'Shift A', '2026-07-06 08:00', '2026-07-06 16:00', '0'],
    ],
    []
  );

  if (isLoading) {
    return <div className="flex p-8 items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Production Order {currentOrder ? `(${currentOrder.production_order_no})` : ''}</CardTitle>
            <CardDescription>Manage production header, details, material requirements, machine assignments, operator assignments, and approval status.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button onClick={() => setOpen(true)} disabled={createOrder.isPending}>
              {createOrder.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create New
            </Button>
            <Button>Submit</Button>
            <Button variant="outline">Approve</Button>
            <Button variant="outline">Reject</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="outline">Release</Button>
            <Button variant="outline">Close</Button>
            <Button variant="ghost">Print</Button>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-3xl border border-border/80 bg-background p-6">
            <h2 className="text-lg font-semibold">Header Form</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {fieldGroups[0].fields.map((field) => (
                <div key={field.label} className="space-y-1">
                  <Label>{field.label}</Label>
                  <Input readOnly value={field.value} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border/80 bg-background p-6">
            <h2 className="text-lg font-semibold">Approval Flow</h2>
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
                <span>Draft</span>
                <span>Supervisor → Production Manager → Plant Manager → Released</span>
              </div>
              <div className="grid gap-3 pt-3 sm:grid-cols-2">
                {['Draft', 'Supervisor', 'Production Manager', 'Plant Manager', 'Released'].map((stage) => (
                  <div key={stage} className="rounded-2xl bg-background p-4 shadow-sm">
                    <p className="text-sm font-medium">{stage}</p>
                    <p className="text-xs text-muted-foreground">Status step</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/80 bg-background p-4">
              <h3 className="text-base font-semibold">Notifications</h3>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {['Production Created', 'Production Approved', 'Production Released', 'Production Started', 'Production Delayed', 'Production Finished', 'Production Closed'].map((item) => (
                  <div key={item} className="rounded-xl border border-border/60 bg-card px-3 py-2">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Detail Form</CardTitle>
            <CardDescription>List of ordered products and production quantities.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-background">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {gridHeaders.map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border/80 even:bg-slate-50">
                    {row.map((value: any, colIndex: number) => (
                      <td key={colIndex} className="px-4 py-3">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-6">
        <CardHeader>
          <div>
            <CardTitle>Material Requirement</CardTitle>
            <CardDescription>Track required, reserved, issued, returned, consumed, and remaining material quantities.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-background">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {materialHeaders.map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border/80 even:bg-slate-50">
                    {row.map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Machine Assignment</CardTitle>
              <CardDescription>Assign machines and capture schedule and hours.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-background">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {machineHeaders.map((header) => (
                      <th key={header} className="px-4 py-3 font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {machineRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-border/80 even:bg-slate-50">
                      {row.map((value, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Operator Assignment</CardTitle>
              <CardDescription>Track employees, shift, and performance for the production order.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-background">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {operatorHeaders.map((header) => (
                      <th key={header} className="px-4 py-3 font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {operatorRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-border/80 even:bg-slate-50">
                      {row.map((value, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Production Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Order Number</Label>
                <Input value={header.production_order_no} onChange={e => setHeader({...header, production_order_no: e.target.value})} />
              </div>
              <div>
                <Label>Production Date</Label>
                <Input type="date" value={header.production_date} onChange={e => setHeader({...header, production_date: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input value={header.description} onChange={e => setHeader({...header, description: e.target.value})} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Items</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-2 py-2">Product Name</th>
                      <th className="px-2 py-2 w-32">Target Qty</th>
                      <th className="px-2 py-2 w-24">UOM</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.target_qty} onChange={e => handleItemChange(idx, 'target_qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
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
            <Button onClick={handleCreateSubmit} disabled={createOrder.isPending}>{createOrder.isPending ? 'Saving...' : 'Save Order'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

