"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Document", body: "Screenshot every post with its link and date. Evidence first, before anything disappears." },
  { title: "Remove", body: "Report to each platform with the exact form that handles intimate images, and send the letters we prefill." },
  { title: "Prevent", body: "Fingerprint the images on your own device through StopNCII so partner platforms block re-uploads." },
];

export function StepsStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
    <section id="how" ref={ref} className="relative" data-testid="steps-stack" data-reduced={reduce}>
      {STEPS.map((s, i) => (
        <div key={s.title} className={`stack-card flex items-center justify-center bg-bg px-4 ${reduce ? "py-20" : "sticky top-0 min-h-[100dvh]"}`}>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_2fr]">
            <span className="text-7xl font-semibold tracking-tighter text-accent">{i + 1}</span>
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
