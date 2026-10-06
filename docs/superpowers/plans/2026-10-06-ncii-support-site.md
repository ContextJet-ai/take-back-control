# NCII Support and Takedown Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static Next.js site that walks a person whose intimate images were shared without consent through a six-question wizard, generates a tailored action plan with platform report links and prefilled takedown letters, and hands off prevention to StopNCII or Take It Down.

**Architecture:** Next.js App Router with every page statically generated. The wizard and plan are client-side only; state lives in React and `sessionStorage`, never on a server or in a URL. Content (platforms, resources, letter templates) is typed data under `content/`. Plan generation and letter rendering are pure functions in `lib/` with unit tests. Motion and 3D live in isolated `'use client'` leaves used only on the landing page.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v4, Motion (`motion/react`), GSAP ScrollTrigger, Three.js, Phosphor icons, Geist via `next/font`, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-06-ncii-support-site-design.md`

## Global Constraints

- No accounts, no database, no API routes, no analytics, no third-party scripts. Fonts self-hosted through `next/font`.
- Wizard answers never appear in a URL. `/plan` reads from memory or `sessionStorage` and redirects to `/start` when empty.
- Zero em-dashes (`—`) or en-dashes (`–`) in any visible text. Use a hyphen or restructure.
- One accent colour (deep teal) used identically everywhere. Light and dark follow system preference. No pure `#000` or `#fff`.
- Radius: 12px containers and inputs, pill buttons. Icons: Phosphor only, `weight="regular"`.
- Every animation honours `prefers-reduced-motion`. GSAP and Three.js never share a component tree with Motion. `window.addEventListener('scroll')` is banned.
- Motion and 3D appear only on `/`. Wizard and plan use an opacity fade only.
- Every page shows the quick-exit button and a one-line "nothing you enter is uploaded" statement.
- `/plan` is `noindex`.
- Security headers: CSP (self plus `'unsafe-inline'` for styles), `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- Minor path never offers the copyright letter.

## Review Focus

1. **Pressing the browser back button on `/plan`** should return to the last wizard question with answers intact, not to an empty wizard. Test added to Task 10 (Playwright).
2. **Selecting "another website" with an empty URL field** should block progression with an inline error, not produce a plan with a blank host letter. Test added to Task 7.
3. **Choosing "threat only" (nothing posted)** must skip the platform question and still produce a plan with evidence steps, StopNCII hand-off, and support. Test added to Task 4.
4. **Session storage throwing** (Safari private mode, blocked storage) must not crash the wizard; the state falls back to memory. Test added to Task 5.
5. **Reduced motion on the landing page** must render the sticky-stack as plain stacked sections and the 3D leaf as a static image with no WebGL context created. Test added to Task 10 (Playwright with `reducedMotion: 'reduce'`).

---

## File Structure

```
app/
  layout.tsx                 root layout: fonts, theme, nav, footer, quick exit
  page.tsx                   landing page, composes components/landing/*
  globals.css                Tailwind import, design tokens
  start/page.tsx             wizard
  plan/page.tsx              plan renderer (client)
  platforms/page.tsx         platform index
  platforms/[slug]/page.tsx  per-platform guide
  resources/page.tsx
  about/page.tsx
  privacy/page.tsx
  not-found.tsx
components/
  nav.tsx
  footer.tsx
  quick-exit.tsx             client
  button.tsx
  no-upload-notice.tsx
components/landing/
  hero.tsx
  steps-stack.tsx            client, GSAP sticky stack
  hash-visual.tsx            client, lazy Three.js leaf
  hash-visual-static.tsx     static fallback image
  resources-reveal.tsx       client, Motion whileInView
  closing-cta.tsx
components/wizard/
  wizard.tsx                 client, owns state and step routing
  question.tsx               single-choice question
  platform-picker.tsx        multi-select plus other URL
  country-picker.tsx
  progress.tsx
  plan-view.tsx              renders a Plan
  letter-card.tsx            copy and download
content/
  types.ts
  platforms/index.ts         exports all platforms
  platforms/*.ts
  resources/global.ts
  resources/index.ts
  letters/platform-report.md
  letters/dmca-takedown.md
  letters/host-abuse.md
  letters/index.ts           imports .md as raw strings
lib/
  plan.ts                    buildPlan
  letters.ts                 renderLetter
  wizard-state.ts            save/load/clear
  motion-capable.ts          device heuristics for 3D
tests/
  plan.test.ts
  letters.test.ts
  wizard-state.test.ts
e2e/
  wizard.spec.ts
  landing.spec.ts
next.config.ts               headers
vitest.config.ts
playwright.config.ts
```

---

### Task 1: Project scaffold, tokens, headers, test runners

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (placeholder), `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `tests/smoke.test.ts`

**Interfaces:**
- Produces: CSS custom properties `--bg`, `--fg`, `--muted`, `--accent`, `--accent-fg`, `--surface`, `--border` available to every component; `npm test`, `npm run e2e`, `npm run dev`, `npm run build`.

- [ ] **Step 1: Initialise repo and Next.js**

```bash
cd "/Users/nishchaymahor/Documents/Work/misc/Working/idea 1"
git init
npx --yes create-next-app@15 . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm --yes
```

If `create-next-app` refuses because the directory is non-empty (the `docs/` folder), run it in a temp dir and move the generated files in:

```bash
npx --yes create-next-app@15 /tmp/ncii-scaffold --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm --yes
cp -R /tmp/ncii-scaffold/. "/Users/nishchaymahor/Documents/Work/misc/Working/idea 1/"
```

- [ ] **Step 2: Install dependencies**

```bash
npm install motion gsap three @phosphor-icons/react geist
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/dom jsdom @playwright/test @types/three
npx playwright install chromium
```

- [ ] **Step 3: Replace `app/globals.css` with tokens**

```css
@import "tailwindcss";

:root {
  --bg: #f7f7f5;
  --fg: #16181a;
  --muted: #5d6368;
  --surface: #ffffffcc;
  --border: #d9dcdd;
  --accent: #1f6f6b;
  --accent-fg: #f4fbfa;
  --radius: 12px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1113;
    --fg: #ecedee;
    --muted: #9aa1a6;
    --surface: #181b1ecc;
    --border: #2a2f33;
    --accent: #3fa39d;
    --accent-fg: #07201e;
  }
}

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);
  --radius-card: var(--radius);
  --font-sans: var(--font-geist-sans);
}

html { background: var(--bg); color: var(--fg); }
body { font-family: var(--font-sans), system-ui, sans-serif; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 4: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Take Back Control",
  description: "Step-by-step help to get intimate images removed and stop them spreading. Nothing you enter is uploaded.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-[100dvh] antialiased">{children}</body>
    </html>
  );
}
```

Nav, footer and quick exit are added in Task 6.

- [ ] **Step 5: Write `next.config.ts` with security headers**

```ts
import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({ test: /\.md$/, type: "asset/source" });
    return config;
  },
};

export default nextConfig;
```

Note: `'unsafe-inline'` for scripts is needed by Next's hydration scripts in static export. Tightening with nonces is deferred.

- [ ] **Step 6: Write `vitest.config.ts` and `playwright.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { environment: "jsdom", include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  assetsInclude: ["**/*.md"],
});
```

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: { command: "npm run build && npm run start", port: 3000, reuseExistingServer: true, timeout: 180_000 },
});
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"e2e": "playwright test"
```

- [ ] **Step 7: Add a `.md` module declaration**

Create `types/md.d.ts`:

```ts
declare module "*.md" { const content: string; export default content; }
```

Add `"types/**/*.d.ts"` to `tsconfig.json` `include`.

- [ ] **Step 8: Smoke test**

Create `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";
describe("runner", () => { it("works", () => { expect(1 + 1).toBe(2); }); });
```

Run: `npm test`
Expected: 1 passed.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js site with tokens, security headers, and test runners"
```

---

### Task 2: Content types, platforms, resources

**Files:**
- Create: `content/types.ts`, `content/platforms/index.ts`, `content/platforms/meta.ts` (and one file per platform), `content/resources/global.ts`, `content/resources/index.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: `Platform`, `Resource`, `ContentType`, `ResourceKind` types; `platforms: Platform[]`, `getPlatform(slug): Platform | undefined`; `resourcesFor(region: string | null, forMinor: boolean): Resource[]`.

- [ ] **Step 1: Write `content/types.ts`**

