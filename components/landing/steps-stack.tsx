"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Document", body: "Record every link and date before anything disappears." },
  { title: "Remove", body: "Report to each platform with the right form, and send the letters we prefill." },
  { title: "Prevent", body: "Fingerprint the images on your own device so partner platforms block re-uploads." },
];

export function StepsStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: cards[cards.length - 1], end: "top top", pin: true, pinSpacing: false });
        gsap.to(card, { scale: 0.94, opacity: 0.5, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true } });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="how" ref={ref} className="relative" data-testid="steps-stack" data-reduced={reduce} data-ready={ready}>
      {STEPS.map((s, i) => (
        <div key={s.title} style={{ zIndex: i + 1 }} className={`stack-card relative flex items-center justify-center bg-bg px-4 ${reduce ? "py-20" : "min-h-[100dvh]"}`}>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_2fr]">
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-card bg-accent-soft text-5xl font-semibold tracking-tighter text-accent md:h-32 md:w-32 md:text-6xl">{i + 1}</span>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-3 max-w-[55ch] text-lg text-muted">{s.body}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
