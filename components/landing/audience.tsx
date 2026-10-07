import Link from "next/link";

export function Audience() {
  return (
    <section aria-labelledby="audience-h" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="audience-h" className="max-w-[18ch] text-3xl font-semibold tracking-tight">Who this is for.</h2>
          <p className="mt-4 max-w-[40ch] text-muted">If an intimate image or video of you was shared without your consent, or someone is threatening to share one, you can start here. You do not need an account or proof.</p>
        </div>
        <ul className="divide-y divide-border">
          <li className="py-6 first:pt-0">
            <h3 className="text-lg font-semibold">You are 18 or older</h3>
            <p className="mt-1 text-muted">You get a full plan, the platform reports, and a route to StopNCII so partner platforms block re-uploads.</p>
          </li>
          <li className="py-6">
            <h3 className="text-lg font-semibold">You are under 18, or the image was taken when you were</h3>
            <p className="mt-1 text-muted">You get a separate plan built around NCMEC&apos;s Take It Down, plus clear steps for sextortion. We will never ask you to save or send the image.</p>
          </li>
          <li className="py-6 last:pb-0">
            <h3 className="text-lg font-semibold">Someone is threatening to share something</h3>
            <p className="mt-1 text-muted">Nothing has been posted yet. You get what to do and not do right now, how to report the account, and how to protect the images before they spread.</p>
            <p className="mt-3"><Link href="/start" className="font-medium text-accent underline">Start the six questions</Link></p>
          </li>
        </ul>
      </div>
    </section>
  );
}