```ts
export type ContentType = "image" | "video" | "threat";
export type ResourceKind = "crisis" | "legal" | "reporting" | "prevention";

export interface Platform {
  slug: string;
  name: string;
  contentTypes: ContentType[];
  reportUrl: string;
  steps: string[];
  acceptsStopNCIIHashes: boolean;
  expectedResponse: string;
  escalation: string;
  notes?: string;
}

export interface Resource {
  region: string; // ISO 3166-1 alpha-2 or "global"
  name: string;
  kind: ResourceKind;
  url: string;
  phone?: string;
  description: string;
  forMinors: boolean;
}
```

- [ ] **Step 2: Write the failing content test**

`tests/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { platforms, getPlatform } from "@/content/platforms";
import { resourcesFor } from "@/content/resources";

describe("platform content", () => {
  it("has unique slugs and required fields", () => {
    const slugs = platforms.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of platforms) {
      expect(p.reportUrl).toMatch(/^https:\/\//);
      expect(p.steps.length).toBeGreaterThan(0);
      expect(p.escalation.length).toBeGreaterThan(0);
    }
  });
  it("includes the generic other-website entry", () => {
    expect(getPlatform("other")?.name).toBe("Another website");
  });
  it("contains no em or en dashes", () => {
    const text = JSON.stringify(platforms);
    expect(text).not.toMatch(/[–—]/);
  });
});

describe("resources", () => {
  it("returns global resources when region is null", () => {
    const r = resourcesFor(null, false);
    expect(r.some((x) => x.name === "StopNCII")).toBe(true);
    expect(r.every((x) => x.region === "global")).toBe(true);
  });
  it("hides adult-only entries and shows minor entries for minors", () => {
    const r = resourcesFor(null, true);
    expect(r.some((x) => x.name === "Take It Down")).toBe(true);
    expect(r.some((x) => x.name === "StopNCII")).toBe(false);
  });
});
```

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write platform files**

`content/platforms/meta.ts`:

```ts
import type { Platform } from "../types";
export const meta: Platform = {
  slug: "meta",
  name: "Facebook and Instagram",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://www.facebook.com/help/contact/567360146613371",
  steps: [
    "Open the form linked above. You do not need a Facebook account.",
    "Choose that the image or video shows you and was shared without your permission.",
    "Paste the link to each post. Copy links from the post's menu, not the address bar of the app.",
    "Submit. You will get a case email. Keep it.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 24 to 48 hours.",
  escalation: "If nothing happens in 72 hours, reply to the case email, and report through StopNCII so uploads are blocked in future.",
};
```

Write the remaining files with the same shape. Required slugs and names:

| slug | name | reportUrl | acceptsStopNCIIHashes |
|---|---|---|---|
| tiktok | TikTok | https://www.tiktok.com/legal/report/privacy | true |
| snapchat | Snapchat | https://help.snapchat.com/hc/en-us/requests/new?co=true&ticket_form_id=149423 | true |
| x | X | https://help.x.com/en/forms/safety-and-sensitive-content/private-information | false |
| reddit | Reddit | https://www.reddit.com/report?reason=non-consensual-intimate-media | true |
| discord | Discord | https://dis.gd/report | false |
| telegram | Telegram | https://telegram.org/support | false |
| youtube | YouTube | https://support.google.com/youtube/answer/2802268 | false |
| pornhub | Pornhub | https://www.pornhub.com/content-removal | true |
| onlyfans | OnlyFans | https://onlyfans.com/contact | true |
| google-search | Google Search | https://support.google.com/websearch/troubleshooter/3111061 | false |
| bing-search | Bing Search | https://www.bing.com/webmaster/tools/eu-privacy-request | false |
| other | Another website | https://lookup.icann.org/ | false |

For `other`, steps explain: find the site's abuse email in its terms or privacy page; if absent, look up the domain at the linked ICANN page and use the registrar or hosting abuse contact; send the host abuse letter from the plan.

Each `steps` array needs at least three concrete steps. Each `escalation` names a next action. Check every URL by opening it in a browser before committing; replace any that redirect to a generic help home with the closest working page and note it in `notes`.

- [ ] **Step 4: Write `content/platforms/index.ts`**

```ts
import type { Platform } from "../types";
import { meta } from "./meta";
import { tiktok } from "./tiktok";
import { snapchat } from "./snapchat";
import { x } from "./x";
import { reddit } from "./reddit";
import { discord } from "./discord";
import { telegram } from "./telegram";
import { youtube } from "./youtube";
import { pornhub } from "./pornhub";
import { onlyfans } from "./onlyfans";
import { googleSearch } from "./google-search";
import { bingSearch } from "./bing-search";
import { other } from "./other";

export const platforms: Platform[] = [meta, tiktok, snapchat, x, reddit, discord, telegram, youtube, pornhub, onlyfans, googleSearch, bingSearch, other];
export const selectablePlatforms = platforms.filter((p) => !["google-search", "bing-search"].includes(p.slug));
export const searchEngines = platforms.filter((p) => ["google-search", "bing-search"].includes(p.slug));
export function getPlatform(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
```

- [ ] **Step 5: Write `content/resources/global.ts` and `index.ts`**

```ts
// content/resources/global.ts
import type { Resource } from "../types";
export const globalResources: Resource[] = [
  { region: "global", name: "StopNCII", kind: "prevention", url: "https://stopncii.org/", description: "Creates a fingerprint of your images on your own device so partner platforms can block them. Adults only.", forMinors: false },
  { region: "global", name: "Take It Down", kind: "prevention", url: "https://takeitdown.ncmec.org/", description: "Run by NCMEC. Fingerprints images of anyone under 18 so platforms can remove and block them.", forMinors: true },
  { region: "global", name: "NCMEC CyberTipline", kind: "reporting", url: "https://report.cybertip.org/", description: "Report sexual images of anyone under 18. Reports reach law enforcement worldwide.", forMinors: true },
  { region: "global", name: "Cyber Civil Rights Initiative", kind: "crisis", url: "https://cybercivilrights.org/ccri-safety-center/", phone: "+1 844 878 2274", description: "Image-based abuse helpline and safety guides.", forMinors: false },
  { region: "global", name: "Revenge Porn Helpline", kind: "crisis", url: "https://revengepornhelpline.org.uk/", description: "UK-based helpline that also answers international queries by email.", forMinors: false },
  { region: "global", name: "Find a Helpline", kind: "crisis", url: "https://findahelpline.com/", description: "Free, confidential crisis lines by country.", forMinors: true },
];
```

Set `forMinors: true` on entries that apply to both groups (CyberTipline, Take It Down, Find a Helpline). `resourcesFor` returns, for minors, entries with `forMinors: true`; for adults, entries with `forMinors: false` plus Find a Helpline. Implement with an explicit `forAdults` field rather than inference:

Update `Resource` in `content/types.ts` to add `forAdults: boolean;` and set it on every entry (`StopNCII` true, `Take It Down` false, `CyberTipline` false, `CCRI` true, `Revenge Porn Helpline` true, `Find a Helpline` true).

```ts
// content/resources/index.ts
import type { Resource } from "../types";
import { globalResources } from "./global";

const byRegion: Record<string, Resource[]> = { global: globalResources };

export function resourcesFor(region: string | null, forMinor: boolean): Resource[] {
  const regional = region && byRegion[region] ? byRegion[region] : [];
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
```

Update the test's second case to expect `StopNCII` absent for minors (already written that way) and add an adult case asserting `Take It Down` is absent.

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add content tests/content.test.ts
git commit -m "feat: add platform and resource content with types"
```

---

### Task 3: Letter templates and renderer

**Files:**
- Create: `content/letters/platform-report.md`, `content/letters/dmca-takedown.md`, `content/letters/host-abuse.md`, `content/letters/index.ts`, `lib/letters.ts`
- Test: `tests/letters.test.ts`

**Interfaces:**
- Produces: `type LetterKind = "platform-report" | "dmca-takedown" | "host-abuse"`; `renderLetter(kind: LetterKind, vars: LetterVars): string` where `LetterVars = { platform: string; urls: string[]; date: string; name?: string }`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { renderLetter } from "@/lib/letters";

const vars = { platform: "TikTok", urls: ["https://example.com/a", "https://example.com/b"], date: "6 October 2026", name: "" };

describe("renderLetter", () => {
  it("substitutes placeholders and lists urls one per line", () => {
    const out = renderLetter("platform-report", vars);
    expect(out).toContain("TikTok");
    expect(out).toContain("6 October 2026");
    expect(out).toContain("https://example.com/a\nhttps://example.com/b");
    expect(out).not.toMatch(/\{\{/);
  });
  it("omits the signature line when name is empty", () => {
    const out = renderLetter("platform-report", vars);
    expect(out.trim().endsWith("Thank you.")).toBe(true);
  });
  it("includes the name when provided", () => {
    const out = renderLetter("dmca-takedown", { ...vars, name: "A. Person" });
    expect(out).toContain("A. Person");
  });
  it("contains no em or en dashes", () => {
    for (const kind of ["platform-report", "dmca-takedown", "host-abuse"] as const) {
      expect(renderLetter(kind, vars)).not.toMatch(/[–—]/);
    }
  });
});
```

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 2: Write the templates**

