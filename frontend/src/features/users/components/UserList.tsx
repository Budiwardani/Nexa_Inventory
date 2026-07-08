import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, createUser, updateUser } from '../api/usersApi';
import type { User, Role, UserPayload } from '../api/usersApi';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search, Trash2, Edit, Loader2 } from 'lucide-react';

export const UserList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => getUsers(page, search),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await api.get('/roles?per_page=100')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: UserPayload }) => updateUser(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  // Dialog State
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: '', email: '', password: '', password_confirmation: '', branch_id: 1, roles: [] as number[] });

  const handleOpenCreate = () => {
    setFormData({ id: 0, name: '', email: '', password: '', password_confirmation: '', branch_id: 1, roles: [] });
    setIsEdit(false);
    setOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Leave blank unless changing
      password_confirmation: '',
      branch_id: user.branch?.id || 1,
      roles: user.roles.map(r => r.id),
    });
    setIsEdit(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (isEdit) {
      updateMutation.mutate({ id: formData.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const allRoles: Role[] = rolesData?.data || [];

  const toggleRole = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage system users, their access levels, and assign roles.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center p-2 bg-card border border-border/50 rounded-md">
        <Search className="h-4 w-4 text-muted-foreground mr-2 ml-2" />
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>

      <div className="border border-border/50 rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No users found.</TableCell></TableRow>
            ) : (
              data?.data.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.branch?.name || '-'}</TableCell>
                  <TableCell>
                    {user.roles.map(r => (
                      <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mr-1">
                        {r.name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user.id)}>
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
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div>Showing page {data.meta.current_page} of {data.meta.last_page}</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.meta.last_page, p + 1))} disabled={page === data.meta.last_page}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit User' : 'New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>Password {isEdit && <span className="text-muted-foreground text-xs font-normal">(Leave blank to keep current)</span>}</Label>
              <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" value={formData.password_confirmation} onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })} />
            </div>
            
            <div className="pt-2">
              <Label className="mb-2 block">Assign Roles</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
                {allRoles.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Loading roles...</span>
                ) : (
                  allRoles.map(role => (
                    <label key={role.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border cursor-pointer hover:bg-gray-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.roles.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                      />
                      <span className="text-sm font-medium">{role.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
