import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function settled(page: Page) {
  await page.locator("h1, legend, h2").first().waitFor();
  await page.waitForTimeout(350);
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
}

async function completeWizard(page: Page) {
  await page.goto("/start");
  await page.getByLabel("An image").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes").check(); await page.getByText("Next").click();
  await page.getByLabel("TikTok").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes, I took it").check(); await page.getByText("Next").click();
  await page.getByLabel("No").check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page).toHaveURL(/\/plan$/);
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe in ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ["/", "/start", "/platforms/meta", "/resources", "/evidence"]) {
      test(`${path} has no serious or critical violations`, async ({ page }) => {
        await page.goto(path);
        await settled(page);
        const results = await new AxeBuilder({ page }).analyze();
        const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
    test("/plan has no serious or critical violations", async ({ page }) => {
      await completeWizard(page);
      await settled(page);
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  });
}
