import Image from "next/image";
import { Button } from "@/components/button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-20 md:grid-cols-[1.1fr_1fr] md:pt-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tighter leading-none md:text-5xl">Get intimate images taken down. Step by step.</h1>
        <p className="max-w-[48ch] text-lg text-muted">Six questions, then a plan with the right report links and letters. Nothing is uploaded.</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/start">Start</Button>
          <Button href="#how" variant="secondary">How it works</Button>
        </div>
      </div>
      <Image src="/hero.webp" alt="" width={1200} height={900} priority fetchPriority="high" sizes="(min-width: 768px) 50vw, 100vw" className="rounded-card object-cover" />
    </section>
  );
}