`content/letters/platform-report.md`:

```
Subject: Non-consensual intimate image removal request

Date: {{date}}

To the {{platform}} safety team,

I am the person shown in the content at the links below. It is intimate content and it was shared without my consent. I am asking you to remove it under your policy on non-consensual intimate imagery and to prevent it from being re-uploaded.

{{urls}}

Please confirm by email when it has been removed. I have kept copies of the posts and links as evidence.

Thank you.
{{signature}}
```

`content/letters/dmca-takedown.md`:

```
Subject: DMCA takedown notice

Date: {{date}}

To the designated agent for {{platform}},

I am the copyright owner of the photographs and videos at the links below. I created them and I have not licensed or authorised their publication.

{{urls}}

I have a good faith belief that this use is not authorised by me, my agent, or the law. The information in this notice is accurate, and under penalty of perjury I am the owner of the exclusive right that is being infringed.

Please remove or disable access to this content promptly and confirm by email.

Thank you.
{{signature}}
```

`content/letters/host-abuse.md`:

```
Subject: Abuse report: non-consensual intimate imagery hosted on your service

Date: {{date}}

To the abuse team at {{platform}},

Your service hosts intimate images or videos of me that were published without my consent. This violates your acceptable use policy and, in many countries, the law.

{{urls}}

Please remove this content and tell me when it is done. If you are not the correct contact, please forward this to the responsible party and let me know.

Thank you.
{{signature}}
```

- [ ] **Step 3: Write `content/letters/index.ts` and `lib/letters.ts`**

```ts
// content/letters/index.ts
import platformReport from "./platform-report.md";
import dmcaTakedown from "./dmca-takedown.md";
import hostAbuse from "./host-abuse.md";

export type LetterKind = "platform-report" | "dmca-takedown" | "host-abuse";
export const letterTemplates: Record<LetterKind, string> = {
  "platform-report": platformReport,
  "dmca-takedown": dmcaTakedown,
  "host-abuse": hostAbuse,
};
export const letterTitles: Record<LetterKind, string> = {
  "platform-report": "Removal request",
  "dmca-takedown": "Copyright takedown notice",
  "host-abuse": "Hosting provider abuse report",
};
```

```ts
// lib/letters.ts
import { letterTemplates, type LetterKind } from "@/content/letters";

export interface LetterVars { platform: string; urls: string[]; date: string; name?: string }

export function renderLetter(kind: LetterKind, vars: LetterVars): string {
  const signature = vars.name?.trim() ? `\n${vars.name.trim()}` : "";
  return letterTemplates[kind]
    .replaceAll("{{platform}}", vars.platform)
    .replaceAll("{{date}}", vars.date)
    .replaceAll("{{urls}}", vars.urls.join("\n"))
    .replaceAll("{{signature}}", signature)
    .trimEnd();
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass. If Vitest cannot import `.md`, confirm `assetsInclude: ["**/*.md"]` is in `vitest.config.ts` and that the import uses `?raw` in Vitest only. Simplest fix if needed: change all three imports to `./platform-report.md?raw` and the webpack rule to `test: /\.md$/, resourceQuery: /raw/`.

- [ ] **Step 5: Commit**

```bash
git add content/letters lib/letters.ts tests/letters.test.ts
git commit -m "feat: add letter templates and renderer"
```

---

### Task 4: Plan generation

**Files:**
- Create: `lib/plan.ts`
- Test: `tests/plan.test.ts`

**Interfaces:**
- Consumes: `platforms`, `getPlatform`, `searchEngines` from `@/content/platforms`; `resourcesFor` from `@/content/resources`; `LetterKind` from `@/content/letters`.
- Produces:

```ts
export interface Answers {
  contentType: "image" | "video" | "threat";
  posted: "yes" | "threatened" | "unsure";
  platformSlugs: string[];
  otherUrl: string;
  selfTaken: "yes" | "no" | "unsure";
  minor: "yes" | "no";
  country: string | null;
}
export interface PlanLetter { kind: LetterKind; platform: string; urls: string[] }
export interface Plan {
  isMinor: boolean;
  rightNow: string[];
  platforms: Platform[];
  otherUrl: string | null;
  searchEngines: Platform[];
  prevention: Resource[];
  letters: PlanLetter[];
  support: Resource[];
}
export function buildPlan(a: Answers): Plan;
```

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { buildPlan, type Answers } from "@/lib/plan";

const base: Answers = { contentType: "image", posted: "yes", platformSlugs: ["meta", "tiktok"], otherUrl: "", selfTaken: "no", minor: "no", country: null };

describe("buildPlan", () => {
  it("adult, posted on two platforms", () => {
    const p = buildPlan(base);
    expect(p.isMinor).toBe(false);
    expect(p.platforms.map((x) => x.slug)).toEqual(["meta", "tiktok"]);
    expect(p.searchEngines.length).toBe(2);
    expect(p.prevention.map((r) => r.name)).toEqual(["StopNCII"]);
    expect(p.letters.map((l) => l.kind)).toEqual(["platform-report", "platform-report"]);
    expect(p.rightNow[0]).toMatch(/screenshot/i);
  });
  it("threat only skips platforms and search but keeps prevention and support", () => {
    const p = buildPlan({ ...base, contentType: "threat", posted: "threatened", platformSlugs: [] });
    expect(p.platforms).toEqual([]);
    expect(p.searchEngines).toEqual([]);
    expect(p.letters).toEqual([]);
    expect(p.prevention.map((r) => r.name)).toEqual(["StopNCII"]);
    expect(p.support.length).toBeGreaterThan(0);
    expect(p.rightNow.some((s) => /do not (pay|reply|engage)/i.test(s))).toBe(true);
  });
  it("minor routes to Take It Down and never offers the copyright letter", () => {
    const p = buildPlan({ ...base, minor: "yes", selfTaken: "yes" });
    expect(p.isMinor).toBe(true);
    expect(p.prevention.map((r) => r.name)).toEqual(["Take It Down"]);
    expect(p.letters.every((l) => l.kind !== "dmca-takedown")).toBe(true);
    expect(p.support.some((r) => r.name === "NCMEC CyberTipline")).toBe(true);
  });
  it("self-taken adult image adds a copyright letter per platform", () => {
    const p = buildPlan({ ...base, selfTaken: "yes" });
    expect(p.letters.filter((l) => l.kind === "dmca-takedown").length).toBe(2);
  });
  it("another website produces a host abuse letter with the url", () => {
    const p = buildPlan({ ...base, platformSlugs: ["other"], otherUrl: "https://bad.example/x" });
    expect(p.otherUrl).toBe("https://bad.example/x");
    const host = p.letters.find((l) => l.kind === "host-abuse");
    expect(host?.urls).toEqual(["https://bad.example/x"]);
  });
  it("unknown slugs are ignored", () => {
    const p = buildPlan({ ...base, platformSlugs: ["meta", "nope"] });
    expect(p.platforms.map((x) => x.slug)).toEqual(["meta"]);
  });
});
```

Run: `npm test`
Expected: FAIL, module not found.

- [ ] **Step 2: Implement `lib/plan.ts`**

