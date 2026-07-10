export const RouteFallback = () => {
  return (
    <div
      className="flex flex-col gap-4 p-5 lg:p-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex items-center justify-center h-40">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
};
