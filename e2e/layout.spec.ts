import { test, expect, type Page } from "@playwright/test";

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
}

async function toPlatformsStep(page: Page) {
  await page.goto("/start");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/start");
  await page.getByLabel("An image").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes").check(); await page.getByText("Next").click();
  await expect(page.getByText("Where was it posted?")).toBeVisible();
}

test("plan page has no horizontal scroll at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/start");
  await page.getByLabel("An image").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes").check(); await page.getByText("Next").click();
  await page.getByLabel("Another website").check();
  await page.getByLabel("Paste the link").fill("https://example-with-a-very-long-domain-name-for-testing.com/some/really/long/path/that/keeps/going/and/going?query=1234567890");
  await page.getByText("Next").click();
  await page.getByLabel("Yes, I took it").check(); await page.getByText("Next").click();
  await page.getByLabel("No").check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page).toHaveURL(/\/plan$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test("quick exit never overlaps Back or Next on a long step at 375x667, stuck and unstuck", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await toPlatformsStep(page);
  const exit = page.getByRole("button", { name: /quick exit/i });
  for (const scroll of ["top", "bottom"]) {
    await page.evaluate((s) => window.scrollTo(0, s === "bottom" ? document.body.scrollHeight : 0), scroll);
    await page.waitForTimeout(200);
    const e = (await exit.boundingBox())!;
    const back = (await page.getByRole("button", { name: "Back" }).boundingBox())!;
    const next = (await page.getByRole("button", { name: "Next" }).boundingBox())!;
    expect(overlaps(e, back), `exit overlaps Back at ${scroll}`).toBe(false);
    expect(overlaps(e, next), `exit overlaps Next at ${scroll}`).toBe(false);
  }
});

test("option cards show a visible focus ring from the keyboard", async ({ page }) => {
  await page.goto("/start");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto("/start");
  await page.getByLabel("An image").focus();
  await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab");
  const label = page.locator("label", { has: page.getByLabel("An image") });
  const style = await label.evaluate((el) => { const s = getComputedStyle(el); return { style: s.outlineStyle, width: s.outlineWidth }; });
  expect(style.style).not.toBe("none");
  expect(parseFloat(style.width)).toBeGreaterThan(0);
});

for (const path of ["/", "/start", "/resources", "/evidence", "/about", "/platforms"]) {
  test(`quick exit covers no content on a phone at ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(path);
    await page.waitForTimeout(1500);
    const exit = page.getByRole("button", { name: /quick exit/i });
    await expect(exit).toBeVisible();
    const covered = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => /quick exit/i.test(b.getAttribute("aria-label") ?? b.textContent ?? "") && b.getClientRects().length > 0)!;
      const r = btn.getBoundingClientRect();
      const hits: string[] = [];
      for (const el of document.querySelectorAll("main h1, main h2, main p, main li, main a, main label, main legend, main span")) {
        if (btn.contains(el) || !(el.textContent ?? "").trim() || el.children.length > 2) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const overlap = !(b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom);
        if (overlap) hits.push((el.textContent ?? "").trim().slice(0, 40));
      }
      return hits;
    });
    expect(covered, "text under quick exit").toEqual([]);
  });
}

for (const path of ["/", "/about", "/resources"]) {
  test(`header and footer links are comfortable to tap on a phone at ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("header a, footer a")]
        .map((a) => ({ t: (a.getAttribute("aria-label") ?? a.textContent ?? "").trim().slice(0, 24), h: Math.round(a.getBoundingClientRect().height) }))
        .filter((x) => x.h < 44),
    );
    expect(small, "links under 44px tall").toEqual([]);
  });
}
