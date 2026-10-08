import { PageBanner } from "@/components/page-banner";
export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 text-[1.0625rem]">
      <PageBanner src="/images/generated/sapling-light.webp" priority />
      <h1 className="text-3xl font-semibold tracking-tight">About this site</h1>
      <p className="mt-4 max-w-[65ch] leading-relaxed">Having intimate images shared without consent is a crime in many countries and a policy violation on every major platform. The steps to get them removed are scattered across dozens of help pages. This site puts them in one place and in the right order.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">It does not store anything about you. There is no account, no database, and no tracking. Fingerprinting to block future uploads is handled by StopNCII and Take It Down, which are linked from your plan.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">This is not legal advice. For your situation, contact a lawyer or one of the helplines on the resources page.</p>

      <section aria-labelledby="who-we-are" className="mt-14 rounded-card border border-border bg-surface-solid p-6 md:p-8">
        <h2 id="who-we-are" className="text-2xl font-semibold tracking-tight">Who we are</h2>
        <p className="mt-4 max-w-[60ch] leading-relaxed">
          We are <a href="https://contextjetai.com" target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">ContextJet AI</a>, a group of humans on this earth, building for humans on the same earth. Some days are harder than anyone should have to carry. We made this so that whoever you are, wherever you are, you can take a breath and take one step at a time. You can do this at your own pace, and what is yours stays yours.
        </p>
        <p className="mt-4 max-w-[60ch] leading-relaxed">If this happened to you, it is not your fault. You are not alone, and you never have to do this alone.</p>
        <p className="mt-6 font-medium">With care,<br />the ContextJet AI team</p>
        <p className="mt-6 max-w-[60ch] text-sm text-muted">
          If your organisation would like to link to this, translate it, or run it for the people you serve, we would be glad to hear from you at{" "}
          <a href="mailto:takeoff@contextjetai.services" className="text-accent underline">takeoff@contextjetai.services</a>.
        </p>
      </section>
    </article>
  );
}
