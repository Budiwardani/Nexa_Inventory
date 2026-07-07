import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface RoutingOperation {
  id?: number;
  operation_seq: number;
  operation_name: string;
  work_center?: string;
  machine_group?: string;
  setup_time?: number;
  run_time?: number;
  move_time?: number;
}

export interface Routing {
  id: number;
  routing_no: string;
  product: string;
  description?: string;
  status: string;
  operations: RoutingOperation[];
  created_at: string;
  updated_at: string;
}

export const useGetRoutings = (page = 1) => {
  return useQuery({
    queryKey: ['routings', page],
    queryFn: async () => {
      const response = await api.get(`/routings?page=${page}`);
      return response.data;
    },
  });
};

export const useCreateRouting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Routing> & { operations: RoutingOperation[] }) => {
      const response = await api.post('/routings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routings'] });
    },
  });
};
