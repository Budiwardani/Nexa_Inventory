import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Chart of Accounts ──────────────────────────────────────────────────
export const useGetCOA = () =>
  useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: async () => (await api.get('/chart-of-accounts')).data,
  });

export const useCreateCOA = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/chart-of-accounts', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};

export const useUpdateCOA = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      (await api.put(`/chart-of-accounts/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};

export const useDeleteCOA = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/chart-of-accounts/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};

// ── Journals ────────────────────────────────────────────────────────────
export const useGetJournals = (page = 1) =>
  useQuery({
    queryKey: ['journals', page],
    queryFn: async () => (await api.get(`/journals?page=${page}`)).data,
  });

export const useGetJournalDetails = (id: number) =>
  useQuery({
    queryKey: ['journals', id],
    queryFn: async () => (await api.get(`/journals/${id}`)).data,
    enabled: !!id,
  });
