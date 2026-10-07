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
      className="fixed right-4 top-20 z-40 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg shadow-lg sm:top-auto sm:bottom-4"
      aria-label="Quick exit. Leaves this site immediately and clears your answers. Press Escape twice for the same."
    >
      Quick exit
    </button>
  );
}
