import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface BomItem {
  id?: number;
  component_item: string;
  quantity: number;
  uom: string;
  scrap_percentage?: number;
  is_critical?: boolean;
}

export interface BomVersion {
  id?: number;
  version_number: number;
  effective_date: string;
  end_date?: string;
  status: string;
  items: BomItem[];
}

export interface BillOfMaterial {
  id: number;
  bom_no: string;
  product: string;
  variant?: string;
  uom: string;
  base_qty: number;
  description?: string;
  status: string;
  versions: BomVersion[];
  active_version?: BomVersion;
  created_at: string;
  updated_at: string;
}

export const useGetBoms = (page = 1) => {
  return useQuery({
    queryKey: ['boms', page],
    queryFn: async () => {
      const response = await api.get(`/boms?page=${page}`);
      return response.data;
    },
  });
};

export const useCreateBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BillOfMaterial> & { items: BomItem[] }) => {
      const response = await api.post('/boms', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
    },
  });
};
