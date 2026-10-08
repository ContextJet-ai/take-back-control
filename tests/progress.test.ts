import { describe, it, expect, beforeEach } from "vitest";
import { planItemIds, loadProgress, saveProgress, clearProgress, countDone } from "@/lib/progress";
import { buildPlan, type Answers } from "@/lib/plan";
import { saveState, clearState } from "@/lib/wizard-state";

const base: Answers = { contentType: "image", posted: "yes", platformSlugs: ["meta", "tiktok"], otherUrl: "", selfTaken: "no", minor: "no", country: null };

describe("plan progress", () => {
  beforeEach(() => { sessionStorage.clear(); clearState(); clearProgress(); });

  it("gives every checkable plan item a unique id", () => {
    const ids = planItemIds(buildPlan(base));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(["now-0", "report-meta", "report-tiktok", "search-google-search", "prevent-StopNCII", "letter-0"]));
  });
  it("counts items for a threat-only plan without platforms or search", () => {
    const ids = planItemIds(buildPlan({ ...base, contentType: "threat", posted: "threatened", platformSlugs: [] }));
    expect(ids.some((i) => i.startsWith("report-") || i.startsWith("search-") || i.startsWith("letter-"))).toBe(false);
    expect(ids.length).toBeGreaterThan(0);
  });
  it("includes the regulator for Australia", () => {
    expect(planItemIds(buildPlan({ ...base, country: "AU" }))).toContain("regulator");
  });
  it("round-trips progress and counts only ids in the plan", () => {
    saveProgress({ "now-0": true, "report-meta": true, "gone": true });
    expect(loadProgress()).toEqual({ "now-0": true, "report-meta": true, "gone": true });
    expect(countDone(["now-0", "report-meta", "report-tiktok"], loadProgress())).toBe(2);
  });
  it("survives storage throwing", () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error("blocked"); };
    expect(() => saveProgress({ a: true })).not.toThrow();
    expect(loadProgress()).toEqual({ a: true });
    Storage.prototype.setItem = orig;
  });
  it("ignores corrupt stored progress", () => {
    sessionStorage.setItem("plan-progress", "{nope");
    expect(loadProgress()).toEqual({});
  });
  it("quick exit state clearing also clears progress", () => {
    saveState({ step: 6, answers: { ...base } });
    saveProgress({ "now-0": true });
    clearState();
    expect(loadProgress()).toEqual({});
  });
});
