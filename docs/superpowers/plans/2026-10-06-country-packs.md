# Country Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give people in the US, India, the UK, Australia, Canada, and the EU the statutory levers that actually force removals: the right letter in the right form, the regulator that acts for them, and a `mailto:` button that sends it from their own address.

**Architecture:** A `regionFor(country)` helper maps a country code to its packs (a country, and `EU` for member states). Each pack contributes resources (existing shape), levers (new `Lever` type rendered as a plan section), and optionally a statutory letter template that replaces the generic platform letter. Platforms gain an optional `abuseEmail` for the `mailto:` button. Every pack carries a `verifiedOn` date shown in the plan.

**Tech Stack:** unchanged.

**Spec:** `docs/superpowers/specs/2026-10-06-roadmap-stress-test.md` section 5 and 3. Depends on the minors-path plan having added `content/resources/{us,gb,in,au,ca}.ts`.

## Global Constraints

- Minor path never gets a copyright letter. Statutory letters are allowed for minors only where the template is safe (TAKE IT DOWN covers minors; the India grievance letter does too; the DSA notice does too). None of them asks for an image.
- No em or en dashes.
- Every URL opened in a browser before commit. Every pack has `verifiedOn: "2026-10-06"` or later.
- Letters never leave the browser except through the person's own mail client.

## Review Focus

1. A person in Germany must get the EU DSA notice and German resources, not just global. Test in Task 1.
2. A person in the US with content posted on X must get the TAKE IT DOWN notice per platform, and the generic platform letter must not also appear (two letters for one platform is confusing). Test in Task 4.
3. A person in Australia must see eSafety as the first reporting step, above platform forms. Test in Task 4.
4. `mailto:` body must be URL-encoded and under 2,000 characters, or the button must say "Copy instead" when longer. Test in Task 5.
5. The country picker must list every country in `regionFor`, and unknown codes must behave as "global". Test in Task 1 and Task 6.

---

### Task 1: Region mapping and types

**Files:**
- Create: `content/regions.ts`
- Modify: `content/types.ts`
- Test: `tests/regions.test.ts`

**Interfaces:**
- Produces:

```ts
export const EU_MEMBERS: string[]; // ISO codes
export function regionFor(country: string | null): string[]; // e.g. "DE" -> ["DE","EU"]; "US" -> ["US"]; null -> []
export interface Lever { region: string; name: string; summary: string; url?: string; letterKind?: LetterKind; deadline?: string; verifiedOn: string }
```

