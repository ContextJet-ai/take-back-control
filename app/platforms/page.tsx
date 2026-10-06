import Link from "next/link";
import { platforms } from "@/content/platforms";

export const metadata = { title: "Platform guides" };

export default function PlatformsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Platform guides</h1>
      <p className="mt-2 max-w-[65ch] text-muted">How to report non-consensual intimate images on each platform, and what to do if they ignore you.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {platforms.map((p) => (
          <Link key={p.slug} href={`/platforms/${p.slug}`} className="rounded-card border border-border p-5 hover:bg-surface">
            <span className="font-semibold">{p.name}</span>
            <span className="mt-1 block text-sm text-muted">{p.expectedResponse}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
