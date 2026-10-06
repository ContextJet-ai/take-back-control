import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanView } from "@/components/wizard/plan-view";
import { buildPlan } from "@/lib/plan";

describe("PlanView", () => {
  it("renders sections for an adult with posted content", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "yes", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.getByText("Right now")).toBeTruthy();
    expect(screen.getByText("Report to platforms")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Facebook and Instagram" })).toBeTruthy();
    expect(screen.getByText("Remove from search")).toBeTruthy();
    expect(screen.getByText("Stop it spreading")).toBeTruthy();
    expect(screen.getAllByText("Copyright takedown notice").length).toBe(1);
    expect(screen.getByText("Support")).toBeTruthy();
  });
  it("omits report and search sections for threat only", () => {
    const plan = buildPlan({ contentType: "threat", posted: "threatened", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.queryByText("Report to platforms")).toBeNull();
    expect(screen.queryByText("Remove from search")).toBeNull();
  });
});
