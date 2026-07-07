import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetMachines,
  useCreateMachine,
  useDeleteMachine,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'machine_code', label: 'Machine Code' },
  { key: 'machine_name', label: 'Machine Name' },
  { key: 'work_center', label: 'Work Center' },
  { key: 'capacity_per_hour', label: 'Capacity/hr' },
  { key: 'uom', label: 'UOM' },
  { key: 'location', label: 'Location' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Active'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'machine_code', label: 'Machine Code', required: true, placeholder: 'MCH-001' },
  { key: 'machine_name', label: 'Machine Name', required: true },
  { key: 'work_center', label: 'Work Center', required: true, placeholder: 'WC-01' },
  { key: 'capacity_per_hour', label: 'Capacity per Hour', type: 'number' },
  { key: 'uom', label: 'UOM', placeholder: 'PCS / KG' },
  { key: 'location', label: 'Location' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Inactive', 'Under Maintenance'],
  },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function MachinePage() {
  const { data = [], isLoading } = useGetMachines();
  const create = useCreateMachine();
  const del = useDeleteMachine();

  return (
    <CrudPage
      title="Machines"
      description="Manage machine master data, capacity, and work center assignments."
      queryKey="machines"
      apiPath="machines"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      statusKey="status"
      noDataMessage="No machines found. Click 'New Machine' to register one."
    />
  );
}
