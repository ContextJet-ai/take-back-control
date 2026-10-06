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

});

describe("LetterCard mailto", () => {
  it("offers to open the email app when an abuse address is known", () => {
    render(<LetterCard kind="platform-report" platform="Telegram" urls={[]} email="abuse@telegram.org" />);
    const link = screen.getByRole("link", { name: /open in your email app/i });
    expect(link.getAttribute("href")).toMatch(/^mailto:abuse@telegram\.org\?subject=/);
  });
  it("shows no email link without an address", () => {
    render(<LetterCard kind="platform-report" platform="X" urls={[]} />);
    expect(screen.queryByRole("link", { name: /open in your email app/i })).toBeNull();
  });
});
