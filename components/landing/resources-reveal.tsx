"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Resource } from "@/content/types";

export function ResourcesReveal({ items }: { items: Resource[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((r, i) => (
        <motion.li key={r.name} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} className="border-t border-border pt-4">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">{r.name}</a>
          <p className="mt-1 text-sm text-muted">{r.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}
