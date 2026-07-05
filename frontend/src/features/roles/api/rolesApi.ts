import { api } from '@/lib/api';

export type Permission = {
  id: number;
  module: string;
  name: string;
  description: string;
};

export type Role = {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
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

export const getRoles = async (page = 1): Promise<PaginatedResponse<Role>> => {
  const response = await api.get('/roles', { params: { page } });
  return response.data;
};

export const getRole = async (id: number): Promise<{ success: boolean; data: Role }> => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

export const getAllPermissions = async (): Promise<{ success: boolean; data: Permission[] }> => {
  const response = await api.get('/permissions');
  return response.data;
};

export const createRole = async (data: { name: string; description?: string; permissions?: number[] }): Promise<{ success: boolean; data: Role }> => {
  const response = await api.post('/roles', data);
  return response.data;
};

export const updateRole = async (id: number, data: { name: string; description?: string; permissions?: number[] }): Promise<{ success: boolean; data: Role }> => {
  const response = await api.put(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};
