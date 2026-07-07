import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type ProductionOrder = {
  id: number;
  production_order_no: string;
  production_date: string;
  company_id: number;
  branch_id: number;
  status: string;
  description: string;
  items: any[];
  material_requirements: any[];
  machine_assignments: any[];
  operator_assignments: any[];
};

export const getProductionOrders = async (): Promise<ProductionOrder[]> => {
  const { data } = await api.get('/production-orders');
  return data.data; // assuming API Resource structure
};

export const useProductionOrders = () => {
  return useQuery({
    queryKey: ['production-orders'],
    queryFn: getProductionOrders,
  });
};
