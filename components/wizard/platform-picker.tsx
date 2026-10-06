import { Check } from "@phosphor-icons/react/dist/ssr";
import { selectablePlatforms } from "@/content/platforms";

export function PlatformPicker({ selected, otherUrl, error, onToggle, onOtherUrl }: {
  selected: string[]; otherUrl: string; error: string | null;
  onToggle: (slug: string) => void; onOtherUrl: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend tabIndex={-1} className="mb-4 text-2xl font-semibold tracking-tight outline-none">Where was it posted?</legend>
      <p className="text-sm text-muted">Choose every place you know about.</p>
      {selectablePlatforms.map((p) => {
        const on = selected.includes(p.slug);
        return (
          <label key={p.slug} className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-card border p-4 transition-colors ${on ? "border-accent bg-accent-soft" : "border-border bg-surface-solid hover:border-muted"}`}>
            <input type="checkbox" checked={on} onChange={() => onToggle(p.slug)} className="sr-only" aria-label={p.name} />
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${on ? "border-accent bg-accent text-accent-fg" : "border-border"}`} aria-hidden="true">
              {on && <Check size={14} weight="bold" />}
            </span>
            <span className="font-medium">{p.name}</span>
          </label>
        );
      })}
      {selected.includes("other") && (
        <div className="flex flex-col gap-2">
          <label htmlFor="otherUrl" className="font-medium">Paste the link</label>
          <input id="otherUrl" type="url" value={otherUrl} onChange={(e) => onOtherUrl(e.target.value)} className="rounded-card border border-border bg-bg px-4 py-3" placeholder="https://" aria-describedby={error ? "otherUrl-error" : undefined} />
        </div>
      )}
      {error && <p id="otherUrl-error" role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
    </fieldset>
  );
}
