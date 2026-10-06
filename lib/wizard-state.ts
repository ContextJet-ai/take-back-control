import type { Answers } from "@/lib/plan";

export interface WizardState { step: number; answers: Partial<Answers> }
const KEY = "wizard";
let memory: WizardState | null = null;

export const emptyAnswers: Partial<Answers> = { platformSlugs: [], otherUrl: "", country: null };

export function saveState(s: WizardState): void {
  memory = s;
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked; memory copy is enough */ }
}

export function loadState(): WizardState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WizardState;
      if (typeof parsed.step === "number" && parsed.answers) return parsed;
    }
  } catch { /* fall through to memory */ }
  return memory;
}

export function clearState(): void {
  memory = null;
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
