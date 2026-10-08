import type { Plan } from "@/lib/plan";

export type Progress = Record<string, boolean>;
const KEY = "plan-progress";
let memory: Progress = {};

export function planItemIds(plan: Plan): string[] {
  const ids: string[] = [];
  plan.rightNow.forEach((_, i) => ids.push(`now-${i}`));
  if (plan.regulatorFirst) ids.push("regulator");
  plan.platforms.forEach((p) => ids.push(`report-${p.slug}`));
  if (plan.otherUrl) ids.push("report-other");
  plan.searchEngines.forEach((p) => ids.push(`search-${p.slug}`));
  plan.prevention.forEach((r) => ids.push(`prevent-${r.name}`));
  plan.letters.forEach((_, i) => ids.push(`letter-${i}`));
  return ids;
}

export function countDone(ids: string[], progress: Progress): number {
  return ids.filter((id) => progress[id]).length;
}

export function saveProgress(p: Progress): void {
  memory = p;
  try { sessionStorage.setItem(KEY, JSON.stringify(p)); } catch { /* memory copy is enough */ }
}

export function loadProgress(): Progress {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Progress;
    }
  } catch { /* fall through */ }
  return memory;
}

export function clearProgress(): void {
  memory = {};
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
