export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">Question {step} of {total}</p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round((step / total) * 100)}%` }} />
      </div>
    </div>
  );
}
