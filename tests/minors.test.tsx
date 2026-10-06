import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResourcesReveal } from "@/components/landing/resources-reveal";
import { LetterCard } from "@/components/wizard/letter-card";
import { renderLetter } from "@/lib/letters";
import { getPlatform } from "@/content/platforms";
import { globalResources } from "@/content/resources/global";

describe("deferred minors", () => {
  it("renders resources without an inline opacity when motion is reduced", () => {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("reduce"), media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), onchange: null, dispatchEvent: vi.fn(),
    }));
    render(<ResourcesReveal items={globalResources.slice(0, 2)} />);
    const items = screen.getAllByRole("listitem");
    for (const li of items) expect(li.getAttribute("style") ?? "").not.toMatch(/opacity:\s*0/);
  });

  it("tells the person to copy by hand when the clipboard is blocked", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) }, configurable: true });
    render(<LetterCard kind="platform-report" platform="X" urls={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(screen.getByText(/select the text above and copy it/i)).toBeTruthy());
  });

  it("DMCA letter carries a contact line", () => {
    const vars = { platform: "X", urls: ["https://a.example"], date: "today" };
    expect(renderLetter("dmca-takedown", { ...vars, contact: "me@example.com" })).toContain("Contact: me@example.com");
    expect(renderLetter("dmca-takedown", vars)).toContain("Contact: (add your email or postal address)");
    expect(renderLetter("platform-report", vars)).not.toContain("Contact:");
  });

  it("Pornhub escalation names the platform, not this site", () => {
    expect(getPlatform("pornhub")?.escalation).not.toMatch(/this site uses/);
    expect(getPlatform("pornhub")?.escalation).toMatch(/Pornhub uses/);
  });
});
