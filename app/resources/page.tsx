import { resourcesFor } from "@/content/resources";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  const all = [...resourcesFor(null, false), ...resourcesFor(null, true)].filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i);
  const groups = { prevention: "Stop it spreading", reporting: "Report", crisis: "Talk to someone", legal: "Legal help" } as const;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
      {(Object.keys(groups) as (keyof typeof groups)[]).map((k) => {
        const items = all.filter((r) => r.kind === k);
        if (!items.length) return null;
        return (
          <section key={k} className="mt-12">
            <span className="mb-3 block h-0.5 w-8 rounded-full bg-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{groups[k]}</h2>
            <ul className="mt-3 space-y-4">{items.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">{r.name}</a>
                {r.phone && <a href={`tel:${r.phone.replace(/[^+\d]/g, "")}`} className="ml-2 text-sm font-medium text-accent underline">{r.phone}</a>}
                <p className="text-sm text-muted">{r.description}</p>
              </li>
            ))}</ul>
          </section>
        );
      })}
    </div>
  );
}
