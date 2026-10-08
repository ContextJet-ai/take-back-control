import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { Hero } from "@/components/landing/hero";
import { StepsStack } from "@/components/landing/steps-stack";
import { ClosingCta } from "@/components/landing/closing-cta";

beforeAll(() => {
  window.matchMedia = ((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
});

const srcs = (c: HTMLElement) => Array.from(c.querySelectorAll("img")).map((i) => decodeURIComponent(i.getAttribute("src") ?? "") + " " + decodeURIComponent(i.getAttribute("srcset") ?? ""));

describe("hope imagery", () => {
  it("hero shows the dawn photograph, decorative, loaded eagerly", () => {
    const { container } = render(<Hero />);
    const img = container.querySelector("img")!;
    expect(srcs(container)[0]).toContain("hero-dawn.webp");
    expect(img.getAttribute("alt")).toBe("");
    expect(img.getAttribute("loading")).not.toBe("lazy");
  });
  it("each step has its own photograph", () => {
    const { container } = render(<StepsStack />);
    const all = srcs(container).join(" ");
    for (const n of ["step-document", "step-remove", "step-prevent"]) expect(all).toContain(`${n}.webp`);
    expect(container.querySelectorAll("img").length).toBe(3);
  });
  it("closing block has the horizon behind a readable card", () => {
    const { container } = render(<ClosingCta />);
    expect(srcs(container)[0]).toContain("closing-horizon.webp");
    expect(container.querySelector("h2")?.closest("div")?.className).toMatch(/bg-bg\/90/);
  });
});
