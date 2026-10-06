import { selectablePlatforms } from "@/content/platforms";

export function PlatformPicker({ selected, otherUrl, error, onToggle, onOtherUrl }: {
  selected: string[]; otherUrl: string; error: string | null;
  onToggle: (slug: string) => void; onOtherUrl: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend tabIndex={-1} className="mb-4 text-2xl font-semibold tracking-tight outline-none">Where was it posted?</legend>
      <p className="text-sm text-muted">Choose every place you know about.</p>
      {selectablePlatforms.map((p) => (
        <label key={p.slug} className={`flex cursor-pointer items-center gap-3 rounded-card border p-4 ${selected.includes(p.slug) ? "border-accent bg-surface" : "border-border"}`}>
          <input type="checkbox" checked={selected.includes(p.slug)} onChange={() => onToggle(p.slug)} className="accent-accent" aria-label={p.name} />
          <span className="font-medium">{p.name}</span>
        </label>
      ))}
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
