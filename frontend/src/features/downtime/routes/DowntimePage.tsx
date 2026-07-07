import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetDowntimes,
  useCreateDowntime,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'downtime_no', label: 'Downtime No' },
  { key: 'machine_id', label: 'Machine ID' },
  { key: 'start_time', label: 'Start Time' },
  { key: 'end_time', label: 'End Time' },
  { key: 'duration_minutes', label: 'Duration (min)' },
  {
    key: 'reason_category',
    label: 'Category',
    render: (row) => <StatusBadge status={row.reason_category || 'Unplanned'} />,
  },
  { key: 'reported_by', label: 'Reported By' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Open'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'machine_id', label: 'Machine ID', type: 'number', required: true },
  { key: 'start_time', label: 'Start Time', type: 'datetime-local', required: true },
  { key: 'end_time', label: 'End Time', type: 'datetime-local' },
  { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number' },
  {
    key: 'reason_category',
    label: 'Reason Category',
    type: 'select',
    required: true,
    options: ['Planned', 'Unplanned', 'Breakdown', 'Changeover', 'Shortage', 'Other'],
  },
  { key: 'reason_detail', label: 'Reason Detail', type: 'textarea' },
  { key: 'reported_by', label: 'Reported By' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Open', 'In Progress', 'Resolved', 'Closed'],
  },
];

export function DowntimePage() {
  const { data = [], isLoading } = useGetDowntimes();
  const create = useCreateDowntime();

  return (
    <CrudPage
      title="Machine Downtime"
      description="Capture downtime events, root causes, and repair status for OEE tracking."
      queryKey="downtimes"
      apiPath="downtimes"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      statusKey="status"
      noDataMessage="No downtime records found. Click 'New Machine' to add one."
    />
  );
}
