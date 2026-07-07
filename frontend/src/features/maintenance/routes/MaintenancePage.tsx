import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetMaintenanceLogs,
  useCreateMaintenanceLog,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'log_no', label: 'Log No' },
  { key: 'machine_id', label: 'Machine ID' },
  { key: 'maintenance_date', label: 'Date' },
  {
    key: 'type',
    label: 'Type',
    render: (row) => <StatusBadge status={row.type || 'Preventive'} />,
  },
  { key: 'technician', label: 'Technician' },
  { key: 'duration_hours', label: 'Duration (h)' },
  { key: 'cost', label: 'Cost' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Scheduled'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'machine_id', label: 'Machine ID', type: 'number', required: true, placeholder: 'Enter machine ID' },
  { key: 'maintenance_date', label: 'Maintenance Date', type: 'date', required: true },
  {
    key: 'type',
    label: 'Maintenance Type',
    type: 'select',
    required: true,
    options: ['Preventive', 'Corrective', 'Predictive', 'Emergency'],
  },
  { key: 'technician', label: 'Technician Name' },
  { key: 'duration_hours', label: 'Duration (hours)', type: 'number' },
  { key: 'cost', label: 'Cost', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
  },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function MaintenancePage() {
  const { data = [], isLoading } = useGetMaintenanceLogs();
  const create = useCreateMaintenanceLog();

  return (
    <CrudPage
      title="Machine Maintenance"
      description="Schedule and record preventive and corrective machine maintenance logs."
      queryKey="maintenance-logs"
      apiPath="maintenance-logs"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      statusKey="status"
      noDataMessage="No maintenance logs found. Click 'New Machine' to add one."
    />
  );
}
