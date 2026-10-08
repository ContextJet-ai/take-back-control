import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ResourcesPage from "@/app/resources/page";
import EvidencePage from "@/app/evidence/page";
import AboutPage from "@/app/about/page";
import NotFound from "@/app/not-found";
import { PageBanner } from "@/components/page-banner";

const src = (c: HTMLElement) => decodeURIComponent((c.querySelector("img")?.getAttribute("src") ?? "") + " " + (c.querySelector("img")?.getAttribute("srcset") ?? ""));

describe("page banners", () => {
  it("is decorative by default and does not steal focus", () => {
    const { container } = render(<PageBanner src="/images/generated/lighthouse-dawn.webp" />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("alt")).toBe("");
    expect(container.querySelector("a, button")).toBeNull();
  });
  it("resources shows the lighthouse", () => { expect(src(render(<ResourcesPage />).container)).toContain("lighthouse-dawn.webp"); });
  it("evidence shows the dawn desk", () => { expect(src(render(<EvidencePage />).container)).toContain("desk-window.webp"); });
  it("about shows the sapling", () => { expect(src(render(<AboutPage />).container)).toContain("sapling-light.webp"); });
  it("page not found shows the lantern path and still offers a way back", () => {
    const { container, getByRole } = render(<NotFound />);
    expect(src(container)).toContain("lantern-path.webp");
    expect(getByRole("link", { name: "Start" })).toBeTruthy();
  });
});
