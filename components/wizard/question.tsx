export interface Option<V extends string> { value: V; label: string; hint?: string }

export function Question<V extends string>({ title, name, options, value, onChange }: {
  title: string; name: string; options: Option<V>[]; value: V | undefined; onChange: (v: V) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 text-2xl font-semibold tracking-tight">{title}</legend>
      {options.map((o) => (
        <label key={o.value} className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 ${value === o.value ? "border-accent bg-surface" : "border-border"}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-1 accent-accent" aria-label={o.label} />
          <span>
            <span className="block font-medium">{o.label}</span>
            {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
