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
