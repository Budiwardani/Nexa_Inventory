import { api } from '@/lib/api';

export type Role = {
  id: number;
  name: string;
};

export type Branch = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  branch: Branch | null;
  roles: Role[];
  created_at: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
};

export const getUsers = async (page = 1, search = ''): Promise<PaginatedResponse<User>> => {
  const response = await api.get('/users', {
    params: { page, search }
  });
  return response.data;
};

export type UserPayload = Partial<Omit<User, 'roles'>> & {
  password?: string;
  password_confirmation?: string;
  roles?: number[];
  branch_id?: number;
};

export const createUser = async (data: UserPayload): Promise<{ success: boolean; data: User }> => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: UserPayload): Promise<{ success: boolean; data: User }> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
