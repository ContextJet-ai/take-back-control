"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Resource } from "@/content/types";

function Item({ r }: { r: Resource }) {
  return (
    <>
      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">{r.name}</a>
      <p className="mt-1 text-sm text-muted">{r.description}</p>
    </>
  );
}

export function ResourcesReveal({ items }: { items: Resource[] }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((r) => <li key={r.name} className="border-t border-border pt-4"><Item r={r} /></li>)}
      </ul>
    );
  }
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      <noscript><style>{`.reveal-item{opacity:1!important;transform:none!important}`}</style></noscript>
      {items.map((r, i) => (
        <motion.li key={r.name} className="reveal-item border-t border-border pt-4" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
          <Item r={r} />
        </motion.li>
      ))}
    </ul>
  );
}
