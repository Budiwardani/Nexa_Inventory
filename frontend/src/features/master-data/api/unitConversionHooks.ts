import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Units ──────────────────────────────────────────────────────────────
export const useGetUnits = () =>
  useQuery({
    queryKey: ['units'],
    queryFn: async () => (await api.get('/units')).data,
  });

export const useGetUnitGroups = () =>
  useQuery({
    queryKey: ['unit-groups'],
    queryFn: async () => (await api.get('/unit-groups')).data,
  });

export const useCreateUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/units', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
};

export const useUpdateUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      (await api.put(`/units/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
};

export const useDeleteUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/units/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });
};

// ── Unit Conversions (Matrix) ─────────────────────────────────────────
export const useGetConversions = () =>
  useQuery({
    queryKey: ['unit-conversions'],
    queryFn: async () => (await api.get('/unit-conversions')).data,
  });

export const useCreateConversion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/unit-conversions', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unit-conversions'] }),
  });
};

export const useUpdateConversion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      (await api.put(`/unit-conversions/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unit-conversions'] }),
  });
};

export const useDeleteConversion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/unit-conversions/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unit-conversions'] }),
  });
};

// ── Simulator ─────────────────────────────────────────────────────────
export const useSimulateConversion = () => {
  return useMutation({
    mutationFn: async (data: { source_unit_id: number; target_unit_id: number; quantity: number }) =>
      (await api.post('/unit-conversions/simulate', data)).data,
  });
};
