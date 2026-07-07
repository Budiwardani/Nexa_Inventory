import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
});

// ─── Generic helpers ────────────────────────────────────────────────────────

function useList<T>(path: string, queryKey: string) {
  return useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/${path}`, authHeaders());
      return data.data ?? [];
    },
  });
}

function useCreate(path: string, queryKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, any>) =>
      axios.post(`${API}/${path}`, payload, authHeaders()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  });
}

function useDelete(path: string, queryKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${API}/${path}/${id}`, authHeaders()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  });
}

// ─── QC Inspections ─────────────────────────────────────────────────────────

export const useGetQcInspections = () => useList('qc-inspections', 'qc-inspections');
export const useCreateQcInspection = () => useCreate('qc-inspections', 'qc-inspections');
export const useDeleteQcInspection = () => useDelete('qc-inspections', 'qc-inspections');

// ─── Scraps ──────────────────────────────────────────────────────────────────

export const useGetScraps = () => useList('scraps', 'scraps');
export const useCreateScrap = () => useCreate('scraps', 'scraps');
export const useDeleteScrap = () => useDelete('scraps', 'scraps');

// ─── Reworks ──────────────────────────────────────────────────────────────────

export const useGetReworks = () => useList('reworks', 'reworks');
export const useCreateRework = () => useCreate('reworks', 'reworks');
export const useDeleteRework = () => useDelete('reworks', 'reworks');

// ─── Machines ────────────────────────────────────────────────────────────────

export const useGetMachines = () => useList('machines', 'machines');
export const useCreateMachine = () => useCreate('machines', 'machines');
export const useDeleteMachine = () => useDelete('machines', 'machines');

// ─── Maintenance Logs ────────────────────────────────────────────────────────

export const useGetMaintenanceLogs = () => useList('maintenance-logs', 'maintenance-logs');
export const useCreateMaintenanceLog = () => useCreate('maintenance-logs', 'maintenance-logs');

// ─── Downtimes ────────────────────────────────────────────────────────────────

export const useGetDowntimes = () => useList('downtimes', 'downtimes');
export const useCreateDowntime = () => useCreate('downtimes', 'downtimes');

// ─── Capacity Plans ───────────────────────────────────────────────────────────

export const useGetCapacityPlans = () => useList('capacity-plans', 'capacity-plans');
export const useCreateCapacityPlan = () => useCreate('capacity-plans', 'capacity-plans');

// ─── Production Costs ────────────────────────────────────────────────────────

export const useGetProductionCosts = () => useList('production-costs', 'production-costs');
export const useCreateProductionCost = () => useCreate('production-costs', 'production-costs');

// ─── Notifications ───────────────────────────────────────────────────────────

export const useGetNotifications = () => useList('notifications', 'notifications');
export const useCreateNotification = () => useCreate('notifications', 'notifications');

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      axios.patch(`${API}/notifications/${id}/read`, {}, authHeaders()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

// ─── Inventories ─────────────────────────────────────────────────────────────

export const useGetInventories = () => useList('inventories', 'inventories');
export const useCreateInventory = () => useCreate('inventories', 'inventories');
export const useDeleteInventory = () => useDelete('inventories', 'inventories');

// ─── Settings ────────────────────────────────────────────────────────────────

export const useGetSettings = () => useList('settings', 'settings');
export const useCreateSetting = () => useCreate('settings', 'settings');
export const useDeleteSetting = () => useDelete('settings', 'settings');