```ts
import { getPlatform, searchEngines as allSearchEngines } from "@/content/platforms";
import { resourcesFor } from "@/content/resources";
import type { Platform, Resource } from "@/content/types";
import type { LetterKind } from "@/content/letters";

export interface Answers {
  contentType: "image" | "video" | "threat";
  posted: "yes" | "threatened" | "unsure";
  platformSlugs: string[];
  otherUrl: string;
  selfTaken: "yes" | "no" | "unsure";
  minor: "yes" | "no";
  country: string | null;
}

export interface PlanLetter { kind: LetterKind; platform: string; urls: string[] }

export interface Plan {
  isMinor: boolean;
  rightNow: string[];
  platforms: Platform[];
  otherUrl: string | null;
  searchEngines: Platform[];
  prevention: Resource[];
  letters: PlanLetter[];
  support: Resource[];
}

export function buildPlan(a: Answers): Plan {
  const isMinor = a.minor === "yes";
  const posted = a.posted === "yes" || a.posted === "unsure";

  const rightNow: string[] = [];
  if (posted) {
    rightNow.push("Take screenshots of every post, including the URL, the account name, and the date. Save them somewhere private.");
  } else {
    rightNow.push("Take screenshots of the threats, including the account name and the date. Save them somewhere private.");
  }
  rightNow.push("Do not pay, reply, or engage with the person threatening you. It almost always makes it worse.");
  if (isMinor) {
    rightNow.push("If you can, tell a trusted adult. You are not in trouble, and this is not your fault.");
  }

  const platforms = posted
    ? a.platformSlugs.map(getPlatform).filter((p): p is Platform => Boolean(p) && p!.slug !== "other")
    : [];
  const hasOther = posted && a.platformSlugs.includes("other") && a.otherUrl.trim().length > 0;
  const otherUrl = hasOther ? a.otherUrl.trim() : null;

  const all = resourcesFor(a.country, isMinor);
  const prevention = all.filter((r) => r.kind === "prevention");
  const support = all.filter((r) => r.kind !== "prevention");

  const letters: PlanLetter[] = [];
  for (const p of platforms) {
    letters.push({ kind: "platform-report", platform: p.name, urls: [] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: p.name, urls: [] });
  }
  if (otherUrl) {
    letters.push({ kind: "host-abuse", platform: "the hosting provider", urls: [otherUrl] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: "the hosting provider", urls: [otherUrl] });
  }

  return {
    isMinor,
    rightNow,
    platforms,
    otherUrl,
    searchEngines: posted ? allSearchEngines : [],
    prevention,
    letters,
    support,
  };
}
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add lib/plan.ts tests/plan.test.ts
git commit -m "feat: add pure plan generation from wizard answers"
```

---

### Task 5: Wizard state persistence

**Files:**
- Create: `lib/wizard-state.ts`
- Test: `tests/wizard-state.test.ts`

**Interfaces:**
- Consumes: `Answers` from `@/lib/plan`.
- Produces: `interface WizardState { step: number; answers: Partial<Answers> }`; `loadState(): WizardState | null`; `saveState(s: WizardState): void`; `clearState(): void`; `emptyAnswers: Partial<Answers>`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadState, saveState, clearState } from "@/lib/wizard-state";

describe("wizard state", () => {
  beforeEach(() => { sessionStorage.clear(); });

  it("round-trips state", () => {
    saveState({ step: 2, answers: { contentType: "image" } });
    expect(loadState()).toEqual({ step: 2, answers: { contentType: "image" } });
  });
  it("returns null when nothing is saved", () => {
    expect(loadState()).toBeNull();
  });
  it("clears state", () => {
    saveState({ step: 1, answers: {} });
    clearState();
    expect(loadState()).toBeNull();
  });
  it("falls back to memory when storage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => saveState({ step: 3, answers: { minor: "no" } })).not.toThrow();
    expect(loadState()).toEqual({ step: 3, answers: { minor: "no" } });
    spy.mockRestore(); get.mockRestore();
  });
  it("ignores corrupt stored json", () => {
    sessionStorage.setItem("wizard", "{not json");
    expect(loadState()).toBeNull();
  });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Implement**

```ts
import type { Answers } from "@/lib/plan";

export interface WizardState { step: number; answers: Partial<Answers> }
const KEY = "wizard";
let memory: WizardState | null = null;

export const emptyAnswers: Partial<Answers> = { platformSlugs: [], otherUrl: "", country: null };

export function saveState(s: WizardState): void {
  memory = s;
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked; memory copy is enough */ }
}

export function loadState(): WizardState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WizardState;
      if (typeof parsed.step === "number" && parsed.answers) return parsed;
    }
  } catch { /* fall through to memory */ }
  return memory;
}

export function clearState(): void {
  memory = null;
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
```

Note: the "corrupt json" test must also clear `memory`; add `clearState()` to `beforeEach`.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add lib/wizard-state.ts tests/wizard-state.test.ts
git commit -m "feat: add session-backed wizard state with memory fallback"
```

---

### Task 6: Shared shell: nav, footer, quick exit, button

**Files:**
- Create: `components/button.tsx`, `components/nav.tsx`, `components/footer.tsx`, `components/quick-exit.tsx`, `components/no-upload-notice.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `clearState` from `@/lib/wizard-state`.
- Produces: `<Button href? onClick? variant="primary"|"secondary">`, `<QuickExit />`, `<NoUploadNotice />`.

- [ ] **Step 1: Button**

```tsx
// components/button.tsx
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap";
const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  secondary: "border border-border text-fg hover:bg-surface",
};

export function Button({ href, variant = "primary", className = "", ...rest }: { href?: string; variant?: Variant } & ComponentProps<"button">) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={cls}>{rest.children}</Link>;
  return <button className={cls} {...rest} />;
}
```

- [ ] **Step 2: Quick exit**

```tsx
// components/quick-exit.tsx
"use client";
import { useEffect, useRef } from "react";
import { clearState } from "@/lib/wizard-state";

const EXIT_URL = "https://www.bbc.com/weather";

export function leaveNow() {
  clearState();
  window.location.replace(EXIT_URL);
}

export function QuickExit() {
  const lastEsc = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - lastEsc.current < 800) leaveNow();
      lastEsc.current = now;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <button
      type="button"
      onClick={leaveNow}
      className="fixed bottom-4 right-4 z-40 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg shadow-lg"
      aria-label="Quick exit. Leaves this site immediately and clears your answers. Press Escape twice for the same."
    >
      Quick exit
    </button>
  );
}
```

- [ ] **Step 3: Nav, footer, notice**

```tsx
// components/nav.tsx
import Link from "next/link";
import { Button } from "./button";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">Take Back Control</Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/platforms" className="hidden sm:inline">Platforms</Link>
          <Link href="/resources" className="hidden sm:inline">Resources</Link>
          <Button href="/start" className="px-4 py-2 text-sm">Start</Button>
        </div>
      </nav>
    </header>
  );
}
```

```tsx
// components/footer.tsx
import Link from "next/link";
import { NoUploadNotice } from "./no-upload-notice";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <NoUploadNotice />
        <div className="flex gap-6">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
```

```tsx
// components/no-upload-notice.tsx
export function NoUploadNotice() {
  return <p className="text-sm text-muted">Nothing you enter here is uploaded. It stays in your browser.</p>;
}
```

- [ ] **Step 4: Wire into layout**

In `app/layout.tsx`, wrap `{children}`:

```tsx
<body className="min-h-[100dvh] antialiased">
  <Nav />
  <main>{children}</main>
  <Footer />
  <QuickExit />
</body>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `http://localhost:3000`. Confirm nav on one line, quick exit visible, pressing Escape twice navigates away. Run `npm run build` and confirm it passes.

- [ ] **Step 6: Commit**

```bash
git add components app/layout.tsx
git commit -m "feat: add site shell with quick exit"
```

---

### Task 7: Wizard

**Files:**
- Create: `components/wizard/progress.tsx`, `components/wizard/question.tsx`, `components/wizard/platform-picker.tsx`, `components/wizard/country-picker.tsx`, `components/wizard/wizard.tsx`, `app/start/page.tsx`
- Test: `tests/wizard.test.tsx`

**Interfaces:**
- Consumes: `Answers` from `@/lib/plan`; `loadState`, `saveState`, `emptyAnswers` from `@/lib/wizard-state`; `selectablePlatforms` from `@/content/platforms`.
- Produces: `<Wizard />` which on completion saves `{ step: 6, answers }` and calls `router.push("/plan")`.

- [ ] **Step 1: Write the failing component test**

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Wizard } from "@/components/wizard/wizard";
import { clearState, loadState } from "@/lib/wizard-state";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("Wizard", () => {
  beforeEach(() => { clearState(); push.mockClear(); });

  it("skips the platform question when nothing is posted", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("A threat to share something"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No, but someone is threatening to"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/take the image or video yourself/i)).toBeTruthy();
  });

  it("blocks next when another website is chosen with no url", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Another website"));
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText(/paste the link/i)).toBeTruthy();
    expect(screen.getByText(/where was it posted/i)).toBeTruthy();
  });

  it("saves answers and navigates to plan on finish", () => {
    render(<Wizard />);
    fireEvent.click(screen.getByLabelText("An image")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("TikTok")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Yes, I took it")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("No")); fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("Prefer not to say")); fireEvent.click(screen.getByText("See my plan"));
    expect(push).toHaveBeenCalledWith("/plan");
    expect(loadState()?.answers.platformSlugs).toEqual(["tiktok"]);
  });
});
```

Add to `vitest.config.ts` test block: `globals: true, setupFiles: ["tests/setup.ts"]`, and create `tests/setup.ts` with `import "@testing-library/jest-dom/vitest";` after `npm i -D @testing-library/jest-dom`. Change the `include` glob to also match `.tsx` (already does).

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Progress and single-choice question**

```tsx
// components/wizard/progress.tsx
export function Progress({ step, total }: { step: number; total: number }) {
  return <p className="text-sm text-muted">Question {step} of {total}</p>;
}
```

```tsx
// components/wizard/question.tsx
export interface Option<V extends string> { value: V; label: string; hint?: string }

