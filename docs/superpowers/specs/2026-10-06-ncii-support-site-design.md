# NCII Support and Takedown Site: Design Spec

Date: 2026-10-06
Status: Draft for review

## 1. Purpose

A public website for anyone whose intimate images have been shared, or are being threatened to be shared, without consent. The site walks them through a short wizard, produces a tailored action plan, and generates ready-to-send takedown requests for the platforms involved. Hash-based prevention is handed off to StopNCII (adults) and NCMEC Take It Down (minors) with a clear explanation of what those services do.

The site does not do hash matching itself. Blocking only works inside platforms that consume a hash list, and the site has no partner network. Its value is in the support and takedown side, which works from day one with no partnerships.

## 2. Audience and scope

- Global, English-only in version one.
- Platform takedown flows are the core, because they are the same everywhere.
- Legal guidance stays generic, with a country picker that adds country-specific resources where a data file exists. "Global" is the fallback.
- Minors (anyone in the content under 18) are routed to child-protection channels, not the adult flow.

## 3. Non-goals for version one

- No accounts, no saved cases, no server-side storage of anything about the person.
- No hash generation or hash submission.
- No analytics.
- No languages other than English.
- No live chat or human support.

## 4. Architecture

- Next.js (App Router), TypeScript, Tailwind v4.
- All pages statically generated. The wizard and plan run entirely client-side.
- No database and no API routes in version one.
- Content lives in typed data files under `content/`. Page code never hard-codes platform or resource details.
- Wizard state is held in React state and mirrored to `sessionStorage` so a reload does not lose progress. Quick exit clears it.
- Deploy target: Vercel.

### Routes

| Route | Purpose |
|---|---|
| `/` | Landing page and explainer |
| `/start` | The wizard |
| `/plan` | The generated action plan. Reads wizard state from memory or session storage. Never from URL parameters. If no state exists, redirects to `/start`. |
| `/platforms/[slug]` | Per-platform takedown guide |
| `/resources` | Crisis lines, legal aid, StopNCII and Take It Down hand-off |
| `/about` | Who runs the site and why |
| `/privacy` | Plain-language privacy statement |

### Folder layout

```
app/                  routes and layouts
components/           shared UI (nav, footer, quick exit, buttons)
components/landing/   landing-page sections, including the motion and 3D leaves
components/wizard/    wizard steps and the plan renderer
content/platforms/    one file per platform
content/resources/    one file per region, plus global.ts
content/letters/      Markdown letter templates
lib/plan.ts           pure function: answers -> plan
lib/letters.ts        pure function: template + answers -> letter text
lib/wizard-state.ts   session storage read/write/clear
```

## 5. Content model

### Platform (`content/platforms/<slug>.ts`)

| Field | Type | Notes |
|---|---|---|
| slug | string | URL segment |
| name | string | |
| contentTypes | ("image" \| "video" \| "threat")[] | What the platform's NCII form accepts |
| reportUrl | string | Direct link to the NCII reporting form |
| steps | string[] | Ordered instructions in plain language |
| acceptsStopNCIIHashes | boolean | Shown in the plan so the person knows prevention applies |
| expectedResponse | string | e.g. "Usually within 48 hours" |
| escalation | string | What to do if ignored, e.g. appeal URL or regulator |
| notes | string? | Optional caveats |

Initial platform set: Meta (Facebook and Instagram), TikTok, Snapchat, X, Reddit, Discord, Telegram, YouTube, Pornhub, OnlyFans, Google Search (de-indexing), Bing Search (de-indexing), and a generic "other website" entry that explains how to find a host's abuse contact via WHOIS.

### Resource (`content/resources/<region>.ts`)

| Field | Type | Notes |
|---|---|---|
| region | string | ISO country code or "global" |
| name | string | |
| kind | "crisis" \| "legal" \| "reporting" \| "prevention" | |
| url | string | |
| phone | string? | |
| description | string | One or two sentences |
| forMinors | boolean | Shown only when a minor is involved |

Global entries in version one: StopNCII, NCMEC Take It Down, Cyber Civil Rights Initiative helpline, Revenge Porn Helpline (UK, but accepts international queries), and a short list of general crisis lines. Country files are optional and can be added later.

### Letter template (`content/letters/<name>.md`)

Markdown with `{{placeholders}}`. Templates in version one:

- `platform-report.md`: a general NCII removal request for platforms without a dedicated form.
- `dmca-takedown.md`: a copyright takedown, used only when the person took the image themselves.
- `host-abuse.md`: a request to a hosting provider's abuse contact.

Placeholders: `{{platform}}`, `{{urls}}`, `{{date}}`, `{{isSubject}}`, `{{holdsCopyright}}`, `{{name}}` (optional, the person may leave it blank).

## 6. Wizard

Six questions, one per screen, in this order:

