import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Palette, Globe, Save, CheckCircle } from 'lucide-react';

interface Setting {
  id?: number;
  key: string;
  value: string;
  group: string;
}

const BRANDING_KEYS = [
  { key: 'app_name', label: 'Application Name', placeholder: 'e.g. Nexa-MFG', group: 'branding', icon: Building2 },
  { key: 'app_logo_url', label: 'Logo URL', placeholder: 'https://...', group: 'branding', icon: Globe },
  { key: 'primary_color', label: 'Primary Color (CSS)', placeholder: '#6366f1', group: 'branding', icon: Palette },
  { key: 'client_name', label: 'Client / Company Name', placeholder: 'PT. Example Indonesia', group: 'branding', icon: Building2 },
  { key: 'client_address', label: 'Client Address', placeholder: 'Jl. ...', group: 'branding', icon: Building2 },
  { key: 'client_phone', label: 'Client Phone', placeholder: '+62...', group: 'branding', icon: Building2 },
  { key: 'client_email', label: 'Client Email', placeholder: 'info@...', group: 'branding', icon: Globe },
  { key: 'client_website', label: 'Client Website', placeholder: 'https://...', group: 'branding', icon: Globe },
];

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
});

export const BrandingPage = () => {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: settings = [], isLoading } = useQuery<Setting[]>({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings', authHeaders());
      return res.data.data ?? [];
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});

  // Merge fetched settings into form state (once loaded)
  const getValue = (key: string) => {
    if (form[key] !== undefined) return form[key];
    return (settings as Setting[]).find((s) => s.key === key)?.value ?? '';
  };

  const saveMutation = useMutation({
    mutationFn: async (entries: { key: string; value: string; group: string }[]) => {
      await Promise.all(
        entries.map((entry) => {
          const existing = (settings as Setting[]).find((s) => s.key === entry.key);
          if (existing?.id) {
            return api.put(`/settings/${existing.id}`, entry, authHeaders());
          }
          return api.post('/settings', entry, authHeaders());
        })
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    const entries = BRANDING_KEYS.map(({ key, group }) => ({
      key,
      value: getValue(key),
      group,
    })).filter((e) => e.value.trim() !== '');
    saveMutation.mutate(entries);
  };

  const appName = getValue('app_name') || 'Nexa-MFG';
  const appLogo = getValue('app_logo_url');
  const clientName = getValue('client_name');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Client Branding</h2>
        <p className="text-muted-foreground">
          Configure the application name, logo, and client identity that appears across the system.
        </p>
      </div>

      {/* Live Preview */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Live Preview — Sidebar Header
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/60 w-fit shadow-sm">
            {appLogo ? (
              <img src={appLogo} alt="Logo" className="h-10 w-10 object-contain rounded" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {appName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-base font-bold text-primary leading-tight">{appName}</p>
              {clientName && <p className="text-xs text-muted-foreground">{clientName}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Application Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Application Identity
            </CardTitle>
            <CardDescription>Displayed in the sidebar and browser tab.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {BRANDING_KEYS.slice(0, 3).map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">{label}</label>
                <input
                  type="text"
                  value={getValue(key)}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Client Information
            </CardTitle>
            <CardDescription>Used in reports, invoices, and print documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {BRANDING_KEYS.slice(3).map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">{label}</label>
                <input
                  type="text"
                  value={getValue(key)}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saveMutation.isPending ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Branding
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" />
            Saved! Sidebar will update automatically.
          </span>
        )}
      </div>
    </div>
  );
};
