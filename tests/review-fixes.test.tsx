import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Wizard } from "@/components/wizard/wizard";
import { Footer } from "@/components/footer";
import { QuickExit } from "@/components/quick-exit";
import { clearState, loadState, saveState, isCompleteState } from "@/lib/wizard-state";
import { getPlatform } from "@/content/platforms";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("review fixes", () => {
  beforeEach(() => { clearState(); push.mockClear(); });

  it("persists an answer as soon as it is chosen, before Next", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("A video"));
    expect(loadState()?.answers.contentType).toBe("video");
  });

  it("moves focus to the new question heading after Next", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image"));
    fireEvent.click(screen.getByText("Next"));
    const heading = screen.getByText("Has it been posted anywhere?");
    expect(document.activeElement).toBe(heading);
  });

  it("footer links to platforms and resources for phones", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Platforms" }).getAttribute("href")).toBe("/platforms");
    expect(screen.getByRole("link", { name: "Resources" }).getAttribute("href")).toBe("/resources");
  });

  it("rejects stored state that is missing required answers", () => {
    expect(isCompleteState({ step: 6, answers: { contentType: "image" } })).toBe(false);
    expect(isCompleteState({ step: 6, answers: { contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "no", minor: "no", country: null } })).toBe(true);
    expect(isCompleteState(null)).toBe(false);
  });

  it("clears answers and reloads when the page is restored from the back-forward cache", () => {
    const reload = vi.fn();
    Object.defineProperty(window, "location", { value: { ...window.location, reload, replace: vi.fn() }, writable: true });
    saveState({ step: 2, answers: { contentType: "image" } });
    render(<QuickExit />);
    act(() => { window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })); });
    expect(loadState()).toBeNull();
    expect(reload).toHaveBeenCalled();
  });

  it("points Bing at Microsoft's intimate-image report form", () => {
    expect(getPlatform("bing-search")?.reportUrl).toContain("microsoft.com/digitalsafety/report-a-concern");
  });
});
