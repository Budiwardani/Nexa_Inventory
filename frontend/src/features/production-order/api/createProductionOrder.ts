import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ProductionOrder } from './getProductionOrders';

export const createProductionOrder = async (data: Partial<ProductionOrder>) => {
  const response = await api.post('/production-orders', data);
  return response.data.data;
};

export const useCreateProductionOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
    },
  });
};
