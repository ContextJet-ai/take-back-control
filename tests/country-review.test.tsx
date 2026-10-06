import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LetterCard } from "@/components/wizard/letter-card";
import { buildPlan, type Answers } from "@/lib/plan";
import { renderLetter } from "@/lib/letters";
import { leversFor } from "@/content/levers";

const base: Answers = { contentType: "image", posted: "yes", platformSlugs: ["x"], otherUrl: "", selfTaken: "no", minor: "no", country: "US" };

describe("country pack review fixes", () => {
  it("statutory letter cards have a contact field and a required name label", () => {
    render(<LetterCard kind="take-it-down-notice" platform="X" urls={[]} email="abuse@x.example" />);
    expect(screen.getByLabelText(/your contact details/i)).toBeTruthy();
    expect(screen.getByLabelText(/your full name \(required\)/i)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /open in your email app/i })).toBeNull();
    expect(screen.getByText(/fill in your name and contact details before sending/i)).toBeTruthy();
  });
  it("another website keeps the host abuse letter in every country", () => {
    for (const c of ["US", "IN", "DE", null]) {
      const p = buildPlan({ ...base, country: c, platformSlugs: ["other"], otherUrl: "https://bad.example/x" });
      expect(p.letters.some((l) => l.kind === "host-abuse")).toBe(true);
    }
  });
  it("US lever says where to submit the notice", () => {
    expect(leversFor("US")[0].summary).toMatch(/removal request form|report form/i);
  });
  it("Canada police lever does not point at the child tipline", () => {
    const l = leversFor("CA").find((x) => /police/i.test(x.name));
    expect(l?.url).not.toMatch(/cybertip/);
  });
  it("DSA notice for a minor does not require name and email", () => {
    const t = renderLetter("dsa-notice", { platform: "X", urls: ["https://x.example/1"], date: "today", minor: true });
    expect(t).toMatch(/Article 16\(2\)\(c\)/);
    expect(t).not.toMatch(/your full name, required/);
    const adult = renderLetter("dsa-notice", { platform: "X", urls: ["https://x.example/1"], date: "today" });
    expect(adult).toMatch(/your full name, required/);
  });
  it("India letter cites 3(2)(a) for acknowledgement and 72 hours", () => {
    const t = renderLetter("india-grievance", { platform: "X", urls: [], date: "today" });
    expect(t).toMatch(/Rule 3\(2\)\(a\)/);
    expect(t).toMatch(/Rule 3\(2\)\(b\)[^.]*24 hours/);
  });
  it("eSafety is not listed twice for Australia", () => {
    const p = buildPlan({ ...base, country: "AU" });
    expect(p.levers.some((l) => /eSafety/.test(l.name))).toBe(false);
    expect(p.regulatorFirst?.name).toMatch(/eSafety/);
  });
});
