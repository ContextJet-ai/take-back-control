"use client";
import { CheckCircle, Circle } from "@phosphor-icons/react/dist/ssr";

export function DoneToggle({ done, onToggle, label }: { done: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={done ? `Done: ${label}. Press to undo` : `Mark as done: ${label}`}
      onClick={onToggle}
      className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${done ? "border-accent bg-accent-soft text-accent" : "border-border bg-surface-solid hover:border-accent"}`}
    >
      {done ? <CheckCircle size={20} weight="fill" aria-hidden="true" /> : <Circle size={20} aria-hidden="true" />}
      <span aria-hidden="true">{done ? "Done" : "Mark as done"}</span>
    </button>
  );
}
