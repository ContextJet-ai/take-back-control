"use client";
import { useEffect, useRef } from "react";
import { clearState } from "@/lib/wizard-state";

const EXIT_URL = "https://www.bbc.com/weather";

export function leaveNow() {
  clearState();
  window.location.replace(EXIT_URL);
}

export function QuickExit() {
  const lastEsc = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - lastEsc.current < 800) leaveNow();
      lastEsc.current = now;
    };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) { clearState(); window.location.reload(); } };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", onShow);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pageshow", onShow); };
  }, []);
  return (
    <button
      type="button"
      onClick={leaveNow}
      className="fixed bottom-4 right-4 z-40 hidden rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg shadow-lg sm:inline-flex"
      aria-label="Quick exit. Leaves this site immediately and clears your answers. Press Escape twice for the same."
    >
      Quick exit
    </button>
  );
}

const EXIT_LABEL = "Quick exit. Leaves this site immediately and clears your answers.";

// On phones the exit lives in the header, so it can never sit on top of page content.
export function QuickExitBar() {
  return (
    <div className="flex h-10 items-center justify-between border-t border-border px-4 text-xs text-muted sm:hidden">
      <span>Private. Nothing is uploaded.</span>
      <button type="button" onClick={leaveNow} aria-label={EXIT_LABEL} className="inline-flex min-h-[36px] items-center rounded-full bg-fg px-3 text-xs font-medium text-bg">
        Quick exit
      </button>
    </div>
  );
}
