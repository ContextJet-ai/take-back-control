import { Hero } from "@/components/landing/hero";
import { StepsStack } from "@/components/landing/steps-stack";
import { HashVisual } from "@/components/landing/hash-visual";
import { ResourcesReveal } from "@/components/landing/resources-reveal";
import { ClosingCta } from "@/components/landing/closing-cta";
import { resourcesFor } from "@/content/resources";

export default function Home() {
  const items = resourcesFor(null, false).filter((r) => r.kind !== "prevention");
  return (
    <>
      <Hero />
      <StepsStack />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">How fingerprinting protects you</h2>
          <p className="mt-4 max-w-[55ch] text-lg text-muted">StopNCII turns an image into a short code on your device. Partner platforms compare uploads against that code and block matches. The image itself never leaves your phone.</p>
        </div>
        <HashVisual />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-semibold tracking-tight">Someone to talk to</h2>
        <div className="mt-8"><ResourcesReveal items={items} /></div>
      </section>
      <ClosingCta />
    </>
  );
}
