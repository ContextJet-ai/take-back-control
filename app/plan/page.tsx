"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPlan, type Plan } from "@/lib/plan";
import { loadState, isCompleteState } from "@/lib/wizard-state";
import { PlanView } from "@/components/wizard/plan-view";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => {
    const s = loadState();
    if (!isCompleteState(s)) { router.replace("/start"); return; }
    setPlan(buildPlan(s.answers));
  }, [router]);
  if (!plan) return <div className="mx-auto max-w-2xl px-4 py-12 text-muted">Loading your plan</div>;
  return <PlanView plan={plan} />;
}
