# Take Back Control

Step-by-step help for anyone whose intimate images were shared, or threatened to be shared, without consent. A six-question wizard produces a plan you can tick off: what to record now, where to report on each platform and how, how to remove search results, your legal options in your country, prefilled letters, and a route to StopNCII (adults) or Take It Down (under 18).

**Nothing a person enters is uploaded.** There are no accounts, no database, no analytics, and no API calls. The site needs no keys and no environment variables to build or run.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node 20 or newer. That is all.

## Check it

```bash
npm test           # unit tests
npm run e2e        # end-to-end tests, including accessibility, against a production build
npm run build      # production build
```

CI runs lint, types, unit tests, and the end-to-end suite on every push.

## Deploy

Any static-capable Next.js host works. On Vercel, import the repository and deploy with the defaults. There are no environment variables to set.

## How it is built

- `app/` routes. `/start` is the wizard. `/plan` is the generated checklist, client-only and kept out of search.
- `components/wizard/` the questions and the plan. `components/landing/` the home page sections.
- `content/` platforms, resources, legal levers by country, and letter templates. Edit these to update guidance. No page code needs to change.
- `lib/plan.ts` turns answers into a plan. `lib/letters.ts` fills letter templates. `lib/wizard-state.ts` and `lib/progress.ts` keep answers and ticks in the browser tab only.
- `docs/superpowers/` the design spec, the roadmap stress test, and the implementation plans.

## Privacy by design

- Answers and checklist progress live in `sessionStorage` for the tab and are wiped by the Quick exit button (or pressing Escape twice).
- The evidence log fingerprints files with SHA-256 in the browser. The files are never read by a server.
- Letters open in the person's own email app. The site sends nothing.
- Security headers, including a strict content security policy, are set in `next.config.ts`.
- A test fails the build if any tracked file contains something shaped like an API key, or if the app code reads an environment variable.

## Keeping guidance accurate

Report links and laws change. Each platform and lever has the date it was last checked. Open a link in a browser before editing it, and keep visible text free of em and en dashes.

## Images

Photographs are public domain or CC0 from Wikimedia Commons. Illustrations were generated once with OpenAI's image API from the prompts in `scripts/image-prompts.json`. Every file, its source or model, and its date is recorded in `public/LICENSES.md`, and a test enforces that.

The images are committed, so running the site never needs a key. Only a maintainer who wants to regenerate the illustrations needs one:

```bash
OPENAI_API_KEY=your-key npm run generate:images -- --force
```

## Status of the roadmap

Built: wizard, plan checklist, minors path, evidence log, country packs, landing content, imagery. Designed but not built: a guided assistant (`docs/superpowers/specs/2026-10-06-chatbot-design.md`), encrypted case storage, URL monitoring. See `docs/superpowers/specs/2026-10-06-roadmap-stress-test.md` for what is blocked and why, including that StopNCII offers no API for third parties.
