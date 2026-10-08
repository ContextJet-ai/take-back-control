"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Answers } from "@/lib/plan";
import { emptyAnswers, loadState, saveState } from "@/lib/wizard-state";
import { Button } from "@/components/button";
import { Progress } from "./progress";
import { Question } from "./question";
import { PlatformPicker } from "./platform-picker";
import { CountryPicker } from "./country-picker";

type StepId = "contentType" | "posted" | "platforms" | "selfTaken" | "minor" | "country";

const WHY: Record<StepId, string> = {
  contentType: "The steps differ for an image, a video, and a threat. A threat means nothing is posted yet, so the plan focuses on what to do before it spreads.",
  posted: "If something is already posted, we show you where to report it. If not, we skip those steps and focus on prevention and evidence.",
  platforms: "Each platform has its own report form and timing. Choose every place you know about. You can start again to add more.",
  selfTaken: "If you took the image yourself you also hold the copyright, which gives you an extra legal route to removal. It changes nothing else.",
  minor: "Anyone under 18 gets a plan built around child-protection services and clear safety steps. An image from your teens counts, even if you are an adult now.",
  country: "Laws and deadlines differ by country. We use this only to show local rules and helplines. You can skip it.",
};

function stepsFor(a: Partial<Answers>): StepId[] {
  const posted = a.posted === "yes" || a.posted === "unsure";
  return ["contentType", "posted", ...(posted ? (["platforms"] as StepId[]) : []), "selfTaken", "minor", "country"];
}

export function Wizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<Answers>>(emptyAnswers);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (s) {
      setAnswers({ ...emptyAnswers, ...s.answers });
      setIndex(Math.min(s.step, stepsFor(s.answers).length - 1));
    }
    setRestored(true);
  }, []);

  const steps = stepsFor(answers);
  const step = steps[Math.min(index, steps.length - 1)];
  const isLast = index === steps.length - 1;

  const headingRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const h = headingRef.current?.querySelector<HTMLElement>("legend, h2");
    h?.focus();
  }, [index]);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    setError(null);
    setAnswers((a) => { const nextAnswers = { ...a, [k]: v }; saveState({ step: index, answers: nextAnswers }); return nextAnswers; });
  };

  function validate(): string | null {
    switch (step) {
      case "contentType": return answers.contentType ? null : "Choose an option to continue.";
      case "posted": return answers.posted ? null : "Choose an option to continue.";
      case "platforms": {
        const sel = answers.platformSlugs ?? [];
        if (sel.length === 0) return "Choose at least one place.";
        if (sel.includes("other") && !/^https?:\/\/\S+$/.test(answers.otherUrl ?? "")) return "Paste the full link, starting with https://";
        return null;
      }
      case "selfTaken": return answers.selfTaken ? null : "Choose an option to continue.";
      case "minor": return answers.minor ? null : "Choose an option to continue.";
      case "country": return null;
    }
  }

  function next() {
    const problem = validate();
    if (problem) { setError(problem); return; }
    if (isLast) {
      const full: Answers = {
        contentType: answers.contentType!, posted: answers.posted!,
        platformSlugs: answers.platformSlugs ?? [], otherUrl: answers.otherUrl ?? "",
        selfTaken: answers.selfTaken!, minor: answers.minor!, country: answers.country ?? null,
      };
      saveState({ step: 6, answers: full });
      router.push("/plan");
      return;
    }
    const ni = index + 1;
    setIndex(ni); saveState({ step: ni, answers });
  }

  function back() { if (index > 0) { setError(null); setIndex(index - 1); saveState({ step: index - 1, answers }); } }

  if (!restored) return <div className="mx-auto max-w-xl px-4 py-12 min-h-[60dvh]" aria-busy="true" />;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || e.shiftKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (["BUTTON", "A", "SUMMARY", "TEXTAREA", "SELECT"].includes(tag)) return;
    e.preventDefault();
    next();
  }

  return (
    <div key={step} ref={headingRef} onKeyDown={onKeyDown} className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-12 motion-safe:animate-[rise_200ms_ease-out]">
      <Progress step={index + 1} total={steps.length} />
      <p className="-mt-3 text-xs text-muted">Your answers are kept on this device only, until you close the tab.</p>
      {step === "contentType" && (
        <Question title="What was shared, or threatened?" name="contentType" value={answers.contentType}
          onChange={(v) => set("contentType", v)}
          options={[{ value: "image", label: "An image" }, { value: "video", label: "A video" }, { value: "threat", label: "A threat to share something", hint: "Nothing has been posted yet" }]} />
      )}
      {step === "posted" && (
        <Question title="Has it been posted anywhere?" name="posted" value={answers.posted}
          onChange={(v) => set("posted", v)}
          options={[{ value: "yes", label: "Yes" }, { value: "threatened", label: "No, but someone is threatening to" }, { value: "unsure", label: "I am not sure" }]} />
      )}
      {step === "platforms" && (
        <PlatformPicker selected={answers.platformSlugs ?? []} otherUrl={answers.otherUrl ?? ""} error={error}
          onToggle={(slug) => { const cur = answers.platformSlugs ?? []; set("platformSlugs", cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]); }}
          onOtherUrl={(v) => set("otherUrl", v)} />
      )}
      {step === "selfTaken" && (
        <Question title="Did you take the image or video yourself?" name="selfTaken" value={answers.selfTaken}
          onChange={(v) => set("selfTaken", v)}
          options={[{ value: "yes", label: "Yes, I took it", hint: "This lets you use copyright law as well" }, { value: "no", label: "No, someone else did" }, { value: "unsure", label: "I am not sure" }]} />
      )}
      {step === "minor" && (
        <Question title="Is anyone in it under 18?" name="minor" value={answers.minor}
          onChange={(v) => set("minor", v)}
          options={[
            { value: "yes", label: "Yes", hint: "Including you, if it was taken when you were under 18, even if you are an adult now" },
            { value: "no", label: "No" },
          ]} />
      )}
      {step === "country" && (
        <CountryPicker value={answers.country} onChange={(v) => set("country", v)} />
      )}
      <details className="rounded-card border border-border bg-surface-solid px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium">Why we ask this</summary>
        <p className="mt-2 text-muted">{WHY[step]}</p>
      </details>
      {error && step !== "platforms" && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-4 sm:backdrop-blur-none">
        <Button variant="secondary" onClick={back} disabled={index === 0} className="min-h-[44px]">Back</Button>
        <Button onClick={next} className="min-h-[44px] shadow-[0_1px_0_rgba(0,0,0,0.08)] hover:brightness-105">{isLast ? "See my plan" : "Next"}</Button>
      </div>
    </div>
  );
}
