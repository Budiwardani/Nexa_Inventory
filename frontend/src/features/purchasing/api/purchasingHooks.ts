import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Supplier Hooks ────────────────────────────────────────────────────
export const useGetSuppliers = () =>
  useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => (await api.get('/suppliers')).data,
  });

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/suppliers', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useUpdateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      (await api.put(`/suppliers/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/suppliers/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

// ── Purchase Order Hooks ──────────────────────────────────────────────
export const useGetPurchaseOrders = () =>
  useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => (await api.get('/purchase-orders')).data,
  });

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/purchase-orders', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
};

export const useApprovePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.post(`/purchase-orders/${id}/approve`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
};

export const useDeletePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/purchase-orders/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
};

// ── Goods Receipt Hooks ───────────────────────────────────────────────
export const useGetGoodsReceipts = () =>
  useQuery({
    queryKey: ['goods-receipts'],
    queryFn: async () => (await api.get('/goods-receipts')).data,
  });

export const useCreateGoodsReceipt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/goods-receipts', data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goods-receipts'] });
      qc.invalidateQueries({ queryKey: ['inventories'] });
    },
  });
};

export const useReceiveGoods = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.post(`/goods-receipts/${id}/receive`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goods-receipts'] });
      qc.invalidateQueries({ queryKey: ['inventories'] });
    },
  });
};

export const useDeleteGoodsReceipt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/goods-receipts/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goods-receipts'] }),
  });
};
