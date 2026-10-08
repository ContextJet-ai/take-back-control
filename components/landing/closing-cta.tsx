import Image from "next/image";
import { Button } from "@/components/button";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="relative isolate overflow-hidden rounded-card border border-border">
        <Image src="/images/closing-horizon.webp" alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="-z-10 object-cover dark:brightness-75" />
        <div className="px-5 py-14 md:px-14 md:py-24">
          <div className="max-w-md rounded-card bg-bg/90 p-8 backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">It takes about five minutes to get your plan.</h2>
            <div className="mt-6"><Button href="/start">Start</Button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
