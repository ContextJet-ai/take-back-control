import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Facts } from "@/components/landing/facts";
import { Toolkit } from "@/components/landing/toolkit";
import { Audience } from "@/components/landing/audience";
import { PlatformsCovered } from "@/components/landing/platforms-covered";
import { Faq, FAQ_ITEMS } from "@/components/landing/faq";

describe("landing content", () => {
  it("facts cite a source link for every figure", () => {
    const { container } = render(<Facts />);
    expect(screen.getByText(/94%/)).toBeTruthy();
    expect(screen.getByText(/48 hours/)).toBeTruthy();
    expect(screen.getAllByText(/24 hours/).length).toBeGreaterThanOrEqual(1);
    const figures = container.querySelectorAll("[data-figure]");
    expect(figures.length).toBeGreaterThanOrEqual(3);
    figures.forEach((f) => expect(f.querySelector("a[href^='https://']")).toBeTruthy());
  });
  it("toolkit lists exactly five tools with links into the site", () => {
    const { container } = render(<Toolkit />);
    expect(container.querySelectorAll("[data-tool]").length).toBe(5);
    expect(container.querySelector("a[href='/evidence']")).toBeTruthy();
  });
  it("audience covers adults, under 18, and threats", () => {
    render(<Audience />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings.some((h) => /18 or older/i.test(h ?? ""))).toBe(true);
    expect(headings.some((h) => /under 18/i.test(h ?? ""))).toBe(true);
    expect(headings.some((h) => /threatening/i.test(h ?? ""))).toBe(true);
  });
  it("platform list links every guide", () => {
    const { container } = render(<PlatformsCovered />);
    expect(container.querySelectorAll("a[href^='/platforms/']").length).toBeGreaterThanOrEqual(10);
  });
  it("faq uses native disclosure and answers the privacy question first", () => {
    const { container } = render(<Faq />);
    expect(container.querySelectorAll("details").length).toBe(FAQ_ITEMS.length);
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(6);
    expect(FAQ_ITEMS[0].q).toMatch(/uploaded/i);
  });
  it("contains no em or en dashes", () => {
    const html = [Facts, Toolkit, Audience, PlatformsCovered, Faq].map((C) => render(<C />).container.textContent).join(" ");
    expect(html).not.toMatch(/[–—]/);
  });
});
