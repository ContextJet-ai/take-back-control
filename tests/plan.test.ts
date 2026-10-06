import { describe, it, expect } from "vitest";
import { buildPlan, type Answers } from "@/lib/plan";

const base: Answers = { contentType: "image", posted: "yes", platformSlugs: ["meta", "tiktok"], otherUrl: "", selfTaken: "no", minor: "no", country: null };

describe("buildPlan", () => {
  it("adult, posted on two platforms", () => {
    const p = buildPlan(base);
    expect(p.isMinor).toBe(false);
    expect(p.platforms.map((x) => x.slug)).toEqual(["meta", "tiktok"]);
    expect(p.searchEngines.length).toBe(2);
    expect(p.prevention.map((r) => r.name)).toEqual(["StopNCII"]);
    expect(p.letters.map((l) => l.kind)).toEqual(["platform-report", "platform-report"]);
    expect(p.rightNow[0]).toMatch(/screenshot/i);
  });
  it("threat only skips platforms and search but keeps prevention and support", () => {
    const p = buildPlan({ ...base, contentType: "threat", posted: "threatened", platformSlugs: [] });
    expect(p.platforms).toEqual([]);
    expect(p.searchEngines).toEqual([]);
    expect(p.letters).toEqual([]);
    expect(p.prevention.map((r) => r.name)).toEqual(["StopNCII"]);
    expect(p.support.length).toBeGreaterThan(0);
    expect(p.rightNow.some((s) => /do not (pay|reply|engage)/i.test(s))).toBe(true);
  });
  it("minor routes to Take It Down and never offers the copyright letter", () => {
    const p = buildPlan({ ...base, minor: "yes", selfTaken: "yes" });
    expect(p.isMinor).toBe(true);
    expect(p.prevention.map((r) => r.name)).toEqual(["Take It Down"]);
    expect(p.letters.every((l) => l.kind !== "dmca-takedown")).toBe(true);
    expect(p.support.some((r) => r.name === "NCMEC CyberTipline")).toBe(true);
  });
  it("self-taken adult image adds a copyright letter per platform", () => {
    const p = buildPlan({ ...base, selfTaken: "yes" });
    expect(p.letters.filter((l) => l.kind === "dmca-takedown").length).toBe(2);
  });
  it("another website produces a host abuse letter with the url", () => {
    const p = buildPlan({ ...base, platformSlugs: ["other"], otherUrl: "https://bad.example/x" });
    expect(p.otherUrl).toBe("https://bad.example/x");
    const host = p.letters.find((l) => l.kind === "host-abuse");
    expect(host?.urls).toEqual(["https://bad.example/x"]);
  });
  it("unknown slugs are ignored", () => {
    const p = buildPlan({ ...base, platformSlugs: ["meta", "nope"] });
    expect(p.platforms.map((x) => x.slug)).toEqual(["meta"]);
  });
});
