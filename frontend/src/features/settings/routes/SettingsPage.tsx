import { CrudPage, type ColumnDef, type FieldDef } from '@/components/shared/CrudPage';
import {
  useGetSettings,
  useCreateSetting,
  useDeleteSetting,
} from '../../phase3/api/phase3Api';

const columns: ColumnDef[] = [
  { key: 'group', label: 'Group' },
  { key: 'key', label: 'Key' },
  { key: 'value', label: 'Value' },
];

const fields: FieldDef[] = [
  { key: 'group', label: 'Group', required: true, placeholder: 'general' },
  { key: 'key', label: 'Key', required: true, placeholder: 'site_name' },
  { key: 'value', label: 'Value', type: 'textarea' },
];

export const SettingsPage = () => {
  const { data = [], isLoading } = useGetSettings();
  const create = useCreateSetting();
  const del = useDeleteSetting();

  return (
    <CrudPage
      title="System Settings"
      description="Configure system preferences and administrative settings."
      queryKey="settings"
      apiPath="settings"
      columns={columns}
      fields={fields}
      data={data}
      isLoading={isLoading}
      onSubmit={(vals) => create.mutate(vals)}
      isSubmitting={create.isPending}
      onDelete={(id) => del.mutate(id)}
      noDataMessage="No settings configured. Click 'New' to add one."
    />
  );
};
