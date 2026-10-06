import { test, expect } from "@playwright/test";
test("evidence log downloads with a file fingerprint", async ({ page }) => {
  await page.goto("/evidence");
  await page.getByLabel("Links, one per line").fill("https://a.example/1");
  await page.getByLabel("Add screenshots or files").setInputFiles({ name: "shot.png", mimeType: "image/png", buffer: Buffer.from("abc") });
  await expect(page.locator("li span", { hasText: /ba7816bf/ })).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download log" }).click();
  const file = await dl;
  const chunks: Buffer[] = [];
  for await (const c of await file.createReadStream()) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString();
  expect(text).toContain("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  expect(text).toContain("https://a.example/1");
});
