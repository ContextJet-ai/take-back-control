import { describe, it, expect } from "vitest";
import { renderLetter } from "@/lib/letters";

const vars = { platform: "TikTok", urls: ["https://example.com/a", "https://example.com/b"], date: "6 October 2026", name: "" };

describe("renderLetter", () => {
  it("substitutes placeholders and lists urls one per line", () => {
    const out = renderLetter("platform-report", vars);
    expect(out).toContain("TikTok");
    expect(out).toContain("6 October 2026");
    expect(out).toContain("https://example.com/a\nhttps://example.com/b");
    expect(out).not.toMatch(/\{\{/);
  });
  it("omits the signature line when name is empty", () => {
    const out = renderLetter("platform-report", vars);
    expect(out.trim().endsWith("Thank you.")).toBe(true);
  });
  it("includes the name when provided", () => {
    const out = renderLetter("dmca-takedown", { ...vars, name: "A. Person" });
    expect(out).toContain("A. Person");
  });
  it("contains no em or en dashes", () => {
    for (const kind of ["platform-report", "dmca-takedown", "host-abuse"] as const) {
      expect(renderLetter(kind, vars)).not.toMatch(/[–—]/);
    }
  });
  it("platform letter does not claim to have kept copies of the content", () => {
    const out = renderLetter("platform-report", vars);
    expect(out).not.toMatch(/kept copies/i);
    expect(out).toMatch(/kept the links and account details/i);
  });
});

describe("statutory letters", () => {
  const v = { platform: "X", urls: ["https://x.example/1"], date: "6 October 2026", name: "A. Person", contact: "a@example.com" };
  it("TAKE IT DOWN notice has the four required elements", () => {
    const t = renderLetter("take-it-down-notice", v);
    expect(t).toMatch(/TAKE IT DOWN Act/); expect(t).toContain("https://x.example/1"); expect(t).toContain("a@example.com");
    expect(t).toMatch(/without my consent/i); expect(t).toMatch(/good faith/i); expect(t).toMatch(/Signed: A\. Person/); expect(t).toMatch(/48 hours/);
  });
  it("India grievance cites Rule 3(2)(b) and 24 hours", () => {
    const t = renderLetter("india-grievance", v);
    expect(t).toMatch(/Rule 3\(2\)\(b\)/); expect(t).toMatch(/24 hours/); expect(t).toMatch(/Grievance Officer/);
  });
  it("DSA notice has the Article 16 elements", () => {
    const t = renderLetter("dsa-notice", v);
    expect(t).toMatch(/Article 16/); expect(t).toMatch(/why.*illegal/i); expect(t).toContain("https://x.example/1"); expect(t).toContain("a@example.com"); expect(t).toMatch(/good faith/i);
  });
  it("marks a missing name as required", () => {
    expect(renderLetter("take-it-down-notice", { ...v, name: "" })).toMatch(/\(your full name, required\)/);
  });
  it("statutory letters contain no dashes", () => {
    for (const k of ["take-it-down-notice", "india-grievance", "dsa-notice"] as const) expect(renderLetter(k, v)).not.toMatch(/[–—]/);
  });
});
