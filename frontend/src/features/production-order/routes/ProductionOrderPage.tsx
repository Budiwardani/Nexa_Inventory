import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useProductionOrders } from '../api/getProductionOrders';
import { useCreateProductionOrder } from '../api/createProductionOrder';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, Plus, X, Trash2, CheckCircle2, XCircle, Ban, Rocket, ClipboardCheck, History } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getUser() {
  try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
}

function userHasRole(roles: string[]): boolean {
  const user = getUser();
  const userRoles: string[] = user.roles?.map((r: any) => r.name || r) ?? [];
  return roles.some(r => userRoles.includes(r));
}

const APPROVAL_ROLES = ['Super Admin', 'Manager', 'Supervisor'];

const statusColors: Record<string, string> = {
  Draft:       'bg-gray-100 text-gray-700',
  Submitted:   'bg-blue-100 text-blue-700',
  Approved:    'bg-indigo-100 text-indigo-700',
  Released:    'bg-cyan-100 text-cyan-700',
  'In Progress':'bg-yellow-100 text-yellow-700',
  Rejected:    'bg-red-100 text-red-700',
  Cancelled:   'bg-orange-100 text-orange-700',
  Completed:   'bg-green-100 text-green-700',
  Closed:      'bg-purple-100 text-purple-700',
};

// ─── API hooks for actions ───────────────────────────────────────────────────

function useOrderAction(action: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) =>
      (await api.post(`/production-orders/${id}/${action}`, { reason })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['production-orders'] });
      qc.invalidateQueries({ queryKey: ['production-stats'] });
    },
  });
}

function useOrderLogs(id: number | null) {
  return useQuery({
    queryKey: ['po-logs', id],
    queryFn: async () => (await api.get(`/production-orders/${id}/logs`)).data,
    enabled: !!id,
  });
}

// ─── Components ─────────────────────────────────────────────────────────────

