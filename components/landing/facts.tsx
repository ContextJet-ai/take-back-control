const FACTS = [
  { figure: "94%", label: "of 20,800 images reported to the UK Revenge Porn Helpline in 2025 were removed.", href: "https://swgfl.org.uk/magazine/revenge-porn-helpline-handles-record-number-of-cases-in-2025/" },
  { figure: "48 hours", label: "is how long US platforms now have to remove an image after a valid request, under the TAKE IT DOWN Act.", href: "https://www.finnegan.com/en/insights/articles/the-take-it-down-act-is-now-in-full-effect-what-platforms-need-to-know.html" },
  { figure: "24 hours", label: "is the removal deadline in India after a complaint, and in Australia after an eSafety notice.", href: "https://www.esafety.gov.au/report/image-based-abuse" },
];

export function Facts() {
  return (
    <section aria-labelledby="facts-h" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="facts-h" className="max-w-[24ch] text-3xl font-semibold tracking-tight">Taking images down works, and the law is on your side.</h2>
      <dl className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
        {FACTS.map((f) => (
          <div key={f.figure} data-figure className="border-t border-border pt-5">
            <dt className="text-4xl font-semibold tracking-tighter text-accent">{f.figure}</dt>
            <dd className="mt-3 text-muted">
              {f.label}{" "}
              <a href={f.href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-sm text-accent underline">Source</a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
