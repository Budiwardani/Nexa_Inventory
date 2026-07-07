import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetScraps,
  useCreateScrap,
  useDeleteScrap,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'scrap_no', label: 'Scrap No' },
  { key: 'reference_no', label: 'Reference' },
  { key: 'scrap_date', label: 'Date' },
  { key: 'item_code', label: 'Item Code' },
  { key: 'qty', label: 'Qty' },
  { key: 'uom', label: 'UOM' },
  { key: 'reason', label: 'Reason' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Draft'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'reference_no', label: 'Reference No', placeholder: 'WO-0001 / PO-0001' },
  { key: 'scrap_date', label: 'Scrap Date', type: 'date', required: true },
  { key: 'item_code', label: 'Item Code', required: true },
  { key: 'qty', label: 'Quantity', type: 'number', required: true },
  { key: 'uom', label: 'UOM', required: true, placeholder: 'PCS / KG / M' },
  {
    key: 'reason',
    label: 'Scrap Reason',
    type: 'select',
    required: true,
    options: ['Defective', 'Expired', 'Damaged', 'Over-production', 'Other'],
  },
  { key: 'estimated_cost', label: 'Estimated Cost', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function ScrapManagementPage() {
  const { data = [], isLoading } = useGetScraps();
  const create = useCreateScrap();
  const del = useDeleteScrap();

  return (
    <CrudPage
      title="Scrap Management"
      description="Record and track scrap items, calculate costs, and adjust inventory permanently."
      queryKey="scraps"
      apiPath="scraps"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      statusKey="status"
      noDataMessage="No scrap records found. Click 'New Scrap' to add one."
    />
  );
}
