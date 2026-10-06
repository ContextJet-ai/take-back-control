import { describe, it, expect } from "vitest";
import { platforms, getPlatform } from "@/content/platforms";
import { resourcesFor } from "@/content/resources";

describe("platform content", () => {
  it("has unique slugs and required fields", () => {
    const slugs = platforms.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of platforms) {
      expect(p.reportUrl).toMatch(/^https:\/\//);
      expect(p.steps.length).toBeGreaterThanOrEqual(3);
      expect(p.escalation.length).toBeGreaterThan(0);
    }
  });
  it("includes the generic other-website entry", () => {
    expect(getPlatform("other")?.name).toBe("Another website");
  });
  it("contains no em or en dashes", () => {
    const text = JSON.stringify(platforms);
    expect(text).not.toMatch(/[–—]/);
  });
});

describe("resources", () => {
  it("returns global resources when region is null", () => {
    const r = resourcesFor(null, false);
    expect(r.some((x) => x.name === "StopNCII")).toBe(true);
    expect(r.every((x) => x.region === "global")).toBe(true);
  });
  it("hides adult-only entries and shows minor entries for minors", () => {
    const r = resourcesFor(null, true);
    expect(r.some((x) => x.name === "Take It Down")).toBe(true);
    expect(r.some((x) => x.name === "StopNCII")).toBe(false);
  });
  it("hides minor-only entries for adults", () => {
    const r = resourcesFor(null, false);
    expect(r.some((x) => x.name === "Take It Down")).toBe(false);
  });
});

describe("minor resources", () => {
  it("adds a child helpline for known countries", () => {
    const gb = resourcesFor("GB", true);
    expect(gb.some((r) => r.name === "Childline")).toBe(true);
    expect(gb.some((r) => r.name === "Take It Down")).toBe(true);
  });
  it("falls back to global entries for unknown countries", () => {
    const zz = resourcesFor("ZZ", true);
    expect(zz.every((r) => r.region === "global")).toBe(true);
    expect(zz.some((r) => r.name === "NCMEC CyberTipline")).toBe(true);
  });
  it("includes a sextortion resource for minors", () => {
    expect(resourcesFor(null, true).some((r) => /sextortion/i.test(r.description))).toBe(true);
  });
});
