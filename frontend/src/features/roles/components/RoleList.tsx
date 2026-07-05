import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, getAllPermissions, createRole, updateRole, deleteRole } from '../api/rolesApi';
import type { Role, Permission } from '../api/rolesApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2, ShieldCheck } from 'lucide-react';

// ─── Group permissions by module ──────────────────────────────────────────
const groupByModule = (permissions: Permission[]): Record<string, Permission[]> =>
  permissions.reduce((acc, perm) => {
    (acc[perm.module] = acc[perm.module] || []).push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

// ─── Role Form Dialog ──────────────────────────────────────────────────────
const RoleFormDialog = ({
  open, onClose, editRole,
}: { open: boolean; onClose: () => void; editRole?: Role | null }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(editRole?.name ?? '');
  const [description, setDescription] = useState(editRole?.description ?? '');
  const [selected, setSelected] = useState<Set<number>>(
    new Set(editRole?.permissions.map((p) => p.id) ?? [])
  );

  const { data: permData } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
  });

  const grouped = permData ? groupByModule(permData.data) : {};

  const togglePermission = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleModule = (perms: Permission[]) => {
    const allSelected = perms.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      perms.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  };

  const mutation = useMutation({
    mutationFn: (data: { name: string; description: string; permissions: number[] }) =>
      editRole ? updateRole(editRole.id, data) : createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, description, permissions: Array.from(selected) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {editRole ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
          <DialogDescription>
            Define the role name and assign the permissions it grants.
          </DialogDescription>
        </DialogHeader>

        <form id="role-form" onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Production Manager"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">Description</Label>
              <Input
                id="role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief role description..."
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Assign Permissions</Label>
            <p className="text-xs text-muted-foreground">Toggle individual permissions or select all in a module.</p>
          </div>

          <div className="space-y-5">
            {Object.entries(grouped).map(([module, perms]) => {
              const allChecked = perms.every((p) => selected.has(p.id));
              const someChecked = perms.some((p) => selected.has(p.id));
              return (
                <div key={module} className="border border-border/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{module}</span>
                    <button
                      type="button"
                      onClick={() => toggleModule(perms)}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      {allChecked ? 'Deselect all' : someChecked ? 'Select all' : 'Select all'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm cursor-pointer transition-colors select-none ${
                          selected.has(perm.id)
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-secondary text-muted-foreground'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-primary"
                          checked={selected.has(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                        />
                        {perm.name.split('.').pop()}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </form>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="role-form" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : editRole ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Role List ─────────────────────────────────────────────────────────────
export const RoleList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => getRoles(page),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });

  const handleEdit = (role: Role) => {
    setEditRole(role);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditRole(null);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this role? Users assigned to it will lose access.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground">Manage access control for the platform.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Role
        </Button>
      </div>

      <div className="border border-border/50 rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No roles found.</TableCell>
              </TableRow>
            ) : (
              data?.data.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-semibold">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{role.description || '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 5).map((p) => (
                        <Badge key={p.id} variant="secondary" className="text-xs">
                          {p.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>Page {data.meta.current_page} of {data.meta.last_page}</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setPage((p) => Math.min(data.meta.last_page, p + 1))}
              disabled={page === data.meta.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <RoleFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRole(null); }}
        editRole={editRole}
      />
    </div>
  );
};
