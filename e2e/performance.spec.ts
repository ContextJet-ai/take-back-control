import { test, expect } from "@playwright/test";

// Software rendering is what Lighthouse and many low-end phones get, so it is the worst case worth guarding.
test.use({
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 2,
  launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
});

test("home page stays responsive on a slow phone while the hero light runs", async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    const w = window as unknown as { __blocking: number };
    w.__blocking = 0;
    new PerformanceObserver((list) => { for (const e of list.getEntries()) w.__blocking += Math.max(0, e.duration - 50); }).observe({ type: "longtask", buffered: true });
  });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(7000);
  const blocking = await page.evaluate(() => (window as unknown as { __blocking: number }).__blocking);
  console.log("blocking ms:", Math.round(blocking));
  // Measured: the unfixed shader blocked 1435ms on a fast laptop (and far more on a CI runner);
  // the fix blocks about 13ms on the laptop and about 575ms on GitHub's slower shared runners.
  // 900ms passes the fixed code on slow hardware and still fails the original regression.
  expect(blocking).toBeLessThan(900);
});
