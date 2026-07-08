import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useGetCOA, useCreateCOA, useUpdateCOA, useDeleteCOA } from '../api/accountingHooks';

export function ChartOfAccountsPage() {
  const { data, isLoading } = useGetCOA();
  const createMutation = useCreateCOA();
  const updateMutation = useUpdateCOA();
  const deleteMutation = useDeleteCOA();

  const accounts = useMemo(() => (data?.success ? data.data : []), [data]);

  const emptyForm = { account_code: '', account_name: '', account_type: 'Asset', is_active: true };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const handleOpen = (account?: any) => {
    if (account) {
      setEditId(account.id);
      setForm({
        account_code: account.account_code,
        account_name: account.account_name,
        account_type: account.account_type,
        is_active: account.is_active,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editId) {
      updateMutation.mutate({ id: editId, data: form }, {
        onSuccess: () => { setOpen(false); setForm(emptyForm); setEditId(null); }
      });
    } else {
      createMutation.mutate(form, {
        onSuccess: () => { setOpen(false); setForm(emptyForm); }
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete account "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8">Loading Chart of Accounts...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage standard G/L accounts.</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-1" /> New Account
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No accounts configured yet.</td></tr>
            ) : (
              accounts.map((acc: any) => (
                <tr key={acc.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold text-xs">{acc.account_code}</td>
                  <td className="px-4 py-3">{acc.account_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{acc.account_type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${acc.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {acc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(acc)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(acc.id, acc.account_name)}>
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
            <DialogTitle>{editId ? 'Edit Account' : 'New Account'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Account Code</Label>
              <Input placeholder="e.g. 1100" value={form.account_code} onChange={e => setForm({ ...form, account_code: e.target.value })} disabled={!!editId} />
            </div>
            <div className="space-y-1">
              <Label>Account Name</Label>
              <Input placeholder="e.g. Cash in Bank" value={form.account_name} onChange={e => setForm({ ...form, account_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Account Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.account_type} onChange={e => setForm({ ...form, account_type: e.target.value })}>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
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
