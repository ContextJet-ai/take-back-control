import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanView } from "@/components/wizard/plan-view";
import { buildPlan } from "@/lib/plan";

describe("PlanView", () => {
  it("renders sections for an adult with posted content", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "yes", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.getByRole("heading", { name: "Right now" })).toBeTruthy();
    expect(screen.getByText("Report to platforms")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Facebook and Instagram" })).toBeTruthy();
    expect(screen.getByText("Remove from search")).toBeTruthy();
    expect(screen.getByText("Stop it spreading")).toBeTruthy();
    expect(screen.getAllByText("Copyright takedown notice").length).toBe(1);
    expect(screen.getByRole("heading", { name: "Support" })).toBeTruthy();
  });
  it("omits report and search sections for threat only", () => {
    const plan = buildPlan({ contentType: "threat", posted: "threatened", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.queryByText("Report to platforms")).toBeNull();
    expect(screen.queryByText("Remove from search")).toBeNull();
  });
  it("renders warnings before everything else for a minor", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "no", minor: "yes", country: null });
    render(<PlanView plan={plan} />);
    const block = screen.getByRole("region", { name: /read this first/i });
    expect(block.textContent).toMatch(/do not forward/i);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(block.compareDocumentPosition(screen.getByRole("heading", { name: "Right now" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("PlanView levers", () => {
  it("renders the legal levers section for a US plan", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["x"], otherUrl: "", selfTaken: "no", minor: "no", country: "US" });
    render(<PlanView plan={plan} />);
    expect(screen.getByText("Legal levers where you are")).toBeTruthy();
    expect(screen.getByText(/TAKE IT DOWN Act request/)).toBeTruthy();
  });
});

import { fireEvent, within } from "@testing-library/react";
import { planItemIds, loadProgress, clearProgress } from "@/lib/progress";
import { beforeEach } from "vitest";

describe("PlanView checklist", () => {
  const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "no", minor: "no", country: null });
  const total = planItemIds(plan).length;
  beforeEach(() => { sessionStorage.clear(); clearProgress(); });

  it("starts at zero done and counts as items are marked", () => {
    render(<PlanView plan={plan} />);
    expect(screen.getByRole("status").textContent).toContain(`0 of ${total} done`);
    fireEvent.click(screen.getAllByRole("button", { name: /mark as done/i })[0]);
    expect(screen.getByRole("status").textContent).toContain(`1 of ${total} done`);
    expect(screen.getAllByRole("button", { pressed: true }).length).toBe(1);
    expect(loadProgress()["now-0"]).toBe(true);
  });
  it("can be unmarked", () => {
    render(<PlanView plan={plan} />);
    const first = screen.getAllByRole("button", { name: /mark as done/i })[0];
    fireEvent.click(first);
    fireEvent.click(screen.getByRole("button", { name: /^done/i, pressed: true }));
    expect(screen.getByRole("status").textContent).toContain(`0 of ${total} done`);
  });
  it("restores saved progress on load", () => {
    sessionStorage.setItem("plan-progress", JSON.stringify({ "now-0": true, "report-meta": true }));
    render(<PlanView plan={plan} />);
    expect(screen.getByRole("status").textContent).toContain(`2 of ${total} done`);
  });
  it("offers jump links only to sections that exist", () => {
    render(<PlanView plan={plan} />);
    const nav = screen.getByRole("navigation", { name: /plan sections/i });
    const hrefs = within(nav).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(expect.arrayContaining(["#sec-now", "#sec-report", "#sec-prevent", "#sec-letters", "#sec-support"]));
    for (const h of hrefs) expect(document.querySelector(h!)).toBeTruthy();
    const threat = buildPlan({ contentType: "threat", posted: "threatened", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "no", country: null });
    const { container } = render(<PlanView plan={threat} />);
    expect(container.querySelector("a[href='#sec-report']")).toBeNull();
  });
  it("celebrates quietly when everything is done", () => {
    const ids = planItemIds(plan);
    sessionStorage.setItem("plan-progress", JSON.stringify(Object.fromEntries(ids.map((i) => [i, true]))));
    render(<PlanView plan={plan} />);
    expect(screen.getByText(/everything on this list is done/i)).toBeTruthy();
  });
});
