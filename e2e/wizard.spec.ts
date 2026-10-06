import { test, expect } from "@playwright/test";

test("wizard to plan, back preserves answers, quick exit clears", async ({ page }) => {
  await page.goto("/start");
  await page.getByLabel("An image").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes").check(); await page.getByText("Next").click();
  await page.getByLabel("TikTok").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes, I took it").check(); await page.getByText("Next").click();
  await page.getByLabel("No").check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByRole("heading", { name: "TikTok", exact: true })).toBeVisible();
  await expect(page.getByText("Copyright takedown notice")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/start$/);
  await expect(page.getByText("Question 6 of 6")).toBeVisible();

  await page.goto("/plan");
  await page.route("https://www.bbc.com/**", (route) => route.fulfill({ status: 200, body: "<html><body>exit</body></html>" }));
  await page.getByRole("button", { name: /quick exit/i }).click();
  await page.waitForURL(/bbc\.com/);
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/start$/);
});

test("plan with no state redirects", async ({ page }) => {
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/start$/);
});
