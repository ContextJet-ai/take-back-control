# Architecture

## Shape

A Next.js (App Router) site written in TypeScript with Tailwind. Every page is statically generated. All behaviour that touches a person's answers runs in their browser. There is no database, no API route, and no server-side state.

```
 person's browser
 ┌────────────────────────────────────────────────────────────────┐
 │ /start  Wizard ──answers──▶ lib/wizard-state ──▶ sessionStorage │
 │                                  │                (tab only)    │
 │ /plan   loadState ──▶ lib/plan.buildPlan(answers) ──▶ Plan      │
 │              │                     │                            │
 │              │      content/ (platforms, resources, levers)     │
 │              ▼                                                  │
 │        PlanView ◀── lib/progress (ticks, sessionStorage)        │
 │              │                                                  │
 │              └──▶ LetterCard ◀── lib/letters (templates)        │
 │ /evidence  EvidenceBuilder ──▶ WebCrypto SHA-256 (in browser)   │
 └────────────────────────────────────────────────────────────────┘
```

## Pure functions at the centre

- `lib/plan.ts` `buildPlan(answers)` turns six answers into a `Plan`. It is a pure, deterministic function with no side effects, so it is unit tested directly. It decides the safe "right now" steps, which platforms and search engines to show, the legal levers and statutory letter for the country, and the minors path.
- `lib/letters.ts` `renderLetter(kind, vars)` fills a template with `{{date}}`, `{{platform}}`, `{{urls}}`, `{{name}}`, `{{contact}}` and a signature. Under-18 variants are handled here.
- `lib/evidence.ts` hashes bytes with WebCrypto and renders the evidence log.
- `lib/progress.ts` lists the checkable items of a plan and stores ticks.

## Content is data

`content/` holds everything that changes when the world changes:

- `content/platforms/*.ts` one file per platform: report URL, steps, expected response, escalation
- `content/resources/*.ts` helplines and services by region and audience
- `content/levers/*.ts` legal routes by region, each with a `verifiedOn` date and an optional letter kind
- `content/letters/*.md` letter templates
- `content/regions.ts` maps a country code to its packs (EU members also get `EU`)

Page code never hard-codes a URL or a law. Editing content never requires touching components.

## State

| What | Where | Lifetime |
|---|---|---|
| Wizard answers and current step | `sessionStorage` key `wizard`, mirrored in memory | the tab |
| Checklist ticks | `sessionStorage` key `plan-progress`, mirrored in memory | the tab |
| Evidence log fields | React state only | the page |

If storage is blocked (some private modes), the memory copy keeps the wizard working. `clearState()` clears answers and ticks together.

## Quick exit

`components/quick-exit.tsx` clears all state and replaces the current history entry with a neutral site. It is bound to a button (a header bar on phones, a floating button elsewhere) and to pressing Escape twice. A `pageshow` handler reloads if the page is restored from the back-forward cache, so answers cannot reappear after exit.

## Motion and 3D

Motion exists only on the home page and always has a still fallback.

- `components/landing/steps-stack.tsx` GSAP ScrollTrigger pins the three step cards. Skipped under reduced motion.
- `components/landing/shader-panel.tsx` a soft WebGL light over the hero. It starts after load and idle, renders at low resolution and 20fps, and skips weak devices and reduced motion. `SHADER_POLICY` documents the budget, and an end-to-end test caps main-thread blocking under a slow CPU.
- `components/landing/hash-visual.tsx` a lazy Three.js visual that loads only near the viewport.

## Testing

- Unit (`tests/`): the plan builder, letters, content shape and dash rules, state fallbacks, progress, components, image provenance, repository hygiene, docs links.
- End to end (`e2e/`): wizard flows, quick exit and storage wipe, layout at 375px, keyboard focus, axe accessibility in light and dark, and a throttled performance budget.
- CI (`.github/workflows/ci.yml`) runs lint, types, both suites.

## Security headers

`next.config.ts` sets a content security policy, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` and a restrictive `Permissions-Policy`. See [PRIVACY-AND-SECURITY.md](PRIVACY-AND-SECURITY.md).
