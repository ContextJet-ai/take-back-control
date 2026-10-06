import Link from "next/link";
import type { Plan } from "@/lib/plan";
import { LetterCard } from "./letter-card";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function PlanView({ plan }: { plan: Plan }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Your plan</h1>
        <p className="mt-2 text-muted">Work through it top to bottom. You can come back to this page while this tab is open.</p>
      </header>

      {plan.warnings.length > 0 && (
        <section aria-labelledby="read-first" className="rounded-card border border-accent bg-surface p-5">
          <h2 id="read-first" className="text-lg font-semibold">Read this first</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">{plan.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      )}

      <Section title="Right now">
        <ol className="list-decimal space-y-2 pl-5">{plan.rightNow.map((s) => <li key={s}>{s}</li>)}</ol>
        <p className="text-sm"><Link href="/evidence" className="font-medium text-accent underline">Build an evidence log</Link> with links, dates, and file fingerprints. Nothing is uploaded.</p>
      </Section>

      {(plan.platforms.length > 0 || plan.otherUrl) && (
        <Section title="Report to platforms">
          {plan.platforms.map((p) => (
            <div key={p.slug} className="rounded-card border border-border p-5">
              <h3 className="font-semibold">{p.name}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <p className="mt-3 text-sm text-muted">{p.expectedResponse}</p>
              <a href={p.reportUrl} {...ext} className="mt-3 inline-block font-medium text-accent underline">Open {p.name}&apos;s report page</a>
              <p className="mt-2 text-sm text-muted">If ignored: {p.escalation}</p>
            </div>
          ))}
          {plan.otherUrl && (
            <div className="rounded-card border border-border p-5">
              <h3 className="font-semibold">Another website</h3>
              <p className="mt-2 text-sm">Find the site&apos;s abuse contact, then send the hosting provider letter below. <Link href="/platforms/other" className="text-accent underline">How to find the contact</Link>.</p>
            </div>
          )}
        </Section>
      )}

      {plan.searchEngines.length > 0 && (
        <Section title="Remove from search">
          <p className="text-sm text-muted">Even after a post is deleted, search results can linger. Ask each search engine to drop them.</p>
          <ul className="space-y-2">{plan.searchEngines.map((p) => (
            <li key={p.slug}><a href={p.reportUrl} {...ext} className="font-medium text-accent underline">{p.name}</a></li>
          ))}</ul>
        </Section>
      )}

      <Section title="Stop it spreading">
        {plan.prevention.map((r) => (
          <div key={r.name} className="rounded-card border border-border p-5">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="mt-1 text-sm">{r.description}</p>
            <p className="mt-2 text-sm text-muted">The fingerprint is made on your device. The image itself is never sent anywhere.</p>
            <a href={r.url} {...ext} className="mt-3 inline-block font-medium text-accent underline">Go to {r.name}</a>
          </div>
        ))}
      </Section>

      {plan.letters.length > 0 && (
        <Section title="Letters">
          <p className="text-sm text-muted">Edit, copy, and send. Dates are filled in for today.</p>
          {plan.letters.map((l, i) => <LetterCard key={`${l.kind}-${l.platform}-${i}`} kind={l.kind} platform={l.platform} urls={l.urls} />)}
        </Section>
      )}

      <Section title="Support">
        <ul className="space-y-3">{plan.support.map((r) => (
          <li key={r.name}>
            <a href={r.url} {...ext} className="font-medium text-accent underline">{r.name}</a>
            {r.phone && <span className="text-sm text-muted"> {r.phone}</span>}
            <p className="text-sm text-muted">{r.description}</p>
          </li>
        ))}</ul>
      </Section>
    </div>
  );
}
