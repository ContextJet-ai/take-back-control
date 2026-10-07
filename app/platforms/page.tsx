import Link from "next/link";
import { platforms } from "@/content/platforms";

export const metadata = { title: "Platform guides" };

export default function PlatformsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Platform guides</h1>
      <p className="mt-3 max-w-[65ch] text-muted">How to report non-consensual intimate images on each platform, and what to do if they ignore you.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {platforms.map((p) => (
          <Link key={p.slug} href={`/platforms/${p.slug}`} className="flex flex-col gap-2 rounded-card border border-border bg-surface-solid p-5 transition-colors hover:border-accent">
            <span className="font-semibold">{p.name}</span>
            <span className="text-sm text-muted">{p.expectedResponse}</span>
            {p.acceptsStopNCIIHashes && <span className="mt-1 w-fit rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-accent">Honours StopNCII hashes</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