export function Question<V extends string>({ title, name, options, value, onChange }: {
  title: string; name: string; options: Option<V>[]; value: V | undefined; onChange: (v: V) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 text-2xl font-semibold tracking-tight">{title}</legend>
      {options.map((o) => (
        <label key={o.value} className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 ${value === o.value ? "border-accent bg-surface" : "border-border"}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-1 accent-accent" aria-label={o.label} />
          <span>
            <span className="block font-medium">{o.label}</span>
            {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
```

- [ ] **Step 3: Platform and country pickers**

```tsx
// components/wizard/platform-picker.tsx
import { selectablePlatforms } from "@/content/platforms";

export function PlatformPicker({ selected, otherUrl, error, onToggle, onOtherUrl }: {
  selected: string[]; otherUrl: string; error: string | null;
  onToggle: (slug: string) => void; onOtherUrl: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 text-2xl font-semibold tracking-tight">Where was it posted?</legend>
      <p className="text-sm text-muted">Choose every place you know about.</p>
      {selectablePlatforms.map((p) => (
        <label key={p.slug} className={`flex cursor-pointer items-center gap-3 rounded-card border p-4 ${selected.includes(p.slug) ? "border-accent bg-surface" : "border-border"}`}>
          <input type="checkbox" checked={selected.includes(p.slug)} onChange={() => onToggle(p.slug)} className="accent-accent" aria-label={p.name} />
          <span className="font-medium">{p.name}</span>
        </label>
      ))}
      {selected.includes("other") && (
        <div className="flex flex-col gap-2">
          <label htmlFor="otherUrl" className="font-medium">Paste the link</label>
          <input id="otherUrl" type="url" value={otherUrl} onChange={(e) => onOtherUrl(e.target.value)} className="rounded-card border border-border bg-bg px-4 py-3" placeholder="https://" aria-describedby={error ? "otherUrl-error" : undefined} />
          {error && <p id="otherUrl-error" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
        </div>
      )}
    </fieldset>
  );
}
```

```tsx
// components/wizard/country-picker.tsx
const COUNTRIES: { code: string; name: string }[] = [
  { code: "US", name: "United States" }, { code: "GB", name: "United Kingdom" }, { code: "IN", name: "India" },
  { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" }, { code: "DE", name: "Germany" },
  { code: "FR", name: "France" }, { code: "BR", name: "Brazil" }, { code: "NG", name: "Nigeria" }, { code: "PH", name: "Philippines" },
];

export function CountryPicker({ value, onChange }: { value: string | null | undefined; onChange: (v: string | null) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight">Where are you?</h2>
      <p className="text-sm text-muted">Used only to show local helplines. You can skip this.</p>
      <label htmlFor="country" className="font-medium">Country</label>
      <select id="country" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className="rounded-card border border-border bg-bg px-4 py-3">
        <option value="">Choose a country</option>
        {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
      <label className="flex items-center gap-3">
        <input type="radio" name="country-skip" checked={value === null} onChange={() => onChange(null)} className="accent-accent" aria-label="Prefer not to say" />
        <span>Prefer not to say</span>
      </label>
    </div>
  );
}
```

- [ ] **Step 4: The wizard**

```tsx
// components/wizard/wizard.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Answers } from "@/lib/plan";
import { emptyAnswers, loadState, saveState } from "@/lib/wizard-state";
import { Button } from "@/components/button";
import { Progress } from "./progress";
import { Question } from "./question";
import { PlatformPicker } from "./platform-picker";
import { CountryPicker } from "./country-picker";

type StepId = "contentType" | "posted" | "platforms" | "selfTaken" | "minor" | "country";

function stepsFor(a: Partial<Answers>): StepId[] {
  const posted = a.posted === "yes" || a.posted === "unsure";
  return ["contentType", "posted", ...(posted ? (["platforms"] as StepId[]) : []), "selfTaken", "minor", "country"];
}

export function Wizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<Answers>>(emptyAnswers);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [countryTouched, setCountryTouched] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (s && s.step < 6) { setAnswers({ ...emptyAnswers, ...s.answers }); setIndex(s.step); }
  }, []);

  const steps = stepsFor(answers);
  const step = steps[Math.min(index, steps.length - 1)];
  const isLast = index === steps.length - 1;

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => { setError(null); setAnswers((a) => ({ ...a, [k]: v })); };

  function valid(): boolean {
    switch (step) {
      case "contentType": return !!answers.contentType;
      case "posted": return !!answers.posted;
      case "platforms": {
        const sel = answers.platformSlugs ?? [];
        if (sel.length === 0) { setError("Choose at least one place."); return false; }
        if (sel.includes("other") && !/^https?:\/\/\S+$/.test(answers.otherUrl ?? "")) { setError("Paste the full link, starting with https://"); return false; }
        return true;
      }
      case "selfTaken": return !!answers.selfTaken;
      case "minor": return !!answers.minor;
      case "country": return countryTouched || answers.country === null;
    }
  }

  function next() {
    if (!valid()) { if (!error) setError("Choose an option to continue."); return; }
    if (isLast) {
      const full: Answers = {
        contentType: answers.contentType!, posted: answers.posted!,
        platformSlugs: answers.platformSlugs ?? [], otherUrl: answers.otherUrl ?? "",
        selfTaken: answers.selfTaken!, minor: answers.minor!, country: answers.country ?? null,
      };
      saveState({ step: 6, answers: full });
      router.push("/plan");
      return;
    }
    const ni = index + 1;
    setIndex(ni); saveState({ step: ni, answers });
  }

  function back() { if (index > 0) { setError(null); setIndex(index - 1); } }

  return (
    <div key={step} className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12 motion-safe:animate-[fade_200ms_ease-out]">
      <Progress step={index + 1} total={steps.length} />
      {step === "contentType" && (
        <Question title="What was shared, or threatened?" name="contentType" value={answers.contentType}
          onChange={(v) => set("contentType", v)}
          options={[{ value: "image", label: "An image" }, { value: "video", label: "A video" }, { value: "threat", label: "A threat to share something", hint: "Nothing has been posted yet" }]} />
      )}
      {step === "posted" && (
        <Question title="Has it been posted anywhere?" name="posted" value={answers.posted}
          onChange={(v) => set("posted", v)}
          options={[{ value: "yes", label: "Yes" }, { value: "threatened", label: "No, but someone is threatening to" }, { value: "unsure", label: "I am not sure" }]} />
      )}
      {step === "platforms" && (
        <PlatformPicker selected={answers.platformSlugs ?? []} otherUrl={answers.otherUrl ?? ""} error={error}
          onToggle={(slug) => { const cur = answers.platformSlugs ?? []; set("platformSlugs", cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]); }}
          onOtherUrl={(v) => set("otherUrl", v)} />
      )}
      {step === "selfTaken" && (
        <Question title="Did you take the image or video yourself?" name="selfTaken" value={answers.selfTaken}
          onChange={(v) => set("selfTaken", v)}
          options={[{ value: "yes", label: "Yes, I took it", hint: "This lets you use copyright law as well" }, { value: "no", label: "No, someone else did" }, { value: "unsure", label: "I am not sure" }]} />
      )}
      {step === "minor" && (
        <Question title="Is anyone in it under 18?" name="minor" value={answers.minor}
          onChange={(v) => set("minor", v)}
          options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
      )}
      {step === "country" && (
        <CountryPicker value={answers.country} onChange={(v) => { setCountryTouched(true); set("country", v); }} />
      )}
      {error && step !== "platforms" && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" onClick={back} disabled={index === 0}>Back</Button>
        <Button onClick={next}>{isLast ? "See my plan" : "Next"}</Button>
      </div>
    </div>
  );
}
```

Add to `app/globals.css`:

```css
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
```

Note on the country step: the test clicks "Prefer not to say" which sets `country` to `null` and `countryTouched` to true. The default `emptyAnswers.country` is also `null`, so `valid()` already returns true before touching; the `countryTouched` flag exists so the select's empty state is not mistaken for a choice when a country list grows. Keep it.

- [ ] **Step 5: Page**

```tsx
// app/start/page.tsx
import { Wizard } from "@/components/wizard/wizard";
import { NoUploadNotice } from "@/components/no-upload-notice";

export const metadata = { title: "Start" };

export default function StartPage() {
  return (
    <>
      <div className="mx-auto max-w-xl px-4 pt-8"><NoUploadNotice /></div>
      <Wizard />
    </>
  );
}
```

- [ ] **Step 6: Run tests and build**

Run: `npm test` then `npm run build`.
Expected: all pass, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add components/wizard app/start tests/wizard.test.tsx tests/setup.ts vitest.config.ts app/globals.css package.json package-lock.json
git commit -m "feat: add six-question wizard with session persistence"
```

---

### Task 8: Plan page and letter cards

**Files:**
- Create: `components/wizard/letter-card.tsx`, `components/wizard/plan-view.tsx`, `app/plan/page.tsx`
- Test: `tests/plan-view.test.tsx`

**Interfaces:**
- Consumes: `buildPlan`, `Plan`, `Answers` from `@/lib/plan`; `renderLetter` from `@/lib/letters`; `letterTitles` from `@/content/letters`; `loadState` from `@/lib/wizard-state`.
- Produces: `<PlanView plan={Plan} />`, `<LetterCard kind platform urls />`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanView } from "@/components/wizard/plan-view";
import { buildPlan } from "@/lib/plan";

describe("PlanView", () => {
  it("renders sections for an adult with posted content", () => {
    const plan = buildPlan({ contentType: "image", posted: "yes", platformSlugs: ["meta"], otherUrl: "", selfTaken: "yes", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.getByText("Right now")).toBeTruthy();
    expect(screen.getByText("Report to platforms")).toBeTruthy();
    expect(screen.getByText("Facebook and Instagram")).toBeTruthy();
    expect(screen.getByText("Remove from search")).toBeTruthy();
    expect(screen.getByText("Stop it spreading")).toBeTruthy();
    expect(screen.getAllByText("Copyright takedown notice").length).toBe(1);
    expect(screen.getByText("Support")).toBeTruthy();
  });
  it("omits report and search sections for threat only", () => {
    const plan = buildPlan({ contentType: "threat", posted: "threatened", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "no", country: null });
    render(<PlanView plan={plan} />);
    expect(screen.queryByText("Report to platforms")).toBeNull();
    expect(screen.queryByText("Remove from search")).toBeNull();
  });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Letter card**

```tsx
// components/wizard/letter-card.tsx
"use client";
import { useState } from "react";
import { renderLetter } from "@/lib/letters";
import { letterTitles, type LetterKind } from "@/content/letters";
import { Button } from "@/components/button";

export function LetterCard({ kind, platform, urls }: { kind: LetterKind; platform: string; urls: string[] }) {
  const [name, setName] = useState("");
  const [extraUrls, setExtraUrls] = useState(urls.join("\n"));
  const [copied, setCopied] = useState(false);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const text = renderLetter(kind, { platform, urls: extraUrls.split("\n").map((s) => s.trim()).filter(Boolean), date, name });

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked; user can select text */ }
  }
  function download() {
    try {
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${kind}.txt`; a.click(); URL.revokeObjectURL(a.href);
    } catch { /* copy still works */ }
  }

  return (
    <article className="flex flex-col gap-3 rounded-card border border-border p-5">
      <h4 className="font-semibold">{letterTitles[kind]}<span className="font-normal text-muted"> for {platform}</span></h4>
      <label className="text-sm font-medium" htmlFor={`${kind}-${platform}-urls`}>Links, one per line</label>
      <textarea id={`${kind}-${platform}-urls`} value={extraUrls} onChange={(e) => setExtraUrls(e.target.value)} rows={3} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
      <label className="text-sm font-medium" htmlFor={`${kind}-${platform}-name`}>Your name (optional)</label>
      <input id={`${kind}-${platform}-name`} value={name} onChange={(e) => setName(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
      <pre className="whitespace-pre-wrap rounded-card bg-surface p-4 text-sm leading-relaxed">{text}</pre>
      <div className="flex gap-3">
        <Button onClick={copy} className="px-4 py-2 text-sm">{copied ? "Copied" : "Copy"}</Button>
        <Button variant="secondary" onClick={download} className="px-4 py-2 text-sm">Download</Button>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Plan view**

```tsx
// components/wizard/plan-view.tsx
import Link from "next/link";
import type { Plan } from "@/lib/plan";
import { LetterCard } from "./letter-card";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function PlanView({ plan }: { plan: Plan }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Your plan</h1>
        <p className="mt-2 text-muted">Work through it top to bottom. You can come back to this page while this tab is open.</p>
      </header>

      <Section title="Right now">
        <ol className="list-decimal space-y-2 pl-5">{plan.rightNow.map((s) => <li key={s}>{s}</li>)}</ol>
      </Section>

      {(plan.platforms.length > 0 || plan.otherUrl) && (
        <Section title="Report to platforms">
          {plan.platforms.map((p) => (
            <div key={p.slug} className="rounded-card border border-border p-5">
              <h3 className="font-semibold">{p.name}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <p className="mt-3 text-sm text-muted">{p.expectedResponse}</p>
              <a href={p.reportUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-medium text-accent underline">Open {p.name}'s report form</a>
              <p className="mt-2 text-sm text-muted">If ignored: {p.escalation}</p>
            </div>
          ))}
          {plan.otherUrl && (
            <div className="rounded-card border border-border p-5">
              <h3 className="font-semibold">Another website</h3>
              <p className="mt-2 text-sm">Find the site's abuse contact, then send the hosting provider letter below. <Link href="/platforms/other" className="text-accent underline">How to find the contact</Link>.</p>
            </div>
          )}
        </Section>
      )}

      {plan.searchEngines.length > 0 && (
        <Section title="Remove from search">
          <p className="text-sm text-muted">Even after a post is deleted, search results can linger. Ask each search engine to drop them.</p>
          <ul className="space-y-2">{plan.searchEngines.map((p) => (
            <li key={p.slug}><a href={p.reportUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">{p.name}</a></li>
          ))}</ul>
        </Section>
      )}

      <Section title="Stop it spreading">
        {plan.prevention.map((r) => (
          <div key={r.name} className="rounded-card border border-border p-5">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="mt-1 text-sm">{r.description}</p>
            <p className="mt-2 text-sm text-muted">The fingerprint is made on your device. The image itself is never sent anywhere.</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-medium text-accent underline">Go to {r.name}</a>
          </div>
        ))}
      </Section>

      {plan.letters.length > 0 && (
        <Section title="Letters">
          <p className="text-sm text-muted">Edit, copy, and send. Dates are filled in for today.</p>
          {plan.letters.map((l, i) => <LetterCard key={`${l.kind}-${l.platform}-${i}`} kind={l.kind} platform={l.platform} urls={l.urls} />)}
        </Section>
      )}

      <Section title="Support">
        <ul className="space-y-3">{plan.support.map((r) => (
          <li key={r.name}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">{r.name}</a>
            {r.phone && <span className="text-sm text-muted"> {r.phone}</span>}
            <p className="text-sm text-muted">{r.description}</p>
          </li>
        ))}</ul>
      </Section>
    </div>
  );
}
```

- [ ] **Step 4: Page**

```tsx
// app/plan/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPlan, type Plan, type Answers } from "@/lib/plan";
import { loadState } from "@/lib/wizard-state";
import { PlanView } from "@/components/wizard/plan-view";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => {
    const s = loadState();
    if (!s || s.step < 6) { router.replace("/start"); return; }
    setPlan(buildPlan(s.answers as Answers));
  }, [router]);
  if (!plan) return <div className="mx-auto max-w-2xl px-4 py-12 text-muted">Loading your plan</div>;
  return <PlanView plan={plan} />;
}
```

Create `app/plan/layout.tsx` for metadata (client pages cannot export it):

```tsx
export const metadata = { title: "Your plan", robots: { index: false, follow: false } };
export default function PlanLayout({ children }: { children: React.ReactNode }) { return children; }
```

- [ ] **Step 5: Run tests and build**

Run: `npm test` then `npm run build`.
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add components/wizard/letter-card.tsx components/wizard/plan-view.tsx app/plan tests/plan-view.test.tsx
git commit -m "feat: add plan page with editable letters"
```

---

### Task 9: Platforms, resources, about, privacy, 404

**Files:**
- Create: `app/platforms/page.tsx`, `app/platforms/[slug]/page.tsx`, `app/resources/page.tsx`, `app/about/page.tsx`, `app/privacy/page.tsx`, `app/not-found.tsx`

**Interfaces:**
- Consumes: `platforms`, `getPlatform` from `@/content/platforms`; `resourcesFor` from `@/content/resources`.

- [ ] **Step 1: Platform index and detail**

```tsx
// app/platforms/page.tsx
import Link from "next/link";
import { platforms } from "@/content/platforms";

export const metadata = { title: "Platform guides" };

export default function PlatformsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Platform guides</h1>
      <p className="mt-2 max-w-[65ch] text-muted">How to report non-consensual intimate images on each platform, and what to do if they ignore you.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {platforms.map((p) => (
          <Link key={p.slug} href={`/platforms/${p.slug}`} className="rounded-card border border-border p-5 hover:bg-surface">
            <span className="font-semibold">{p.name}</span>
            <span className="mt-1 block text-sm text-muted">{p.expectedResponse}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// app/platforms/[slug]/page.tsx
import { notFound } from "next/navigation";
import { platforms, getPlatform } from "@/content/platforms";

export function generateStaticParams() { return platforms.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = getPlatform(slug);
  return { title: p ? `Report on ${p.name}` : "Not found" };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlatform(slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
      <p className="mt-2 text-muted">{p.expectedResponse}</p>
      <h2 className="mt-8 text-xl font-semibold">Steps</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <a href={p.reportUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-medium text-accent underline">Open the report form</a>
      <h2 className="mt-8 text-xl font-semibold">If nothing happens</h2>
      <p className="mt-2">{p.escalation}</p>
      {p.acceptsStopNCIIHashes && <p className="mt-4 text-sm text-muted">This platform blocks images fingerprinted through StopNCII.</p>}
      {p.notes && <p className="mt-4 text-sm text-muted">{p.notes}</p>}
    </article>
  );
}
```

- [ ] **Step 2: Resources, about, privacy, 404**

```tsx
// app/resources/page.tsx
import { resourcesFor } from "@/content/resources";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  const all = [...resourcesFor(null, false), ...resourcesFor(null, true)].filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i);
  const groups = { prevention: "Stop it spreading", reporting: "Report", crisis: "Talk to someone", legal: "Legal help" } as const;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
      {(Object.keys(groups) as (keyof typeof groups)[]).map((k) => {
        const items = all.filter((r) => r.kind === k);
        if (!items.length) return null;
        return (
          <section key={k} className="mt-10">
            <h2 className="text-xl font-semibold">{groups[k]}</h2>
            <ul className="mt-3 space-y-4">{items.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">{r.name}</a>
                {r.phone && <span className="text-sm text-muted"> {r.phone}</span>}
                <p className="text-sm text-muted">{r.description}</p>
              </li>
            ))}</ul>
          </section>
        );
      })}
    </div>
  );
}
```

```tsx
// app/about/page.tsx
export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About this site</h1>
      <p className="mt-4 max-w-[65ch] leading-relaxed">Having intimate images shared without consent is a crime in many countries and a policy violation on every major platform. The steps to get them removed are scattered across dozens of help pages. This site puts them in one place and in the right order.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">It does not store anything about you. There is no account, no database, and no tracking. Fingerprinting to block future uploads is handled by StopNCII and Take It Down, which are linked from your plan.</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">This is not legal advice. For your situation, contact a lawyer or one of the helplines on the resources page.</p>
    </article>
  );
}
```

```tsx
// app/privacy/page.tsx
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <ul className="mt-4 max-w-[65ch] list-disc space-y-2 pl-5 leading-relaxed">
        <li>Your answers stay in your browser's session storage and are deleted when you close the tab or press Quick exit.</li>
        <li>Nothing is sent to a server. There are no accounts, cookies, or analytics.</li>
        <li>Links to other sites open in a new tab. Their privacy policies apply there.</li>
        <li>Fonts are served from this site, not from a third party.</li>
      </ul>
    </article>
  );
}
```

```tsx
// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4"><Link href="/platforms" className="text-accent underline">See the platform guides</Link> or <Link href="/start" className="text-accent underline">start the wizard</Link>.</p>
    </div>
  );
}
```

- [ ] **Step 3: Build and check**

Run: `npm run build`. Open `/platforms/meta` and `/platforms/nope` in dev and confirm the second shows the 404 page.

- [ ] **Step 4: Commit**

```bash
git add app/platforms app/resources app/about app/privacy app/not-found.tsx
git commit -m "feat: add platform guides, resources, about, privacy, and 404 pages"
```

---

### Task 10: Landing page with motion and 3D leaves

**Files:**
- Create: `lib/motion-capable.ts`, `components/landing/hero.tsx`, `components/landing/steps-stack.tsx`, `components/landing/hash-visual-static.tsx`, `components/landing/hash-visual.tsx`, `components/landing/resources-reveal.tsx`, `components/landing/closing-cta.tsx`, `public/hero.jpg`, `public/hash-static.jpg`
- Modify: `app/page.tsx`
- Test: `e2e/landing.spec.ts`, `e2e/wizard.spec.ts`

**Interfaces:**
- Consumes: `Button`, `resourcesFor`.
- Produces: the landing page.

- [ ] **Step 1: Images**

Generate two images with whatever image tool is available, or use `https://picsum.photos/seed/calm-window-light/1600/1200` and `https://picsum.photos/seed/abstract-grid/1200/900` downloaded into `public/`. The hero image should be calm, abstract, low-contrast, no people. The static hash image is a soft grid of tiles fading into noise. Both under 300KB.

- [ ] **Step 2: Device heuristic**

```ts
// lib/motion-capable.ts
export function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  return true;
}
```

- [ ] **Step 3: Hero**

```tsx
// components/landing/hero.tsx
import Image from "next/image";
import { Button } from "@/components/button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-20 md:grid-cols-[1.1fr_1fr] md:pt-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tighter leading-none md:text-6xl">Get intimate images taken down. Step by step.</h1>
        <p className="max-w-[48ch] text-lg text-muted">Six questions, then a plan with the right report links and letters. Nothing is uploaded.</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/start">Start</Button>
          <Button href="#how" variant="secondary">How it works</Button>
        </div>
      </div>
      <Image src="/hero.jpg" alt="" width={1600} height={1200} priority className="rounded-card object-cover" />
    </section>
  );
}
```

- [ ] **Step 4: Sticky stack (GSAP)**

```tsx
// components/landing/steps-stack.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Document", body: "Screenshot every post with its link and date. Evidence first, before anything disappears." },
  { title: "Remove", body: "Report to each platform with the exact form that handles intimate images, and send the letters we prefill." },
  { title: "Prevent", body: "Fingerprint the images on your own device through StopNCII so partner platforms block re-uploads." },
];

export function StepsStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
  }, []);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: cards[cards.length - 1], end: "top top", pin: true, pinSpacing: false });
        gsap.to(card, { scale: 0.94, opacity: 0.5, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true } });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="how" ref={ref} className="relative" data-testid="steps-stack" data-reduced={reduce}>
      {STEPS.map((s, i) => (
        <div key={s.title} className={`stack-card flex items-center justify-center bg-bg px-4 ${reduce ? "py-20" : "sticky top-0 min-h-[100dvh]"}`}>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_2fr]">
            <span className="text-7xl font-semibold tracking-tighter text-accent">{i + 1}</span>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-3 max-w-[55ch] text-lg text-muted">{s.body}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Hash visual (Three.js, lazy) and static fallback**

```tsx
// components/landing/hash-visual-static.tsx
import Image from "next/image";
export function HashVisualStatic() {
  return <Image src="/hash-static.jpg" alt="An image breaking into a grid of tiles that fade into a short code" width={1200} height={900} className="rounded-card object-cover" data-testid="hash-static" />;
}
```

```tsx
// components/landing/hash-visual.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { canRun3D } from "@/lib/motion-capable";
import { HashVisualStatic } from "./hash-visual-static";

export function HashVisual() {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => { setMode(canRun3D() ? "3d" : "static"); }, []);

  useEffect(() => {
    if (mode !== "3d" || !host.current) return;
    let stop = () => {};
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      if (cancelled || !host.current) return;
      const el = host.current;
      const w = el.clientWidth, h = Math.round(w * 0.75);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.z = 14;
      const accent = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1f6f6b");
      const N = 8, group = new THREE.Group();
      const geo = new THREE.BoxGeometry(0.9, 0.9, 0.2);
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: accent, roughness: 0.6 }));
        m.position.set(x - N / 2 + 0.5, y - N / 2 + 0.5, 0);
        group.add(m);
      }
      scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 5, 6); scene.add(key);

      let raf = 0, visible = true, t = 0;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }, { threshold: 0.1 });
      io.observe(el);
      function loop() {
        if (!visible) return;
        t += 0.008;
        group.children.forEach((c, i) => {
          const phase = (i % N) / N + Math.floor(i / N) / N;
          c.position.z = Math.sin(t * 2 + phase * 6) * 0.6;
          c.rotation.y = Math.sin(t + phase * 3) * 0.4;
        });
        group.rotation.y = Math.sin(t * 0.5) * 0.25;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
      loop();
      const onResize = () => { const nw = el.clientWidth, nh = Math.round(nw * 0.75); renderer.setSize(nw, nh); camera.aspect = nw / nh; camera.updateProjectionMatrix(); };
      window.addEventListener("resize", onResize);
      stop = () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); renderer.dispose(); geo.dispose(); el.innerHTML = ""; };
    })();
    return () => { cancelled = true; stop(); };
  }, [mode]);

  if (mode === "static") return <HashVisualStatic />;
  return <div ref={host} data-testid="hash-3d" className="min-h-[300px] w-full overflow-hidden rounded-card" aria-hidden="true" />;
}
```

Section wrapper in `app/page.tsx` (Step 7) supplies the heading and copy; the leaf only renders the visual.

- [ ] **Step 6: Resources reveal and closing CTA**

```tsx
// components/landing/resources-reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Resource } from "@/content/types";

