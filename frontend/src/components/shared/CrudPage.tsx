import { useState, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Upload, Plus, X, Trash2, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'datetime-local';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: any) => ReactNode;
}

export interface CrudPageProps {
  title: string;
  description: string;
  queryKey: string;
  apiPath: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  data: any[];
  isLoading: boolean;
  onSubmit: (values: Record<string, any>) => void;
  isSubmitting?: boolean;
  statusColorMap?: Record<string, string>;
  statusKey?: string;
  noDataMessage?: string;
  extraButtons?: ReactNode;
  onDelete?: (id: number) => void;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const defaultColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-blue-100 text-blue-700',
  Pass: 'bg-green-100 text-green-700',
  Fail: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Open: 'bg-orange-100 text-orange-700',
  Resolved: 'bg-green-100 text-green-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Posted: 'bg-purple-100 text-purple-700',
  Released: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-purple-100 text-purple-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status, colorMap }: { status: string; colorMap?: Record<string, string> }) {
  const map = { ...defaultColors, ...(colorMap || {}) };
  const cls = map[status] || 'bg-gray-100 text-gray-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
}

// ─── Import CSV Handler ───────────────────────────────────────────────────────

function useImportCsv(fields: FieldDef[], onSubmit: (values: Record<string, any>) => void) {
  const fileRef = useRef<HTMLInputElement>(null);

  const triggerImport = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'));
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',').map(v => v.trim());
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
        // Map to expected fields
        const mapped: Record<string, any> = {};
        fields.forEach(f => {
          if (row[f.key] !== undefined) mapped[f.key] = row[f.key];
        });
        onSubmit(mapped);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const headers = fields.map(f => f.label).join(',');
    const blob = new Blob([headers + '\n'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return { fileRef, triggerImport, handleFile, downloadTemplate };
}

// ─── Main CrudPage ────────────────────────────────────────────────────────────

export function CrudPage({
  title, description, columns, fields, data, isLoading, onSubmit,
  isSubmitting, statusColorMap, statusKey, noDataMessage, extraButtons, onDelete
}: CrudPageProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showImportMenu, setShowImportMenu] = useState(false);

  const { fileRef, triggerImport, handleFile, downloadTemplate } = useImportCsv(fields, (vals) => {
    onSubmit(vals);
  });

  const handleSubmit = () => {
    onSubmit(form);
    setForm({});
    setOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {extraButtons}
          {/* Import dropdown */}
          <div className="relative">
            <Button variant="outline" onClick={() => setShowImportMenu(v => !v)}>
              <Upload className="w-4 h-4 mr-1" /> Import <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            {showImportMenu && (
              <div className="absolute right-0 mt-1 w-44 rounded-lg border bg-white shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => { downloadTemplate(); setShowImportMenu(false); }}
                >
                  Download Template
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => { triggerImport(); setShowImportMenu(false); }}
                >
                  Upload CSV
                </button>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />

          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> New {title.split(' ')[0]}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">Loading…</div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          {noDataMessage || `No ${title} records found. Click "New" to add one.`}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : col.key === statusKey
                          ? <StatusBadge status={row[col.key]} colorMap={statusColorMap} />
                          : row[col.key] ?? '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteId(row.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New {title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <Label className="mb-1 block">{f.label}{f.required && <span className="text-red-500 ml-1">*</span>}</Label>
                {f.type === 'textarea' ? (
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={f.placeholder}
                    value={form[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : f.type === 'select' ? (
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <Input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={form[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this record? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId !== null && onDelete) {
                  onDelete(deleteId);
                }
                setDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
