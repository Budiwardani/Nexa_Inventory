import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetReworks,
  useCreateRework,
  useDeleteRework,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'rework_no', label: 'Rework No' },
  { key: 'reference_no', label: 'Reference' },
  { key: 'rework_date', label: 'Date' },
  { key: 'item_code', label: 'Item Code' },
  { key: 'qty', label: 'Qty' },
  { key: 'reason', label: 'Reason' },
  { key: 'assigned_to', label: 'Assigned To' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Draft'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'reference_no', label: 'Reference No', placeholder: 'QC-XXXXXX / WO-0001' },
  { key: 'rework_date', label: 'Rework Date', type: 'date', required: true },
  { key: 'item_code', label: 'Item Code', required: true },
  { key: 'qty', label: 'Quantity', type: 'number', required: true },
  { key: 'uom', label: 'UOM', placeholder: 'PCS / KG' },
  {
    key: 'reason',
    label: 'Rework Reason',
    type: 'select',
    required: true,
    options: ['Assembly Error', 'Wrong Specification', 'Surface Defect', 'Dimensional Error', 'Other'],
  },
  { key: 'assigned_to', label: 'Assigned To' },
  { key: 'estimated_hours', label: 'Estimated Hours', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function ReworkPage() {
  const { data = [], isLoading } = useGetReworks();
  const create = useCreateRework();
  const del = useDeleteRework();

  return (
    <CrudPage
      title="Rework"
      description="Coordinate rework cycles after QC failures and track reinspection workflows."
      queryKey="reworks"
      apiPath="reworks"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      statusKey="status"
      noDataMessage="No rework records found. Click 'New Rework' to add one."
    />
  );
}
