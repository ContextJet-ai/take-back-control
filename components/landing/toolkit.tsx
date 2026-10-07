import Link from "next/link";
import { ListChecks, EnvelopeSimple, FileText, Scales, SignOut } from "@phosphor-icons/react/dist/ssr";

const base = "flex flex-col gap-3 rounded-card border border-border p-6";

export function Toolkit() {
  return (
    <section aria-labelledby="toolkit-h" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="toolkit-h" className="max-w-[24ch] text-3xl font-semibold tracking-tight">Everything you need in one place.</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div data-tool className={`${base} bg-accent-soft md:col-span-2 md:min-h-[220px]`}>
          <ListChecks size={28} weight="regular" className="text-accent" aria-hidden="true" />
          <h3 className="text-xl font-semibold">A plan made for your situation</h3>
          <p className="max-w-[52ch] text-muted">Answer six questions. You get an ordered checklist: what to record now, which platforms to report to and exactly how, how to remove results from search, and where to get support.</p>
          <Link href="/start" className="mt-auto w-fit font-medium text-accent underline">Get your plan</Link>
        </div>
        <div data-tool className={`${base} bg-surface-solid`}>
          <EnvelopeSimple size={28} weight="regular" className="text-accent" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Letters that are ready to send</h3>
          <p className="text-muted">Removal requests prefilled for the platform and the law where you live. Open them in your own email app.</p>
        </div>
        <div data-tool className={`${base} bg-surface-solid`}>
          <FileText size={28} weight="regular" className="text-accent" aria-hidden="true" />
          <h3 className="text-lg font-semibold">An evidence log</h3>
          <p className="text-muted">Links, dates, and a fingerprint of each file, made on your device and never uploaded.</p>
          <Link href="/evidence" className="mt-auto w-fit font-medium text-accent underline">Build a log</Link>
        </div>
        <div data-tool className={`${base} bg-surface-solid`}>
          <Scales size={28} weight="regular" className="text-accent" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Your legal options by country</h3>
          <p className="text-muted">The US, UK, India, Australia, Canada, and the EU each give you a specific route and deadline.</p>
          <Link href="/resources" className="mt-auto w-fit font-medium text-accent underline">See resources</Link>
        </div>
        <div data-tool className={`${base} bg-accent-soft`}>
          <SignOut size={28} weight="regular" className="text-accent" aria-hidden="true" />
          <h3 className="text-lg font-semibold">A quick exit on every page</h3>
          <p className="text-muted">One tap clears your answers and leaves the site. No account, no history kept.</p>
        </div>
      </div>
    </section>
  );
}
