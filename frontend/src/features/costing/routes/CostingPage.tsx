import { CrudPage, type ColumnDef, type FieldDef, StatusBadge } from '@/components/shared/CrudPage';
import {
  useGetProductionCosts,
  useCreateProductionCost,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'cost_no', label: 'Cost No' },
  { key: 'reference_no', label: 'Reference' },
  { key: 'cost_date', label: 'Date' },
  { key: 'material_cost', label: 'Material Cost' },
  { key: 'labor_cost', label: 'Labor Cost' },
  { key: 'machine_cost', label: 'Machine Cost' },
  { key: 'overhead_cost', label: 'Overhead' },
  { key: 'total_cost', label: 'Total Cost' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status || 'Draft'} />,
  },
];

const fields: FieldDef[] = [
  { key: 'reference_no', label: 'Reference No', required: true, placeholder: 'WO-0001 / PO-0001' },
  { key: 'cost_date', label: 'Cost Date', type: 'date', required: true },
  { key: 'material_cost', label: 'Material Cost', type: 'number' },
  { key: 'labor_cost', label: 'Labor Cost', type: 'number' },
  { key: 'machine_cost', label: 'Machine Cost', type: 'number' },
  { key: 'overhead_cost', label: 'Overhead Cost', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Draft', 'Posted'],
  },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export function CostingPage() {
  const { data = [], isLoading } = useGetProductionCosts();
  const create = useCreateProductionCost();

  return (
    <CrudPage
      title="Costing"
      description="Track material, labor, machine, and overhead costs against production output."
      queryKey="production-costs"
      apiPath="production-costs"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      statusKey="status"
      noDataMessage="No production cost records found. Click 'New Costing' to add one."
    />
  );
}
