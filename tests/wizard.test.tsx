import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Wizard } from "@/components/wizard/wizard";
import { clearState, loadState } from "@/lib/wizard-state";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("Wizard", () => {
  beforeEach(() => { clearState(); push.mockClear(); });

  it("skips the platform question when nothing is posted", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("A threat to share something"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No, but someone is threatening to"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/take the image or video yourself/i)).toBeTruthy();
  });

  it("blocks next when another website is chosen with no url", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Another website"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/paste the full link/i)).toBeTruthy();
    expect(screen.getByText(/where was it posted/i)).toBeTruthy();
  });

  it("saves answers and navigates to plan on finish", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("TikTok")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes, I took it")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Prefer not to say")); fireEvent.click(screen.getByText("See my plan"));
    expect(push).toHaveBeenCalledWith("/plan");
    expect(loadState()?.answers.platformSlugs).toEqual(["tiktok"]);
  });
  it("explains that the minor question covers images taken under 18", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("TikTok")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No, someone else did")); fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/taken when you were under 18/i)).toBeTruthy();
  });
});

describe("country picker", () => {
  it("lists every EU member and groups them", () => {
    clearState();
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("TikTok")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No, someone else did")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No")); fireEvent.click(screen.getByText("Next"));
    const select = screen.getByLabelText("Country") as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    for (const c of ["DE", "FR", "IT", "ES", "NL", "PL"]) expect(values).toContain(c);
    expect(values).toContain("NG");
    expect(select.querySelectorAll("optgroup").length).toBe(2);
  });
});

describe("option accessibility", () => {
  it("exposes the hint as the input description, not part of its name", () => {
    clearState();
    render(<Wizard />);
    const input = screen.getByLabelText("A threat to share something");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toMatch(/nothing has been posted yet/i);
  });
});
