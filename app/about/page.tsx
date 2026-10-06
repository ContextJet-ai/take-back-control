export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About this site</h1>
      <p className="mt-4 max-w-[65ch] leading-relaxed">Having intimate images shared without consent is a crime in many countries and a policy violation on every major platform. The steps to get them removed are scattered across dozens of help pages. This site puts them in one place and in the right order.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">It does not store anything about you. There is no account, no database, and no tracking. Fingerprinting to block future uploads is handled by StopNCII and Take It Down, which are linked from your plan.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">This is not legal advice. For your situation, contact a lawyer or one of the helplines on the resources page.</p>
    </article>
  );
}
