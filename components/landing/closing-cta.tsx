import { Button } from "@/components/button";
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="rounded-card bg-accent-soft px-8 py-14 md:px-14">
        <h2 className="max-w-[20ch] text-3xl font-semibold tracking-tight md:text-4xl">It takes about five minutes to get your plan.</h2>
        <div className="mt-8"><Button href="/start">Start</Button></div>
      </div>
    </section>
  );
}
