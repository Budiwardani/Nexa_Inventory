import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetQcInspections,
  useCreateQcInspection,
  useDeleteQcInspection,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'qc_no', label: 'QC No' },
  { key: 'reference_no', label: 'Reference' },
  { key: 'inspection_date', label: 'Date' },
  { key: 'sample_qty', label: 'Sample Qty' },
  { key: 'pass_qty', label: 'Pass' },
  { key: 'fail_qty', label: 'Fail' },
  { key: 'inspector', label: 'Inspector' },
  {
    key: 'result',
    label: 'Result',
    render: (row) => <StatusBadge status={row.result || 'Draft'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'reference_no', label: 'Reference No', required: true, placeholder: 'WO-0001 / PO-0001' },
  { key: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
  { key: 'sample_qty', label: 'Sample Qty', type: 'number', required: true },
  { key: 'pass_qty', label: 'Pass Qty', type: 'number' },
  { key: 'fail_qty', label: 'Fail Qty', type: 'number' },
  { key: 'result', label: 'Result', type: 'select', options: ['Pass', 'Fail', 'Pending'] },
  { key: 'inspector', label: 'Inspector Name' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function QualityControlPage() {
  const { data = [], isLoading } = useGetQcInspections();
  const create = useCreateQcInspection();
  const del = useDeleteQcInspection();

  return (
    <CrudPage
      title="Quality Control"
      description="Manage QC inspections for incoming, in-process, and final product checks."
      queryKey="qc-inspections"
      apiPath="qc-inspections"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      statusKey="result"
      noDataMessage="No QC inspections found. Click 'New Quality' to add one."
    />
  );
}
