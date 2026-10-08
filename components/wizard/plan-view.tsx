"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import type { Plan } from "@/lib/plan";
import { planItemIds, loadProgress, saveProgress, countDone, type Progress } from "@/lib/progress";
import { LetterCard } from "./letter-card";
import { DoneToggle } from "./done-toggle";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-56 flex-col gap-4 pt-8 sm:scroll-mt-40">
      <span className="block h-0.5 w-8 rounded-full bg-accent" aria-hidden="true" />
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function PlanView({ plan }: { plan: Plan }) {
  const [done, setDone] = useState<Progress>({});
  useEffect(() => { setDone(loadProgress()); }, []);
  const toggle = (id: string) => setDone((prev) => { const next = { ...prev, [id]: !prev[id] }; saveProgress(next); return next; });

  const ids = planItemIds(plan);
  const doneCount = countDone(ids, done);
  const allDone = ids.length > 0 && doneCount === ids.length;
  const hasReport = plan.platforms.length > 0 || !!plan.otherUrl;
  const jumps = [
    { id: "sec-now", label: "Right now", show: true },
    { id: "sec-regulator", label: "Regulator", show: !!plan.regulatorFirst },
    { id: "sec-report", label: "Report", show: hasReport },
    { id: "sec-search", label: "Search", show: plan.searchEngines.length > 0 },
    { id: "sec-levers", label: "Legal", show: plan.levers.length > 0 },
    { id: "sec-prevent", label: "Prevent", show: true },
    { id: "sec-letters", label: "Letters", show: plan.letters.length > 0 },
    { id: "sec-support", label: "Support", show: true },
  ].filter((j) => j.show);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Your plan</h1>
        <p className="mt-2 text-muted">Work through it top to bottom. Tick things off as you go. Your progress is kept on this device until you close the tab.</p>
      </header>

      <div className="sticky top-[6.5rem] z-20 -mx-4 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:top-16">
        <p role="status" className="text-sm font-medium">{doneCount} of {ids.length} done</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full rounded-full bg-accent" style={{ width: ids.length ? `${Math.round((doneCount / ids.length) * 100)}%` : "0%" }} />
        </div>
        <nav aria-label="Plan sections" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {jumps.map((j) => <a key={j.id} href={`#${j.id}`} className="inline-flex min-h-[36px] shrink-0 items-center rounded-full border border-border bg-surface-solid px-3 text-sm hover:border-accent">{j.label}</a>)}
        </nav>
      </div>

      {allDone && (
        <p className="rounded-card border border-accent bg-accent-soft p-5">Everything on this list is done. That took real effort. Platforms often act within 24 to 72 hours. If something is still up after that, use the &quot;if ignored&quot; notes in each guide, and come back to the support list below whenever you need it.</p>
      )}

      {plan.warnings.length > 0 && (
        <section aria-labelledby="read-first" className="rounded-card border border-accent bg-accent-soft p-5">
          <h2 id="read-first" className="flex items-center gap-2 text-lg font-semibold"><Warning size={20} weight="fill" className="text-accent" aria-hidden="true" />Read this first</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">{plan.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      )}

      <Section id="sec-now" title="Right now">
        <ol className="flex flex-col gap-4">{plan.rightNow.map((s, i) => (
          <li key={s} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <span className="flex gap-3"><span className="font-semibold text-accent" aria-hidden="true">{i + 1}.</span><span>{s}</span></span>
            <DoneToggle done={!!done[`now-${i}`]} onToggle={() => toggle(`now-${i}`)} label={`step ${i + 1}`} />
          </li>
        ))}</ol>
        <p className="text-sm"><Link href="/evidence" className="font-medium text-accent underline">Build an evidence log</Link> with links, dates, and file fingerprints. Nothing is uploaded.</p>
      </Section>

      {plan.regulatorFirst && (
        <Section id="sec-regulator" title="Report to the regulator first">
          <p>{plan.regulatorFirst.summary}</p>
          <a href={plan.regulatorFirst.url} {...ext} className="font-medium text-accent underline">Open {plan.regulatorFirst.name}</a>
          <div><DoneToggle done={!!done["regulator"]} onToggle={() => toggle("regulator")} label={plan.regulatorFirst.name} /></div>
        </Section>
      )}

      {hasReport && (
        <Section id="sec-report" title="Report to platforms">
          {plan.platforms.map((p) => (
            <div key={p.slug} className="rounded-card border border-border bg-surface-solid p-5">
              <h3 className="font-semibold">{p.name}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <p className="mt-3 text-sm text-muted">{p.expectedResponse}</p>
              <a href={p.reportUrl} {...ext} className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-fg hover:brightness-105">Open report page</a>
              <p className="mt-2 text-sm text-muted">If ignored: {p.escalation}</p>
              <div className="mt-4"><DoneToggle done={!!done[`report-${p.slug}`]} onToggle={() => toggle(`report-${p.slug}`)} label={`report to ${p.name}`} /></div>
            </div>
          ))}
          {plan.otherUrl && (
            <div className="rounded-card border border-border bg-surface-solid p-5">
              <h3 className="font-semibold">Another website</h3>
              <p className="mt-2 text-sm">Find the site&apos;s abuse contact, then send the hosting provider letter below. <Link href="/platforms/other" className="text-accent underline">How to find the contact</Link>.</p>
              <div className="mt-4"><DoneToggle done={!!done["report-other"]} onToggle={() => toggle("report-other")} label="report to the other website" /></div>
            </div>
          )}
        </Section>
      )}

      {plan.searchEngines.length > 0 && (
        <Section id="sec-search" title="Remove from search">
          <p className="text-sm text-muted">Even after a post is deleted, search results can linger. Ask each search engine to drop them.</p>
          <ul className="flex flex-col gap-3">{plan.searchEngines.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3">
              <a href={p.reportUrl} {...ext} className="font-medium text-accent underline">{p.name}</a>
              <DoneToggle done={!!done[`search-${p.slug}`]} onToggle={() => toggle(`search-${p.slug}`)} label={`remove from ${p.name}`} />
            </li>
          ))}</ul>
        </Section>
      )}

      {plan.levers.length > 0 && (
        <Section id="sec-levers" title="Legal levers where you are">
          {plan.levers.map((l) => (
            <div key={l.name} className="rounded-card border border-border bg-surface-solid p-5">
              <h3 className="font-semibold">{l.name}</h3>
              <p className="mt-1 text-sm">{l.summary}</p>
              {l.deadline && <p className="mt-2 text-sm text-muted">Deadline for the platform: {l.deadline}</p>}
              {l.url && <a href={l.url} {...ext} className="mt-3 inline-block font-medium text-accent underline">Open</a>}
              <p className="mt-2 text-xs text-muted">Checked {l.verifiedOn}</p>
            </div>
          ))}
        </Section>
      )}

      <Section id="sec-prevent" title="Stop it spreading">
        {plan.prevention.map((r) => (
          <div key={r.name} className="rounded-card border border-border bg-surface-solid p-5">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="mt-1 text-sm">{r.description}</p>
            <p className="mt-2 text-sm text-muted">The fingerprint is made on your device. The image itself is never sent anywhere.</p>
            <a href={r.url} {...ext} className="mt-3 inline-block font-medium text-accent underline">Go to {r.name}</a>
            <div className="mt-4"><DoneToggle done={!!done[`prevent-${r.name}`]} onToggle={() => toggle(`prevent-${r.name}`)} label={`use ${r.name}`} /></div>
          </div>
        ))}
      </Section>

      {plan.letters.length > 0 && (
        <Section id="sec-letters" title="Letters">
          <p className="text-sm text-muted">Edit, copy, and send. Dates are filled in for today.</p>
          {plan.letters.map((l, i) => (
            <div key={`${l.kind}-${l.platform}-${i}`} className="flex flex-col gap-3">
              <LetterCard kind={l.kind} platform={l.platform} urls={l.urls} email={l.email} minor={l.minor} />
              <div><DoneToggle done={!!done[`letter-${i}`]} onToggle={() => toggle(`letter-${i}`)} label={`send the letter to ${l.platform}`} /></div>
            </div>
          ))}
        </Section>
      )}

      <Section id="sec-support" title="Support">
        <ul className="space-y-3">{plan.support.map((r) => (
          <li key={r.name}>
            <a href={r.url} {...ext} className="font-medium text-accent underline">{r.name}</a>
            {r.phone && <a href={`tel:${r.phone.replace(/[^+\d]/g, "")}`} className="ml-2 text-sm font-medium text-accent underline">{r.phone}</a>}
            <p className="text-sm text-muted">{r.description}</p>
          </li>
        ))}</ul>
      </Section>
    </div>
  );
}
