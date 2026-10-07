import { ShaderPanel } from "./shader-panel";
import { Button } from "@/components/button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-stretch gap-10 px-4 pt-16 pb-20 md:min-h-[600px] md:grid-cols-[1.1fr_1fr] md:pt-24">
      <div className="flex flex-col justify-center gap-6">
        <h1 className="text-4xl font-semibold tracking-tighter leading-none md:text-5xl">Get intimate images taken down. Step by step.</h1>
        <p className="max-w-[48ch] text-lg text-muted">Six questions, then a plan. Nothing is uploaded, and there is a quick exit on every page.</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/start">Start</Button>
          <Button href="#how" variant="secondary">How it works</Button>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-border md:aspect-auto md:h-full">
        <ShaderPanel className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-sm text-fg/80 md:p-8">
          <p className="max-w-[28ch] rounded-card bg-bg/70 px-3 py-2 backdrop-blur">Your images never leave your device. A fingerprint does the work.</p>
        </div>
      </div>
    </section>
  );
}
