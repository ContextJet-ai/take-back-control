import { notFound } from "next/navigation";
import { platforms, getPlatform } from "@/content/platforms";

export function generateStaticParams() { return platforms.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = getPlatform(slug);
  return { title: p ? `Report on ${p.name}` : "Not found" };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlatform(slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
      <p className="mt-2 text-muted">{p.expectedResponse}</p>
      <h2 className="mt-8 text-xl font-semibold">Steps</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <a href={p.reportUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-medium text-accent underline">Open the report page</a>
      <h2 className="mt-8 text-xl font-semibold">If nothing happens</h2>
      <p className="mt-2">{p.escalation}</p>
      {p.acceptsStopNCIIHashes && <p className="mt-4 text-sm text-muted">This platform blocks images fingerprinted through StopNCII.</p>}
      {p.notes && <p className="mt-4 text-sm text-muted">{p.notes}</p>}
    </article>
  );
}