1. **What was shared?** image, video, or a threat to share (nothing posted yet).
2. **Has it been posted?** yes, no but threatened, not sure.
3. **Where?** multi-select from the platform list plus "another website" with a free-text URL field. Skipped if nothing has been posted.
4. **Did you take the image or video yourself?** yes, no, not sure. Determines whether the copyright letter is offered.
5. **Is anyone in it under 18?** yes, no. Yes routes to the minor path.
6. **Where are you?** country picker with "prefer not to say". Adds regional resources.

Rules:

- Back navigation is always available.
- Progress is shown as "Question 3 of 6".
- Answers are never put in the URL.
- The minor path replaces the adult plan with: Take It Down hand-off, NCMEC CyberTipline, the platform report links, and a short note on talking to a trusted adult. The copyright letter is never offered on the minor path.

## 7. Plan generation

`lib/plan.ts` exports a pure function `buildPlan(answers): Plan`.

A plan is an ordered list of sections:

1. **Right now**: one or two immediate steps (do not engage with the person threatening, save evidence with screenshots including URLs and dates).
2. **Report to platforms**: one entry per selected platform with the report link and steps. "Another website" produces the host abuse letter and WHOIS instructions.
3. **Remove from search**: Google and Bing de-indexing links, shown whenever content is posted.
4. **Stop it spreading**: StopNCII hand-off for adults, Take It Down for minors, with a plain explanation that these services create a fingerprint on the person's own device and never see the image.
5. **Letters**: the applicable templates, prefilled, with copy and download buttons.
6. **Support**: global resources plus any for the chosen country.

The function is deterministic and has no side effects, so it is unit-tested directly.

## 8. UI direction

Design read: a trust-first support site for people in distress, with a calm, premium language. Closer to a well-made health or legal service than a startup landing page.

Dials: variance 5. Motion 5 on the landing page, 2 everywhere else. Density 3.

- **Theme**: one locked theme with light and dark variants following system preference. Off-white and off-black neutrals. A single desaturated deep teal accent used identically everywhere. No purple, no glows, no gradient text.
- **Type**: Geist for display and body via `next/font`. No serif.
- **Shape**: soft radius (12px) for all containers and inputs, pill buttons. Documented and applied everywhere.
- **Icons**: Phosphor, one family, stroke 1.5.
- **Landing page sections**, each a different layout family:
  1. Asymmetric split hero: headline, one-line subtext, primary "Start" and secondary "How it works" buttons, and a generated photographic image. Fits the viewport. No 3D here, because first paint must be fast for someone who needs the start button immediately.
  2. Sticky-stack of the three steps: document, remove, prevent. GSAP ScrollTrigger per the taste skill's canonical skeleton. This is the only scroll-hijack on the page.
  3. "How fingerprinting protects you": a lazy-loaded Three.js leaf showing an image dissolving into a hash. Paused when off-screen. Replaced by a static image under reduced motion, on `navigator.hardwareConcurrency <= 4`, or on `saveData`.
  4. Resources: scroll-reveal stagger using Motion `whileInView`.
  5. Plain closing call to action and footer.
- **Wizard and plan pages**: same tokens, no scroll or 3D animation. Step transitions are a short opacity fade. Labels above inputs, errors below. Large touch targets.
- **Motion rules**: everything honours `prefers-reduced-motion`. GSAP and Three.js never share a component tree with Motion. All animation leaves are `'use client'` with cleanup.
- Zero em-dashes anywhere in visible text.

## 9. Safety and privacy

- **Quick exit** button fixed on every page. On click it clears session storage, replaces the current history entry, and navigates to a neutral site (a weather site). Also bound to pressing Escape twice.
- No analytics or third-party scripts. Fonts are self-hosted.
- Security headers: strict Content-Security-Policy (self only, plus inline styles needed by the framework), `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Permissions-Policy` denying camera and microphone.
- Every page carries a one-line statement that nothing the person enters is uploaded.
- The plan page is marked `noindex`.

## 10. Error handling

- Visiting `/plan` with no state redirects to `/start`.
- Session storage unavailable (private mode on some browsers) falls back to in-memory state only, with no error shown.
- A platform slug that does not exist returns the framework 404 with a link back to the platform list.
- Letter download uses a Blob; if that fails, the copy button still works.

## 11. Testing

- Unit tests (Vitest) for `buildPlan` covering: adult with content posted on two platforms, adult with threat only, minor, self-taken image enabling the copyright letter, "another website" producing the host letter, and country resources merging with global.
- Unit tests for `renderLetter` placeholder substitution.
- Playwright: walk the wizard end to end and assert the plan contains the expected platform entries; press quick exit and assert session storage is empty.
- Lighthouse on `/` in light and dark and with reduced motion. Targets: LCP under 2.5s, CLS under 0.1, accessibility score 100.

## 12. Open questions deferred to later versions

- Saved cases and progress tracking (needs auth and encrypted storage).
- More languages.
- Country-specific legal guidance beyond resource links.
- Privacy-respecting usage metrics to learn where people get stuck.