export function ResourcesReveal({ items }: { items: Resource[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((r, i) => (
        <motion.li key={r.name} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} className="border-t border-border pt-4">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">{r.name}</a>
          <p className="mt-1 text-sm text-muted">{r.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}
```

```tsx
// components/landing/closing-cta.tsx
import { Button } from "@/components/button";
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="rounded-card bg-accent px-8 py-14 text-accent-fg md:px-14">
        <h2 className="max-w-[20ch] text-3xl font-semibold tracking-tight md:text-4xl">It takes about five minutes to get your plan.</h2>
        <div className="mt-8"><Button href="/start" className="bg-bg text-fg">Start</Button></div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Compose `app/page.tsx`**

```tsx
import { Hero } from "@/components/landing/hero";
import { StepsStack } from "@/components/landing/steps-stack";
import { HashVisual } from "@/components/landing/hash-visual";
import { ResourcesReveal } from "@/components/landing/resources-reveal";
import { ClosingCta } from "@/components/landing/closing-cta";
import { resourcesFor } from "@/content/resources";

export default function Home() {
  const items = resourcesFor(null, false).filter((r) => r.kind !== "prevention");
  return (
    <>
      <Hero />
      <StepsStack />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">How fingerprinting protects you</h2>
          <p className="mt-4 max-w-[55ch] text-lg text-muted">StopNCII turns an image into a short code on your device. Partner platforms compare uploads against that code and block matches. The image itself never leaves your phone.</p>
        </div>
        <HashVisual />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-semibold tracking-tight">Someone to talk to</h2>
        <div className="mt-8"><ResourcesReveal items={items} /></div>
      </section>
      <ClosingCta />
    </>
  );
}
```

Note the "Start" label is used for the same intent in nav, hero, and closing section. "How it works" appears once.

- [ ] **Step 8: End-to-end tests**

```ts
// e2e/wizard.spec.ts
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
  await expect(page.getByText("TikTok")).toBeVisible();
  await expect(page.getByText("Copyright takedown notice")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/start$/);
  await expect(page.getByText("Question 6 of 6")).toBeVisible();

  await page.goto("/plan");
  const cleared = page.waitForURL(/bbc\.com/).catch(() => null);
  await page.getByRole("button", { name: /quick exit/i }).click();
  await cleared;
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/start$/);
});

test("plan with no state redirects", async ({ page }) => {
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/start$/);
});
```

The wizard restores `step` from storage; when `step === 6` it must restore to the last question rather than ignore state. Update the `useEffect` in `wizard.tsx` to:

```ts
if (s) { setAnswers({ ...emptyAnswers, ...s.answers }); setIndex(Math.min(s.step, stepsFor(s.answers).length - 1)); }
```

```ts
// e2e/landing.spec.ts
import { test, expect } from "@playwright/test";

test("landing with reduced motion uses static fallbacks", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByTestId("steps-stack")).toHaveAttribute("data-reduced", "true");
  await expect(page.getByTestId("hash-static")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
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
```

Run: `npm run e2e`
Expected: all pass.

- [ ] **Step 9: Lighthouse**

```bash
npx --yes lighthouse http://localhost:3000 --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json && node -e "const r=require('/tmp/lh.json');console.log(r.categories.performance.score, r.categories.accessibility.score, r.audits['largest-contentful-paint'].displayValue, r.audits['cumulative-layout-shift'].displayValue)"
```

Expected: accessibility 1, LCP under 2.5s, CLS under 0.1. If LCP fails, confirm `priority` on the hero image and that the Three.js chunk is not in the initial bundle (check `.next/static/chunks` for `three`).

- [ ] **Step 10: Pre-flight check against the taste skill**

Grep the repo for banned characters and patterns:

```bash
grep -rn --include=*.tsx --include=*.ts --include=*.md -E '[–—]' app components content | grep -v docs/ ; echo "dashes above (should be empty)"
grep -rn --include=*.tsx -E 'uppercase tracking' components app ; echo "eyebrows above (max 2)"
grep -rn --include=*.tsx -E "addEventListener\(['\"]scroll" components app ; echo "scroll listeners above (should be empty)"
```

Open the page in light and dark mode and confirm the accent is the same teal in every section and all buttons are readable.

- [ ] **Step 11: Commit**

```bash
git add app/page.tsx components/landing lib/motion-capable.ts public e2e components/wizard/wizard.tsx
git commit -m "feat: add landing page with sticky steps, 3D hash visual, and e2e tests"
```

---

## Self-review

**Spec coverage:** Purpose and scope (Tasks 7, 8). Architecture, routes, folder layout (Tasks 1, 6, 7, 8, 9, 10). Content model (Task 2, 3). Wizard questions, skip rule, minor path (Tasks 4, 7). Plan sections one to six (Tasks 4, 8). UI direction: tokens, Geist, radius, Phosphor (Task 1; Phosphor is installed but no icon is required yet, so none is imported, which is fine), landing sections with GSAP, Three.js, Motion (Task 10). Safety: quick exit, Escape twice, no analytics, headers, no-upload line, noindex (Tasks 1, 6, 8). Error handling: redirect, storage fallback, 404, blob fallback (Tasks 5, 8, 9). Testing: unit, Playwright, Lighthouse (Tasks 2 to 10).

**Gaps found and fixed:** `Resource.forAdults` was missing from the spec table; added in Task 2. The wizard restoring at step 6 for the back-button case was missing; added in Task 10 Step 8.

**Type consistency:** `Answers`, `Plan`, `PlanLetter`, `LetterKind`, `LetterVars`, `WizardState`, `Resource`, `Platform` are defined once and used by the same names throughout. `resourcesFor(region, forMinor)` signature matches in Tasks 2, 4, 9, 10.

**Review Focus coverage:** item 1 in Task 10 e2e; item 2 in Task 7 test; item 3 in Task 4 test; item 4 in Task 5 test; item 5 in Task 10 e2e.
