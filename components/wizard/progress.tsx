export function Progress({ step, total }: { step: number; total: number }) {
  return <p className="text-sm text-muted">Question {step} of {total}</p>;
}
