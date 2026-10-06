# Minors' Path Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give anyone under 18 (or whose images were taken under 18) a plan that is safe to follow: no copying of the image, a separate sextortion route, Take It Down first, child helplines by country, and a plain warning about the legal trap of forwarding the image.

**Architecture:** `buildPlan` gains two derived flags and a `warnings` list. Minor-specific `rightNow` steps replace the adult ones. Resources gain the first regional files, holding only minor-facing entries (the country-pack plan adds adult entries to the same files later). `PlanView` renders warnings above everything else.

**Tech Stack:** unchanged. Vitest for unit tests, Playwright for one e2e.

**Spec:** `docs/superpowers/specs/2026-10-06-roadmap-stress-test.md` section 8, plus the original design spec.

## Global Constraints

- Minor path never offers `dmca-takedown` and never lists StopNCII.
- No em or en dashes in visible text.
- Nothing stored server-side. No new routes.
- Every new resource URL is opened in a browser before commit.

## Review Focus

1. A minor who selects "threat only" must get the sextortion route (stop responding, do not pay, keep the account, report to CyberTipline), not the posted-content route. Test in Task 2.
2. An adult whose image was taken when under 18 must be routed to Take It Down. The wizard's minor question must say so. Test in Task 3.
3. A minor in a country with no regional file must still get the global child entries. Test in Task 1.
4. The "do not forward" warning must appear even when nothing has been posted yet. Test in Task 2.
5. The plan for a minor must not say "screenshot" in a way that implies saving the image. Test in Task 2.

---

### Task 1: Regional minor resources and child helplines

