import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AboutPage from "@/app/about/page";
import { Footer } from "@/components/footer";

describe("who we are", () => {
  it("About page introduces ContextJet AI with only facts from its own site", () => {
    const { container } = render(<AboutPage />);
    const who = screen.getByRole("heading", { name: /who we are/i }).closest("section")!;
    const text = who.textContent ?? "";
    expect(text).toMatch(/ContextJet AI/);
    expect(text).toMatch(/humans on this earth/i);
    expect(text).not.toMatch(/San Diego|Dubai|Bengaluru/);
    expect(text).toMatch(/not your fault/i);
    expect(text).not.toMatch(/collect|track|data|store/i);
    expect(text.split(/\s+/).length).toBeLessThan(140);
    expect(container.textContent).not.toMatch(/[–—]/);
  });
  it("links to the studio and invites organisations to get in touch, safely", () => {
    render(<AboutPage />);
    const who = screen.getByRole("heading", { name: /who we are/i }).closest("section")!;
    const site = within(who).getByRole("link", { name: /^ContextJet AI$/ });
    expect(site.getAttribute("href")).toBe("https://contextjetai.com");
    expect(site.getAttribute("rel")).toContain("noopener");
    const mail = within(who).getByRole("link", { name: /takeoff@contextjetai\.services/i });
    expect(mail.getAttribute("href")).toBe("mailto:takeoff@contextjetai.services");
  });
  it("signs the page as a team, without naming individuals", () => {
    render(<AboutPage />);
    expect(screen.getByText(/the ContextJet AI team/i)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/Nishchay|Yashraj/);
  });
  it("footer carries a short credit linking to the studio", () => {
    render(<Footer />);
    const credit = screen.getByRole("link", { name: /ContextJet AI/i });
    expect(credit.getAttribute("href")).toBe("https://contextjetai.com");
    expect(credit.getAttribute("target")).toBe("_blank");
    expect(credit.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText(/made with care by/i)).toBeTruthy();
  });
});
