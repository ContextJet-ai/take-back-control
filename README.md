# Take Back Control

Step-by-step help for anyone whose intimate images were shared, or threatened to be shared, without consent. A six-question wizard produces a tailored plan: evidence steps, platform report links, prefilled takedown letters, and hand-offs to StopNCII (adults) or Take It Down (under 18).

Nothing a person enters is uploaded. There are no accounts, no database, no analytics.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## Test

```bash
npm test           # unit tests (Vitest)
npm run e2e        # end-to-end (Playwright, builds and serves production)
npm run build      # production build
```

## Structure

- `app/` routes. `/start` is the wizard, `/plan` the generated plan (client-only, noindex).
- `components/wizard/` wizard steps and plan renderer.
- `components/landing/` landing-page sections. The only motion and 3D on the site live here.
- `content/` platforms, resources, and letter templates. Edit these to update guidance; no page code needs to change.
- `lib/plan.ts` pure answers-to-plan function. `lib/letters.ts` template rendering. `lib/wizard-state.ts` session storage with memory fallback.
- `docs/superpowers/` design spec and implementation plan.

## Keeping content accurate

Platform report URLs change. Each entry in `content/platforms/` has `reportUrl`, `steps`, and `escalation`. Open the URL in a browser before editing, and keep the no-dash rule: visible text uses hyphens only.