function AuditTrailPanel({ orderId }: { orderId: number }) {
  const { data, isLoading } = useOrderLogs(orderId);
  const logs: any[] = data?.data ?? [];

  if (isLoading) return <div className="py-4 text-center text-sm text-muted-foreground"><Loader2 className="animate-spin inline mr-2" size={14}/>Loading logs…</div>;
  if (logs.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">No activity logs yet.</p>;

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3 text-sm border-b pb-2 last:border-0">
          <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-primary" />
          <div>
            <p>
              <span className="font-medium">{log.user}</span>
              {' '}
              <span className="text-muted-foreground">{log.event}</span>
              {' '}
              {log.new_values?.reason && (
                <span className="text-muted-foreground">— {log.new_values.reason}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{log.created_at}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export const ProductionOrderPage = () => {
  const { data: apiData, isLoading } = useProductionOrders();
  const createOrder = useCreateProductionOrder();
  const approveMut  = useOrderAction('approve');
  const rejectMut   = useOrderAction('reject');
  const cancelMut   = useOrderAction('cancel');
  const releaseMut  = useOrderAction('release');

  const canApprove = userHasRole(APPROVAL_ROLES);

  const orders: any[] = useMemo(() => {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    const dataAny = apiData as any;
    if (dataAny.success && Array.isArray(dataAny.data)) return dataAny.data;
    return [];
  }, [apiData]);

  // Selected order for detail view
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedId) ?? null, [orders, selectedId]);

  // Detail tab: 'info' | 'logs'
  const [tab, setTab] = useState<'info' | 'logs'>('info');

  // Create dialog
  const [open, setOpen] = useState(false);
  const [formHeader, setFormHeader] = useState({
    production_order_no: `PO-${Date.now()}`,
    production_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [items, setItems] = useState([{ product: '', target_qty: 0, uom: 'PCS' }]);

  // Reason dialog (reject / cancel)
  const [reasonDialog, setReasonDialog] = useState<{ open: boolean; action: 'reject' | 'cancel' | null; id: number | null }>({ open: false, action: null, id: null });
  const [reason, setReason] = useState('');

  const handleAddItem    = () => setItems(p => [...p, { product: '', target_qty: 0, uom: 'PCS' }]);
  const handleRemoveItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const handleItemChange = (i: number, field: string, value: string | number) => {
    setItems(p => { const a = [...p]; a[i] = { ...a[i], [field]: value }; return a; });
  };

  const handleCreateSubmit = () => {
    createOrder.mutate({ ...formHeader, company_id: 1, branch_id: 1, status: 'Draft', items }, {
      onSuccess: () => {
        setOpen(false);
        setFormHeader({ production_order_no: `PO-${Date.now()}`, production_date: new Date().toISOString().split('T')[0], description: '' });
        setItems([{ product: '', target_qty: 0, uom: 'PCS' }]);
      },
    });
  };

  const handleReasonSubmit = () => {
    if (!reasonDialog.id || !reasonDialog.action) return;
    const mut = reasonDialog.action === 'reject' ? rejectMut : cancelMut;
    mut.mutate({ id: reasonDialog.id, reason }, {
      onSuccess: () => {
        setReasonDialog({ open: false, action: null, id: null });
        setReason('');
      },
    });
  };

  if (isLoading) return <div className="flex p-8 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage production orders, approval workflow, and audit trail.</p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={createOrder.isPending}>
          {createOrder.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          New Order
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* Left — order list */}
        <div className="space-y-3">
          {orders.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No production orders yet. Click "New Order" to create one.</CardContent></Card>
          ) : (
            orders.map((order: any) => (
              <Card
                key={order.id}
                className={`cursor-pointer border transition-all hover:border-primary/50 ${selectedId === order.id ? 'border-primary shadow-md' : 'border-border/60'}`}
                onClick={() => { setSelectedId(order.id); setTab('info'); }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{order.production_order_no}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{order.production_date} {order.description ? `— ${order.description}` : ''}</CardDescription>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {order.approved_by_name && <span>Approved by: <b>{order.approved_by_name}</b></span>}
                    {order.created_by_name  && <span>Created by: <b>{order.created_by_name}</b></span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right — order detail */}
        {selectedOrder ? (
          <Card className="border border-border/60 sticky top-4 self-start">
            <CardHeader className="border-b pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selectedOrder.production_order_no}</CardTitle>
                  <CardDescription className="text-xs">{selectedOrder.production_date}</CardDescription>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Action buttons — Approval level only */}
              <div className="flex flex-wrap gap-2 mt-3">
                {canApprove && selectedOrder.status === 'Draft' && (
                  <Button size="sm" variant="default" onClick={() => approveMut.mutate({ id: selectedOrder.id })} disabled={approveMut.isPending}>
                    <CheckCircle2 size={14} className="mr-1" /> Approve
                  </Button>
                )}
                {canApprove && selectedOrder.status === 'Approved' && (
                  <Button size="sm" onClick={() => releaseMut.mutate({ id: selectedOrder.id })} disabled={releaseMut.isPending}>
                    <Rocket size={14} className="mr-1" /> Release
                  </Button>
                )}
                {canApprove && ['Draft', 'Submitted', 'Approved'].includes(selectedOrder.status) && (
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => { setReasonDialog({ open: true, action: 'reject', id: selectedOrder.id }); setReason(''); }}>
                    <XCircle size={14} className="mr-1" /> Reject
                  </Button>
                )}
                {canApprove && !['Completed', 'Closed', 'Cancelled'].includes(selectedOrder.status) && (
                  <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    onClick={() => { setReasonDialog({ open: true, action: 'cancel', id: selectedOrder.id }); setReason(''); }}>
                    <Ban size={14} className="mr-1" /> Cancel
                  </Button>
                )}
                {!canApprove && (
                  <p className="text-xs text-muted-foreground italic">Approval actions require Supervisor or Manager role.</p>
                )}
              </div>
            </CardHeader>

            {/* Tabs */}
            <div className="flex border-b text-sm font-medium">
              <button
                className={`px-4 py-2.5 border-b-2 transition-colors ${tab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setTab('info')}
              >
                <ClipboardCheck size={14} className="inline mr-1" /> Info
              </button>
              <button
                className={`px-4 py-2.5 border-b-2 transition-colors ${tab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setTab('logs')}
              >
                <History size={14} className="inline mr-1" /> Audit Trail
              </button>
            </div>

            <CardContent className="pt-4">
              {tab === 'info' && (
                <div className="space-y-2 text-sm">
                  <Row label="Order No"       value={selectedOrder.production_order_no} />
                  <Row label="Date"           value={selectedOrder.production_date} />
                  <Row label="Status"         value={selectedOrder.status} />
                  <Row label="Priority"       value={selectedOrder.priority} />
                  <Row label="Description"    value={selectedOrder.description} />
                  <Row label="Approved By"    value={selectedOrder.approvedBy?.name} />
                  <Row label="Approved At"    value={selectedOrder.approved_at} />
                  {(selectedOrder.items ?? []).length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Items</p>
                      {(selectedOrder.items ?? []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs border-b py-1">
                          <span>{item.product}</span>
                          <span>{item.target_qty} {item.uom}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {tab === 'logs' && <AuditTrailPanel orderId={selectedOrder.id} />}
            </CardContent>
          </Card>
        ) : (
          <div className="hidden xl:flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-muted-foreground text-sm">
            Select an order to view details
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Production Order</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Order Number</Label>
                <Input value={formHeader.production_order_no} onChange={e => setFormHeader({ ...formHeader, production_order_no: e.target.value })} />
              </div>
              <div>
                <Label>Production Date</Label>
                <Input type="date" value={formHeader.production_date} onChange={e => setFormHeader({ ...formHeader, production_date: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input value={formHeader.description} onChange={e => setFormHeader({ ...formHeader, description: e.target.value })} />
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
                      <th className="px-2 py-2 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2"><Input value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)} /></td>
                        <td className="p-2"><Input type="number" value={item.target_qty} onChange={e => handleItemChange(idx, 'target_qty', Number(e.target.value))} /></td>
                        <td className="p-2"><Input value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                        <td className="p-2"><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
            <Button onClick={handleCreateSubmit} disabled={createOrder.isPending}>
              {createOrder.isPending ? 'Saving…' : 'Save Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reason Dialog — Reject / Cancel */}
      <Dialog open={reasonDialog.open} onOpenChange={v => setReasonDialog(d => ({ ...d, open: v }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">{reasonDialog.action} Production Order</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Label>Reason {reasonDialog.action === 'reject' ? '(required)' : '(optional)'}</Label>
            <Input className="mt-1" value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonDialog(d => ({ ...d, open: false }))}>Cancel</Button>
            <Button
              variant={reasonDialog.action === 'reject' ? 'destructive' : 'default'}
              onClick={handleReasonSubmit}
              disabled={rejectMut.isPending || cancelMut.isPending}
            >
              Confirm {reasonDialog.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 border-b pb-1 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium text-right">{value}</span>
    </div>
  );
}
