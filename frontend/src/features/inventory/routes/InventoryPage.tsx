import { CrudPage, type ColumnDef, type FieldDef } from '@/components/shared/CrudPage';
import {
  useGetInventories,
  useCreateInventory,
  useDeleteInventory,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'product', label: 'Product' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'qty', label: 'Qty' },
  { key: 'uom', label: 'UOM' },
  { key: 'unit_cost', label: 'Unit Cost', render: (row) => `$${row.unit_cost}` },
  { key: 'last_counted_at', label: 'Last Counted' },
];

const fields: FieldDef[] = [
  { key: 'product', label: 'Product', required: true },
  { key: 'warehouse', label: 'Warehouse', required: true },
  { key: 'qty', label: 'Quantity', type: 'number', required: true },
  { key: 'uom', label: 'UOM', placeholder: 'PCS / BOX' },
  { key: 'unit_cost', label: 'Unit Cost', type: 'number' },
  { key: 'last_counted_at', label: 'Last Counted At', type: 'date' },
];

export const InventoryPage = () => {
  const { data = [], isLoading } = useGetInventories();
  const create = useCreateInventory();
  const del = useDeleteInventory();

  return (
    <CrudPage
      title="Inventory Management"
      description="Track and manage stock levels across all warehouses."
      queryKey="inventories"
      apiPath="inventories"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      noDataMessage="No inventory records found. Click 'New' to add stock."
    />
  );
};
