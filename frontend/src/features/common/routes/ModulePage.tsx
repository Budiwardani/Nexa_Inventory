interface ModulePageProps {
  title: string;
  description: string;
  highlights?: string[];
}

export const ModulePage = ({ title, description, highlights }: ModulePageProps) => {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>

      {highlights?.length ? (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Key rules</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