`Resource` gains `verifiedOn?: string`. `Platform` gains `abuseEmail?: string`. `LetterKind` (in `content/letters/index.ts`) gains `"take-it-down-notice" | "india-grievance" | "dsa-notice"`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { regionFor, EU_MEMBERS } from "@/content/regions";
describe("regionFor", () => {
  it("adds EU for member states", () => { expect(regionFor("DE")).toEqual(["DE", "EU"]); expect(regionFor("FR")).toEqual(["FR", "EU"]); });
  it("single region for non-EU", () => { expect(regionFor("US")).toEqual(["US"]); expect(regionFor("IN")).toEqual(["IN"]); });
  it("empty for null or unknown", () => { expect(regionFor(null)).toEqual([]); expect(regionFor("ZZ")).toEqual(["ZZ"]); });
  it("has 27 EU members", () => { expect(EU_MEMBERS.length).toBe(27); });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Implement**

```ts
// content/regions.ts
export const EU_MEMBERS = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"];
export function regionFor(country: string | null): string[] {
  if (!country) return [];
  return EU_MEMBERS.includes(country) ? [country, "EU"] : [country];
}
```

Add to `content/types.ts`:

```ts
import type { LetterKind } from "./letters";
export interface Lever { region: string; name: string; summary: string; url?: string; letterKind?: LetterKind; deadline?: string; verifiedOn: string }
```

and `verifiedOn?: string` on `Resource`, `abuseEmail?: string` on `Platform`. Extend `LetterKind` and `letterTitles` in `content/letters/index.ts` (titles: "TAKE IT DOWN Act removal request", "Grievance complaint under IT Rules 2021", "Illegal content notice under the Digital Services Act"). The templates come in Task 3; export placeholders now as empty strings so types compile, and Task 3 replaces them.

- [ ] **Step 3: Run tests, commit**

```bash
git add content/regions.ts content/types.ts content/letters/index.ts tests/regions.test.ts
git commit -m "feat: add region mapping and lever types"
```

---

### Task 2: Pack content (resources and levers)

**Files:**
- Create: `content/levers/index.ts`, `content/levers/us.ts`, `content/levers/in.ts`, `content/levers/gb.ts`, `content/levers/au.ts`, `content/levers/eu.ts`, `content/levers/ca.ts`, `content/resources/eu.ts`
- Modify: `content/resources/{us,gb,in,au,ca}.ts` (add adult entries), `content/resources/index.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: `leversFor(country: string | null): Lever[]`; `resourcesFor` now uses `regionFor`.

- [ ] **Step 1: Failing tests**

```ts
import { leversFor } from "@/content/levers";
describe("levers", () => {
  it("US has the TAKE IT DOWN lever with a letter", () => { expect(leversFor("US").find((l) => l.letterKind === "take-it-down-notice")).toBeTruthy(); });
  it("IN has the 24-hour grievance lever", () => { const l = leversFor("IN").find((x) => x.letterKind === "india-grievance"); expect(l?.deadline).toMatch(/24 hours/); });
  it("AU has eSafety with no letter", () => { const l = leversFor("AU")[0]; expect(l.name).toMatch(/eSafety/); expect(l.letterKind).toBeUndefined(); });
  it("DE gets the EU DSA lever", () => { expect(leversFor("DE").some((l) => l.letterKind === "dsa-notice")).toBe(true); });
  it("every lever is dated and dash-free", () => {
    for (const c of ["US","IN","GB","AU","CA","DE"]) for (const l of leversFor(c)) { expect(l.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/); expect(JSON.stringify(l)).not.toMatch(/[–—]/); }
  });
});
describe("regional adult resources", () => {
  it("DE adult gets EU and global entries", () => { const r = resourcesFor("DE", false); expect(r.some((x) => x.region === "EU")).toBe(true); expect(r.some((x) => x.region === "global")).toBe(true); });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Lever files**

```ts
// content/levers/us.ts
import type { Lever } from "../types";
export const usLevers: Lever[] = [
  { region: "US", name: "TAKE IT DOWN Act request", summary: "Since 19 May 2026, every platform must remove non-consensual intimate images within 48 hours of a valid written request and make reasonable efforts to remove copies. The FTC fines platforms that do not. The letter below is in the required form.", letterKind: "take-it-down-notice", deadline: "48 hours", verifiedOn: "2026-10-06" },
  { region: "US", name: "State law and civil claims", summary: "Almost every state criminalises this. Cyber Civil Rights Initiative lists each state's law and lawyers who take these cases.", url: "https://cybercivilrights.org/nonconsensual-distribution-of-intimate-images-laws/", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/in.ts
import type { Lever } from "../types";
export const inLevers: Lever[] = [
  { region: "IN", name: "Grievance officer complaint, IT Rules 2021", summary: "Rule 3(2)(b) requires every platform to remove intimate or morphed images within 24 hours of your complaint, acknowledge within 24 hours, and resolve within 72. Every platform must publish its Grievance Officer's email. Send the letter below to that address.", letterKind: "india-grievance", deadline: "24 hours", verifiedOn: "2026-10-06" },
  { region: "IN", name: "National Cyber Crime Reporting Portal", summary: "File at cybercrime.gov.in under Women and Children related crime, or call 1930. Sections 66E and 67 of the IT Act and the Bharatiya Nyaya Sanhita apply.", url: "https://cybercrime.gov.in/", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/gb.ts
import type { Lever } from "../types";
export const gbLevers: Lever[] = [
  { region: "GB", name: "Revenge Porn Helpline", summary: "Run by SWGfL, the charity behind StopNCII. They report content for you and removed 94 percent of 20,800 images in 2025. Start here before anything else.", url: "https://revengepornhelpline.org.uk/", verifiedOn: "2026-10-06" },
  { region: "GB", name: "Report to the police", summary: "Sharing or threatening to share is an offence under section 66B of the Sexual Offences Act 2003 and a priority offence under the Online Safety Act. Report on 101 or online.", url: "https://www.police.uk/pu/contact-us/report-a-crime-incident/", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/au.ts
import type { Lever } from "../types";
export const auLevers: Lever[] = [
  { region: "AU", name: "Report to eSafety", summary: "Australia's regulator takes the report, contacts the platform for you, and can order removal within 24 hours with fines for non-compliance. Someone can report on your behalf. This is faster than reporting to platforms yourself.", url: "https://www.esafety.gov.au/report/image-based-abuse", deadline: "24 hours after a notice", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/eu.ts
import type { Lever } from "../types";
export const euLevers: Lever[] = [
  { region: "EU", name: "Illegal content notice, Digital Services Act", summary: "Article 16 of the DSA obliges every platform serving the EU to provide a notice channel and act on notices without undue delay. The letter below contains the four things Article 16 requires. Send it through the platform's reporting form or to its DSA contact point.", letterKind: "dsa-notice", verifiedOn: "2026-10-06" },
  { region: "EU", name: "Your Digital Services Coordinator", summary: "If a platform ignores a valid notice, complain to the regulator in your country. The Commission lists each one.", url: "https://digital-strategy.ec.europa.eu/en/policies/dsa-dscs", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/ca.ts
import type { Lever } from "../types";
export const caLevers: Lever[] = [
  { region: "CA", name: "Report to the police", summary: "Section 162.1 of the Criminal Code makes sharing an intimate image without consent an offence. Courts can order removal and seizure.", url: "https://www.cybertip.ca/", verifiedOn: "2026-10-06" },
];
```

```ts
// content/levers/index.ts
import type { Lever } from "../types";
import { regionFor } from "../regions";
import { usLevers } from "./us"; import { inLevers } from "./in"; import { gbLevers } from "./gb"; import { auLevers } from "./au"; import { euLevers } from "./eu"; import { caLevers } from "./ca";
const byRegion: Record<string, Lever[]> = { US: usLevers, IN: inLevers, GB: gbLevers, AU: auLevers, EU: euLevers, CA: caLevers };
export function leversFor(country: string | null): Lever[] {
  return regionFor(country).flatMap((r) => byRegion[r] ?? []);
}
```

Add `content/resources/eu.ts` with one entry (region "EU", name "Find a Helpline", kind "crisis", or a better EU-wide line if one is verified) and adult entries to each existing regional file (US: CCRI already global; GB: Revenge Porn Helpline already global, add Victim Support; IN: add a legal-aid entry such as NALSA `https://nalsa.gov.in/`; AU: 1800RESPECT `https://www.1800respect.org.au/`; CA: Cybertip adults flag). Update `resourcesFor`:

```ts
import { regionFor } from "../regions";
export function resourcesFor(country: string | null, forMinor: boolean): Resource[] {
  const regional = regionFor(country).flatMap((r) => byRegion[r] ?? []);
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
```

Open every URL in a browser. Record `verifiedOn` on the day you checked.

- [ ] **Step 3: Run tests, commit**

```bash
git add content tests/content.test.ts
git commit -m "feat: add statutory levers and regional resources for US, IN, GB, AU, CA, EU"
```

---

### Task 3: Statutory letter templates

**Files:**
- Create: `content/letters/take-it-down-notice.md`, `content/letters/india-grievance.md`, `content/letters/dsa-notice.md`
- Modify: `content/letters/index.ts`, `lib/letters.ts`
- Test: `tests/letters.test.ts`

**Interfaces:**
- `LetterVars` gains `name` as effectively required for statutory letters: `renderLetter` substitutes `{{name}}` with the name or "(your full name, required)".

- [ ] **Step 1: Failing tests**

```ts
describe("statutory letters", () => {
  const v = { platform: "X", urls: ["https://x.example/1"], date: "6 October 2026", name: "A. Person", contact: "a@example.com" };
  it("TAKE IT DOWN notice has the four required elements", () => {
    const t = renderLetter("take-it-down-notice", v);
    expect(t).toMatch(/TAKE IT DOWN Act/); expect(t).toContain("https://x.example/1"); expect(t).toContain("a@example.com");
    expect(t).toMatch(/without my consent/i); expect(t).toMatch(/good faith/i); expect(t).toMatch(/Signed: A\. Person/); expect(t).toMatch(/48 hours/);
  });
  it("India grievance cites Rule 3(2)(b) and 24 hours", () => {
    const t = renderLetter("india-grievance", v);
    expect(t).toMatch(/Rule 3\(2\)\(b\)/); expect(t).toMatch(/24 hours/); expect(t).toMatch(/Grievance Officer/);
  });
  it("DSA notice has the Article 16 elements", () => {
    const t = renderLetter("dsa-notice", v);
    expect(t).toMatch(/Article 16/); expect(t).toMatch(/why.*illegal/i); expect(t).toContain("https://x.example/1"); expect(t).toContain("a@example.com"); expect(t).toMatch(/good faith/i);
  });
  it("marks a missing name as required", () => {
    expect(renderLetter("take-it-down-notice", { ...v, name: "" })).toMatch(/\(your full name, required\)/);
  });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Templates**

`take-it-down-notice.md`:

```
Subject: Removal request under the TAKE IT DOWN Act

Date: {{date}}

To {{platform}},

This is a request under the TAKE IT DOWN Act (Public Law 119-12) to remove intimate visual depictions of me that were published without my consent. The Act requires you to remove this content within 48 hours of receiving this request and to make reasonable efforts to remove identical copies.

Identification of the content:
{{urls}}

I am the person depicted. The depiction is intimate and was published without my consent. I make this request in good faith.

Contact: {{contact}}

Signed: {{name}}
```

`india-grievance.md`:

```
Subject: Complaint under Rule 3(2)(b), Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021

Date: {{date}}

To the Grievance Officer, {{platform}},

I am the person shown in the content at the links below. It shows me in a state of nudity or in a sexual act, or is a morphed image of me, and it was published without my consent.

{{urls}}

Under Rule 3(2)(b) you are required to remove or disable access to this content within 24 hours of receiving this complaint, to acknowledge this complaint within 24 hours, and to resolve it within 72 hours. Please confirm removal by email.

Contact: {{contact}}

Signed: {{name}}
```

`dsa-notice.md`:

```
Subject: Notice of illegal content under Article 16 of the Digital Services Act

Date: {{date}}

To {{platform}},

Explanation of why the content is illegal: the content at the links below is intimate imagery of me published without my consent, which is a criminal offence in my country and in most EU member states and violates your terms of service.

Exact location of the content:
{{urls}}

My name and email address: {{name}}, {{contact}}

I confirm in good faith that the information in this notice is accurate and complete.

Please act on this notice without undue delay and inform me of your decision and the redress available.

Signed: {{name}}
```

Wire the three into `letterTemplates` with `?raw` imports. In `lib/letters.ts` add `.replaceAll("{{name}}", vars.name?.trim() || "(your full name, required)")` before the signature replacement.

- [ ] **Step 3: Run tests, commit**

```bash
git add content/letters lib/letters.ts tests/letters.test.ts
git commit -m "feat: add TAKE IT DOWN, India grievance, and DSA notice letters"
```

---

### Task 4: Plan integration

**Files:**
- Modify: `lib/plan.ts`, `components/wizard/plan-view.tsx`
- Test: `tests/plan.test.ts`, `tests/plan-view.test.tsx`

**Interfaces:**
- `Plan` gains `levers: Lever[]` and `regulatorFirst: Lever | null` (set for AU).

- [ ] **Step 1: Failing tests**

```ts
describe("country levers", () => {
  it("US posted content uses the TAKE IT DOWN letter instead of the generic one", () => {
    const p = buildPlan({ ...base, country: "US", platformSlugs: ["x"] });
    expect(p.letters.map((l) => l.kind)).toEqual(["take-it-down-notice"]);
    expect(p.levers.some((l) => /TAKE IT DOWN/.test(l.name))).toBe(true);
  });
  it("IN uses the grievance letter and keeps DMCA when self-taken", () => {
    const p = buildPlan({ ...base, country: "IN", selfTaken: "yes", platformSlugs: ["meta"] });
    expect(p.letters.map((l) => l.kind).sort()).toEqual(["dmca-takedown", "india-grievance"]);
  });
  it("AU puts eSafety first", () => {
    const p = buildPlan({ ...base, country: "AU" });
    expect(p.regulatorFirst?.name).toMatch(/eSafety/);
  });
  it("minor in the US gets the TAKE IT DOWN letter but never DMCA", () => {
    const p = buildPlan({ ...base, country: "US", minor: "yes", selfTaken: "yes" });
    expect(p.letters.every((l) => l.kind !== "dmca-takedown")).toBe(true);
    expect(p.letters.some((l) => l.kind === "take-it-down-notice")).toBe(true);
  });
  it("no country means no levers and the generic letter", () => {
    const p = buildPlan(base);
    expect(p.levers).toEqual([]); expect(p.letters[0].kind).toBe("platform-report");
  });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Implement**

In `lib/plan.ts`:

```ts
import { leversFor } from "@/content/levers";
// inside buildPlan, before letters:
const levers = leversFor(a.country);
const statutory = levers.find((l) => l.letterKind)?.letterKind;
const regulatorFirst = levers.find((l) => l.region === "AU") ?? null;
const platformKind: LetterKind = statutory ?? "platform-report";
// replace "platform-report" with platformKind in both platform and host loops
```

Add `levers` and `regulatorFirst` to the return. In `plan-view.tsx`, render before "Report to platforms":

```tsx
      {plan.regulatorFirst && (
        <Section title="Report to the regulator first">
          <p>{plan.regulatorFirst.summary}</p>
          <a href={plan.regulatorFirst.url} {...ext} className="font-medium text-accent underline">Open {plan.regulatorFirst.name}</a>
        </Section>
      )}
```

and after "Remove from search":

```tsx
      {plan.levers.length > 0 && (
        <Section title="Legal levers where you are">
          {plan.levers.map((l) => (
            <div key={l.name} className="rounded-card border border-border p-5">
              <h3 className="font-semibold">{l.name}</h3>
              <p className="mt-1 text-sm">{l.summary}</p>
              {l.deadline && <p className="mt-2 text-sm text-muted">Deadline for the platform: {l.deadline}</p>}
              {l.url && <a href={l.url} {...ext} className="mt-3 inline-block font-medium text-accent underline">Open</a>}
              <p className="mt-2 text-xs text-muted">Checked {l.verifiedOn}</p>
            </div>
          ))}
        </Section>
      )}
```

Add a plan-view test asserting the "Legal levers where you are" heading renders for `country: "US"`.

- [ ] **Step 3: Run tests, commit**

```bash
git add lib/plan.ts components/wizard/plan-view.tsx tests
git commit -m "feat: route statutory letters and levers by country"
```

---

### Task 5: mailto sending from letter cards

**Files:**
- Create: `lib/mailto.ts`
- Modify: `components/wizard/letter-card.tsx`, `content/platforms/*.ts` (add `abuseEmail` where known), `lib/plan.ts` (`PlanLetter` gains `email?: string`)
- Test: `tests/mailto.test.ts`, `tests/minors.test.tsx` (letter card)

**Interfaces:**
- `buildMailto(to: string, subject: string, body: string): { href: string; tooLong: boolean }`. `tooLong` when the encoded href exceeds 1,900 characters.

- [ ] **Step 1: Failing tests**

```ts
import { buildMailto } from "@/lib/mailto";
describe("buildMailto", () => {
  it("encodes subject and body", () => {
    const m = buildMailto("abuse@example.com", "Hi there", "Line 1\nLine 2 & more");
    expect(m.href).toBe("mailto:abuse@example.com?subject=Hi%20there&body=Line%201%0ALine%202%20%26%20more");
    expect(m.tooLong).toBe(false);
  });
  it("flags long bodies", () => { expect(buildMailto("a@b.c", "s", "x".repeat(3000)).tooLong).toBe(true); });
});
```

And in the letter card test: render `<LetterCard kind="platform-report" platform="Telegram" urls={[]} email="abuse@telegram.org" />` and assert a link with name "Open in your email app" whose href starts with `mailto:abuse@telegram.org`.

- [ ] **Step 2: Implement**

```ts
// lib/mailto.ts
export function buildMailto(to: string, subject: string, body: string) {
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { href, tooLong: href.length > 1900 };
}
```

Known abuse addresses to add: Telegram `abuse@telegram.org`; OnlyFans `support@onlyfans.com`; Pornhub `content@pornhub.com` (verify on their removal page). Leave others undefined; the form link remains primary. In `buildPlan`, set `email: p.abuseEmail` on each platform letter. In `LetterCard`, accept `email?: string`; when present, derive `subject` from the first line of the rendered letter (strip "Subject: "), call `buildMailto`, and render `<a href=... className=...>Open in your email app</a>` or, when `tooLong`, a muted note "Too long for an email link. Copy it instead."

- [ ] **Step 3: Run tests, commit**

```bash
git add lib/mailto.ts components/wizard/letter-card.tsx content/platforms lib/plan.ts tests
git commit -m "feat: open letters in the person's own email app"
```

---

### Task 6: Country picker expansion

**Files:**
- Modify: `components/wizard/country-picker.tsx`
- Test: `tests/wizard.test.tsx`

- [ ] **Step 1: Failing test**

```ts
  it("country picker lists every EU member and groups them", () => {
    render(<Wizard />);
    // walk to the country step as in the finish test, then:
    const select = screen.getByLabelText("Country") as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    for (const c of ["DE", "FR", "IT", "ES", "NL", "PL"]) expect(values).toContain(c);
    expect(values).toContain("NG");
  });
```

- [ ] **Step 2: Implement**

Replace `COUNTRIES` with grouped `<optgroup>`s: "Packs available" (US, GB, IN, AU, CA, then all 27 EU members alphabetically by name) and "Other" (a further 20 high-population countries: NG, PH, BR, MX, ID, PK, BD, ZA, KE, EG, TR, SA, AE, JP, KR, SG, MY, NZ, AR, CO). Use `Intl.DisplayNames` for names with a static fallback map for the test environment.

- [ ] **Step 3: Run all suites, commit**

```bash
npm test && npm run e2e
git add components/wizard/country-picker.tsx tests/wizard.test.tsx
git commit -m "feat: expand country picker with EU members and grouping"
```

## Self-review

Spec coverage: statutory levers (Tasks 2, 3, 4), regulator-first for AU (Task 4), `mailto:` (Task 5), verifiedOn dates (Tasks 2, 4), expanded picker (Task 6). Review Focus 1 to 5 each have a named test. Types: `Lever`, `leversFor`, `regionFor`, `LetterKind` additions, `PlanLetter.email` used consistently. Task 1 exports empty template placeholders that Task 3 replaces, stated explicitly. No TBDs.
