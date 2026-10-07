import { EU_MEMBERS } from "@/content/regions";

const NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", IN: "India", AU: "Australia", CA: "Canada",
  AT: "Austria", BE: "Belgium", BG: "Bulgaria", HR: "Croatia", CY: "Cyprus", CZ: "Czechia", DK: "Denmark", EE: "Estonia", FI: "Finland", FR: "France", DE: "Germany", GR: "Greece", HU: "Hungary", IE: "Ireland", IT: "Italy", LV: "Latvia", LT: "Lithuania", LU: "Luxembourg", MT: "Malta", NL: "Netherlands", PL: "Poland", PT: "Portugal", RO: "Romania", SK: "Slovakia", SI: "Slovenia", ES: "Spain", SE: "Sweden",
  NG: "Nigeria", PH: "Philippines", BR: "Brazil", MX: "Mexico", ID: "Indonesia", PK: "Pakistan", BD: "Bangladesh", ZA: "South Africa", KE: "Kenya", EG: "Egypt", TR: "Turkey", SA: "Saudi Arabia", AE: "United Arab Emirates", JP: "Japan", KR: "South Korea", SG: "Singapore", MY: "Malaysia", NZ: "New Zealand", AR: "Argentina", CO: "Colombia",
};

function name(code: string): string {
  return NAMES[code] ?? code;
}
const byName = (a: string, b: string) => name(a).localeCompare(name(b));

const PACKS = ["US", "GB", "IN", "AU", "CA", ...[...EU_MEMBERS].sort(byName)];
const OTHER = ["NG", "PH", "BR", "MX", "ID", "PK", "BD", "ZA", "KE", "EG", "TR", "SA", "AE", "JP", "KR", "SG", "MY", "NZ", "AR", "CO"].sort(byName);

export function CountryPicker({ value, onChange }: { value: string | null | undefined; onChange: (v: string | null) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 tabIndex={-1} className="mb-1 text-2xl font-semibold tracking-tight outline-none">Where are you?</h2>
      <p className="text-sm text-muted">Used only to show local laws and helplines. You can skip this.</p>
      <label htmlFor="country" className="font-medium">Country</label>
      <select id="country" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className="rounded-card border border-border bg-bg px-4 py-3">
        <option value="">Choose a country</option>
        <optgroup label="Local guidance available">
          {PACKS.map((c) => <option key={c} value={c}>{name(c)}</option>)}
        </optgroup>
        <optgroup label="Other">
          {OTHER.map((c) => <option key={c} value={c}>{name(c)}</option>)}
        </optgroup>
      </select>
      <label className="flex items-center gap-3">
        <input type="radio" name="country-skip" checked={value === null} onChange={() => onChange(null)} className="accent-accent" aria-label="Prefer not to say" />
        <span>Prefer not to say</span>
      </label>
    </div>
  );
}
