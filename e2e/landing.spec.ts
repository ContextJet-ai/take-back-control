import { test, expect } from "@playwright/test";

test("landing with reduced motion uses static fallbacks", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const stack = page.getByTestId("steps-stack");
  await expect(stack).toHaveAttribute("data-ready", "true");
  await expect(stack).toHaveAttribute("data-reduced", "true");
  await page.getByText("How fingerprinting protects you").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(page.getByTestId("hash-static")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await ctx.close();
});

test("landing without reduced motion enables the animated path", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto("/");
  const stack = page.getByTestId("steps-stack");
  await expect(stack).toHaveAttribute("data-ready", "true");
  await expect(stack).toHaveAttribute("data-reduced", "false");
  await ctx.close();
});

test("landing has one-line nav and visible start CTA", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const nav = page.locator("header nav");
  const box = await nav.boundingBox();
  expect(box!.height).toBeLessThanOrEqual(80);
  await expect(page.getByRole("link", { name: "Start" }).first()).toBeInViewport();
});

test("stacked step cards stay opaque while they slide over each other", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("/");
  const stack = page.getByTestId("steps-stack");
  await expect(stack).toHaveAttribute("data-reduced", "false");
  await stack.scrollIntoViewIfNeeded();
  for (const step of [0.6, 1.1, 1.5, 2.1]) {
    await page.evaluate((s) => window.scrollTo(0, document.querySelector("[data-testid=steps-stack]")!.getBoundingClientRect().top + window.scrollY + window.innerHeight * s), step);
    await page.waitForTimeout(350);
    const opacities = await page.evaluate(() => [...document.querySelectorAll(".stack-card")].map((c) => getComputedStyle(c).opacity));
    expect(opacities, `at ${step} viewports`).toEqual(["1", "1", "1"]);
  }
  await ctx.close();
});
