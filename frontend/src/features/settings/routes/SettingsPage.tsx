export const SettingsPage = () => {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        Configure system preferences and administrative settings. This module aligns with enterprise governance and audit control rules.
      </p>
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Key rules</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
          <li>System settings are centralized for authorization, audit, and workflows.</li>
          <li>Any configuration change must be traceable and reversible.</li>
          <li>Superadmin can manage roles, permissions, and module access.</li>
        </ul>
      </div>
    </div>
  );
};
