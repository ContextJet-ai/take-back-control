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

test("minor threat-only path shows sextortion steps and no StopNCII", async ({ page }) => {
  await page.goto("/start");
  await page.getByLabel("A threat to share something").check(); await page.getByText("Next").click();
  await page.getByLabel("No, but someone is threatening to").check(); await page.getByText("Next").click();
  await page.getByLabel("No, someone else did").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes", { exact: true }).check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page.getByRole("region", { name: /read this first/i })).toContainText(/do not forward/i);
  await expect(page.getByText(/stop replying/i)).toBeVisible();
  await expect(page.getByText("StopNCII")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Take It Down" })).toBeVisible();
});

async function finishWizard(page: import("@playwright/test").Page) {
  await page.goto("/start");
  await page.getByLabel("An image").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes").check(); await page.getByText("Next").click();
  await page.getByLabel("TikTok").check(); await page.getByText("Next").click();
  await page.getByLabel("No, someone else did").check(); await page.getByText("Next").click();
  await page.getByLabel("No").check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page).toHaveURL(/\/plan$/);
}

test("plan checklist progress survives a reload and quick exit wipes it", async ({ page }) => {
  await finishWizard(page);
  const status = page.getByRole("status").filter({ hasText: /done/ });
  await expect(status).toContainText(/^0 of \d+ done/);
  await page.getByRole("button", { name: /mark as done: step 1/i }).click();
  await expect(status).toContainText(/^1 of \d+ done/);
  await page.reload();
  await expect(status).toContainText(/^1 of \d+ done/);
  await page.getByRole("link", { name: "Letters" }).click();
  await expect(page).toHaveURL(/#sec-letters$/);
  await page.route("https://www.bbc.com/**", (route) => route.fulfill({ status: 200, body: "<html><body>exit</body></html>" }));
  await page.getByRole("button", { name: /quick exit/i }).click();
  await page.waitForURL(/bbc\.com/);
  await page.goto("/");
  expect(await page.evaluate(() => sessionStorage.getItem("plan-progress"))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem("wizard"))).toBeNull();
});

test("Enter advances the wizard from a chosen option", async ({ page }) => {
  await page.goto("/start");
  await page.getByLabel("An image").check();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Has it been posted anywhere?")).toBeVisible();
  await expect(page.getByText(/why we ask this/i)).toBeVisible();
});