**Files:**
- Create: `content/resources/us.ts`, `content/resources/gb.ts`, `content/resources/in.ts`, `content/resources/au.ts`, `content/resources/ca.ts`
- Modify: `content/resources/global.ts`, `content/resources/index.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: `byRegion` now maps `US`, `GB`, `IN`, `AU`, `CA`. `resourcesFor("GB", true)` returns global minor entries plus Childline.

- [ ] **Step 1: Failing test**

Append to `tests/content.test.ts`:

```ts
describe("minor resources", () => {
  it("adds a child helpline for known countries", () => {
    const gb = resourcesFor("GB", true);
    expect(gb.some((r) => r.name === "Childline")).toBe(true);
    expect(gb.some((r) => r.name === "Take It Down")).toBe(true);
  });
  it("falls back to global entries for unknown countries", () => {
    const zz = resourcesFor("ZZ", true);
    expect(zz.every((r) => r.region === "global")).toBe(true);
    expect(zz.some((r) => r.name === "NCMEC CyberTipline")).toBe(true);
  });
  it("includes a sextortion resource for minors", () => {
    expect(resourcesFor(null, true).some((r) => /sextortion/i.test(r.description))).toBe(true);
  });
});
```

Run: `npm test`
Expected: FAIL on Childline and sextortion assertions.

- [ ] **Step 2: Regional files**

```ts
// content/resources/gb.ts
import type { Resource } from "../types";
export const gbResources: Resource[] = [
  { region: "GB", name: "Childline", kind: "crisis", url: "https://www.childline.org.uk/", phone: "0800 1111", description: "Free, confidential support for anyone under 19 in the UK, any time.", forMinors: true, forAdults: false },
  { region: "GB", name: "CEOP Safety Centre", kind: "reporting", url: "https://www.ceop.police.uk/Safety-Centre/", description: "Report online sexual abuse or grooming of a child to UK police.", forMinors: true, forAdults: false },
];
```

```ts
// content/resources/us.ts
import type { Resource } from "../types";
export const usResources: Resource[] = [
  { region: "US", name: "Childhelp Hotline", kind: "crisis", url: "https://www.childhelphotline.org/", phone: "1-800-422-4453", description: "24-hour support for children and teens, and for adults worried about a child.", forMinors: true, forAdults: false },
  { region: "US", name: "FBI: sextortion", kind: "reporting", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/sextortion", description: "What to do if someone is threatening you over images. Report at tips.fbi.gov or call 1-800-CALL-FBI.", forMinors: true, forAdults: true },
];
```

```ts
// content/resources/in.ts
import type { Resource } from "../types";
export const inResources: Resource[] = [
  { region: "IN", name: "Childline India", kind: "crisis", url: "https://www.childlineindia.org/", phone: "1098", description: "Free 24-hour helpline for children in distress across India.", forMinors: true, forAdults: false },
  { region: "IN", name: "National Cyber Crime Reporting Portal", kind: "reporting", url: "https://cybercrime.gov.in/", phone: "1930", description: "Report online sexual abuse. Reports about children are prioritised.", forMinors: true, forAdults: true },
];
```

```ts
// content/resources/au.ts
import type { Resource } from "../types";
export const auResources: Resource[] = [
  { region: "AU", name: "Kids Helpline", kind: "crisis", url: "https://kidshelpline.com.au/", phone: "1800 55 1800", description: "Free, private counselling for anyone aged 5 to 25 in Australia.", forMinors: true, forAdults: false },
  { region: "AU", name: "eSafety Commissioner", kind: "reporting", url: "https://www.esafety.gov.au/report/image-based-abuse", description: "Australia's regulator takes image-based abuse reports, contacts the platform, and can order removal within 24 hours. Someone can report for you.", forMinors: true, forAdults: true },
];
```

```ts
// content/resources/ca.ts
import type { Resource } from "../types";
export const caResources: Resource[] = [
  { region: "CA", name: "Kids Help Phone", kind: "crisis", url: "https://kidshelpphone.ca/", phone: "1-800-668-6868", description: "24-hour support for young people across Canada. Text CONNECT to 686868.", forMinors: true, forAdults: false },
  { region: "CA", name: "Cybertip.ca", kind: "reporting", url: "https://www.cybertip.ca/", description: "Canada's tipline for online sexual exploitation of children. Also runs NeedHelpNow.ca for teens.", forMinors: true, forAdults: false },
];
```

Add to `content/resources/global.ts`:

```ts
  { region: "global", name: "NCMEC: Is Your Explicit Content Out There", kind: "reporting", url: "https://www.missingkids.org/gethelpnow/isyourexplicitcontentoutthere", description: "Sextortion help for under 18s: what to do when someone threatens to share your images, and how to get them taken down.", forMinors: true, forAdults: false },
```

Update `content/resources/index.ts`:

```ts
import { usResources } from "./us";
import { gbResources } from "./gb";
import { inResources } from "./in";
import { auResources } from "./au";
import { caResources } from "./ca";
const byRegion: Record<string, Resource[]> = { US: usResources, GB: gbResources, IN: inResources, AU: auResources, CA: caResources };
export function resourcesFor(region: string | null, forMinor: boolean): Resource[] {
  const regional = region && byRegion[region] ? byRegion[region] : [];
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
```

Open each new URL in a browser. Replace any that fails.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add content/resources tests/content.test.ts
git commit -m "feat: add child helplines and sextortion resources by country"
```

---

### Task 2: Minor and sextortion routing in buildPlan

**Files:**
- Modify: `lib/plan.ts`
- Test: `tests/plan.test.ts`

**Interfaces:**
- Produces: `Plan.isSextortion: boolean`, `Plan.warnings: string[]`. `buildPlan` unchanged in signature.

- [ ] **Step 1: Failing tests**

Append to `tests/plan.test.ts`:

```ts
describe("minor path", () => {
  const minor: Answers = { ...base, minor: "yes" };
  it("warns against forwarding the image, even when nothing is posted", () => {
    const p = buildPlan({ ...minor, posted: "threatened", platformSlugs: [] });
    expect(p.warnings.some((w) => /do not forward|do not send/i.test(w))).toBe(true);
  });
  it("routes threat-only minors to the sextortion steps", () => {
    const p = buildPlan({ ...minor, contentType: "threat", posted: "threatened", platformSlugs: [] });
    expect(p.isSextortion).toBe(true);
    expect(p.rightNow.some((s) => /stop replying/i.test(s))).toBe(true);
    expect(p.rightNow.some((s) => /do not delete/i.test(s))).toBe(true);
    expect(p.support.some((r) => /sextortion/i.test(r.description))).toBe(true);
  });
  it("never tells a minor to save or screenshot the image itself", () => {
    const p = buildPlan(minor);
    expect(p.rightNow.join(" ")).not.toMatch(/screenshot(s)? of (every post|the image)/i);
    expect(p.rightNow.some((s) => /write down the link/i.test(s))).toBe(true);
  });
  it("puts Take It Down first and never StopNCII", () => {
    const p = buildPlan(minor);
    expect(p.prevention[0]?.name).toBe("Take It Down");
    expect(JSON.stringify(p)).not.toContain("StopNCII");
  });
  it("adults are not flagged as sextortion unless threat only", () => {
    expect(buildPlan(base).isSextortion).toBe(false);
    expect(buildPlan({ ...base, contentType: "threat", posted: "threatened", platformSlugs: [] }).isSextortion).toBe(true);
  });
});
```

Run: `npm test`
Expected: FAIL, `warnings` undefined.

- [ ] **Step 2: Implement**

In `lib/plan.ts`, add to `Plan`:

```ts
  isSextortion: boolean;
  warnings: string[];
```

Replace the `rightNow` construction with:

```ts
  const isSextortion = a.posted === "threatened";
  const warnings: string[] = [];
  const rightNow: string[] = [];

  if (isMinor) {
    warnings.push("Do not forward, send, or save a copy of the image to anyone, including a parent, teacher, or the police. In most countries that is itself a crime, even when you are the person in it. Show them the account and the message with the image covered, or give them the link.");
    rightNow.push("Write down the link, the account name, and the date for every post or message. Do not screenshot the image itself.");
    if (isSextortion) {
      rightNow.push("Stop replying. Do not pay and do not send anything else. Paying leads to more demands, not fewer.");
      rightNow.push("Do not delete the account or the messages. They are evidence. Block the person after you have the details above.");
    }
    rightNow.push("Tell an adult you trust. You are not in trouble, and this is not your fault.");
  } else {
    rightNow.push(posted
      ? "Take screenshots of every post, including the URL, the account name, and the date. Save them somewhere private."
      : "Take screenshots of the threats, including the account name and the date. Save them somewhere private.");
    rightNow.push("Do not pay, reply, or engage with the person threatening you. It almost always makes it worse.");
  }
```

Remove the old `if (isMinor)` push. Add `isSextortion` and `warnings` to the returned object. Ensure `prevention` ordering puts Take It Down first by sorting: `prevention.sort((x, y) => (x.name === "Take It Down" ? -1 : y.name === "Take It Down" ? 1 : 0))`.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all pass. The existing adult tests must still pass unchanged.

- [ ] **Step 4: Commit**

```bash
git add lib/plan.ts tests/plan.test.ts
git commit -m "feat: separate sextortion route and no-copy warnings for minors"
```

---

### Task 3: Wizard wording and plan rendering

**Files:**
- Modify: `components/wizard/wizard.tsx`, `components/wizard/plan-view.tsx`
- Test: `tests/plan-view.test.tsx`, `tests/wizard.test.tsx`, `e2e/wizard.spec.ts`

- [ ] **Step 1: Failing tests**

Append to `tests/plan-view.test.tsx`:

```ts
  it("renders warnings before everything else for a minor", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "no", minor: "yes", country: null });
    render(<PlanView plan={plan} />);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toMatch(/do not forward/i);
    expect(alert.compareDocumentPosition(screen.getByText("Right now")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
```

Append to `tests/wizard.test.tsx`:

```ts
  it("explains that the minor question covers images taken under 18", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("TikTok")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No, someone else did")); fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/taken when you were under 18/i)).toBeTruthy();
  });
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Implement**

In `wizard.tsx`, the minor question becomes:

```tsx
        <Question title="Is anyone in it under 18?" name="minor" value={answers.minor}
          onChange={(v) => set("minor", v)}
          options={[
            { value: "yes", label: "Yes", hint: "Including you, if it was taken when you were under 18, even if you are an adult now" },
            { value: "no", label: "No" },
          ]} />
```

In `plan-view.tsx`, before the "Right now" section:

```tsx
      {plan.warnings.length > 0 && (
        <div role="alert" className="rounded-card border border-accent bg-surface p-5">
          <h2 className="text-lg font-semibold">Read this first</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">{plan.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      )}
```

- [ ] **Step 3: e2e**

Append to `e2e/wizard.spec.ts`:

```ts
test("minor threat-only path shows sextortion steps and no StopNCII", async ({ page }) => {
  await page.goto("/start");
  await page.getByLabel("A threat to share something").check(); await page.getByText("Next").click();
  await page.getByLabel("No, but someone is threatening to").check(); await page.getByText("Next").click();
  await page.getByLabel("No, someone else did").check(); await page.getByText("Next").click();
  await page.getByLabel("Yes", { exact: true }).check(); await page.getByText("Next").click();
  await page.getByLabel("Prefer not to say").check(); await page.getByText("See my plan").click();
  await expect(page.getByRole("alert")).toContainText(/do not forward/i);
  await expect(page.getByText(/stop replying/i)).toBeVisible();
  await expect(page.getByText("StopNCII")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Take It Down" })).toBeVisible();
});
```

Run: `npm test && npm run e2e`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add components/wizard tests e2e
git commit -m "feat: surface minor warnings first and clarify the under-18 question"
```

## Self-review

Spec coverage: sextortion route (Task 2), forwarding warning (Task 2, 3), Take It Down first and no StopNCII (Task 2), child helplines by country (Task 1), under-18-at-capture wording (Task 3). Review Focus 1 to 5 each have a named test. Types: `Plan.warnings`, `Plan.isSextortion` used identically in Tasks 2 and 3. No placeholders.
