import { Check } from "@phosphor-icons/react/dist/ssr";

export interface Option<V extends string> { value: V; label: string; hint?: string }

export function Question<V extends string>({ title, name, options, value, onChange }: {
  title: string; name: string; options: Option<V>[]; value: V | undefined; onChange: (v: V) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend tabIndex={-1} className="mb-4 text-2xl font-semibold tracking-tight outline-none">{title}</legend>
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <label key={o.value} className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-card border p-4 transition-colors ${selected ? "border-accent bg-accent-soft" : "border-border bg-surface-solid hover:border-muted"}`}>
            <input type="radio" name={name} value={o.value} checked={selected} onChange={() => onChange(o.value)} className="sr-only" aria-label={o.label} />
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? "border-accent bg-accent text-accent-fg" : "border-border"}`} aria-hidden="true">
              {selected && <Check size={14} weight="bold" />}
            </span>
            <span>
              <span className="block font-medium">{o.label}</span>
              {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
