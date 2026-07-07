import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetCapacityPlans,
  useCreateCapacityPlan,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'plan_no', label: 'Plan No' },
  { key: 'machine_id', label: 'Machine ID' },
  { key: 'work_center', label: 'Work Center' },
  { key: 'plan_date', label: 'Plan Date' },
  { key: 'shift', label: 'Shift' },
  { key: 'available_hours', label: 'Available (h)' },
  { key: 'planned_hours', label: 'Planned (h)' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Draft'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'machine_id', label: 'Machine ID', type: 'number' },
  { key: 'work_center', label: 'Work Center', required: true, placeholder: 'WC-01' },
  { key: 'plan_date', label: 'Plan Date', type: 'date', required: true },
  {
    key: 'shift',
    label: 'Shift',
    type: 'select',
    required: true,
    options: ['Shift 1', 'Shift 2', 'Shift 3', 'Full Day'],
  },
  { key: 'available_hours', label: 'Available Hours', type: 'number', required: true },
  { key: 'planned_hours', label: 'Planned Hours', type: 'number' },
  { key: 'operator_count', label: 'Operator Count', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Draft', 'Released', 'Completed'],
  },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function CapacityPlanningPage() {
  const { data = [], isLoading } = useGetCapacityPlans();
  const create = useCreateCapacityPlan();

  return (
    <CrudPage
      title="Capacity Planning"
      description="Manage capacity forecasts, machine availability, and shift planning."
      queryKey="capacity-plans"
      apiPath="capacity-plans"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      statusKey="status"
      noDataMessage="No capacity plans found. Click 'New Capacity' to add one."
    />
  );
}
