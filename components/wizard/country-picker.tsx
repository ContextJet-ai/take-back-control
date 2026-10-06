const COUNTRIES: { code: string; name: string }[] = [
  { code: "US", name: "United States" }, { code: "GB", name: "United Kingdom" }, { code: "IN", name: "India" },
  { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" }, { code: "DE", name: "Germany" },
  { code: "FR", name: "France" }, { code: "BR", name: "Brazil" }, { code: "NG", name: "Nigeria" }, { code: "PH", name: "Philippines" },
];

export function CountryPicker({ value, onChange }: { value: string | null | undefined; onChange: (v: string | null) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight">Where are you?</h2>
      <p className="text-sm text-muted">Used only to show local helplines. You can skip this.</p>
      <label htmlFor="country" className="font-medium">Country</label>
      <select id="country" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className="rounded-card border border-border bg-bg px-4 py-3">
        <option value="">Choose a country</option>
        {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
      <label className="flex items-center gap-3">
        <input type="radio" name="country-skip" checked={value === null} onChange={() => onChange(null)} className="accent-accent" aria-label="Prefer not to say" />
        <span>Prefer not to say</span>
      </label>
    </div>
  );
}
