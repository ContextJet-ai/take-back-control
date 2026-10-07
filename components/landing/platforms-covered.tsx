import Link from "next/link";
import { platforms } from "@/content/platforms";

export function PlatformsCovered() {
  return (
    <section aria-labelledby="platforms-h" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="platforms-h" className="max-w-[26ch] text-3xl font-semibold tracking-tight">Step-by-step reporting for the places images spread.</h2>
      <p className="mt-4 max-w-[60ch] text-muted">Each guide has the exact steps, how long to expect, and what to do if they ignore you. Platforms that honour StopNCII hashes are marked in the full list.</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {platforms.map((p) => (
          <li key={p.slug}>
            <Link href={`/platforms/${p.slug}`} className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-surface-solid px-5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent">{p.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
