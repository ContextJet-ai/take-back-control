# Contributing

Thank you. The most valuable contributions are **corrections** (a dead link, a changed law), **new countries**, and **translations**. Anything that makes the site safer or clearer for someone in distress is welcome.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Please read this page first, because the site's promises shape what we can accept.

## Non-negotiables

1. **No data collection.** No analytics, tracking, cookies, accounts, or remote scripts or fonts. The app makes no network requests of its own. A pull request that adds one will be declined.
2. **No secrets.** No keys, tokens or `.env` files in the repository, and app code reads no environment variables. A test enforces both.
3. **Never real victim data.** Do not put real images, names, links or case details in issues, pull requests, tests or screenshots. Use obviously fake examples such as `https://example.com/post/1`.
4. **Every fact is sourced and dated.** Open each URL in a real browser. Legal items carry `verifiedOn`.
5. **Plain text with hyphens only.** No em or en dashes in visible text.
6. **Never ask a young person to save or send an image.**

## Set up

```bash
git clone https://github.com/ContextJet-ai/take-back-control.git
cd take-back-control
npm install
npm run dev
```

Node 20 or newer.

## How we work

- **Write the test first.** New behaviour starts with a failing test. Bug fixes start with a test that reproduces the bug.
- **Keep the plan builder pure.** `lib/plan.ts` and `lib/letters.ts` have no side effects.
- **Content is data.** Put guidance in `content/`, not in components. See [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).
- **Accessible by default.** Keyboard operable, visible focus, contrast-tested, reduced motion respected. Run the accessibility suite.
- **Small pull requests** with one purpose.

## Before you open a pull request

```bash
npx eslint .
npx tsc --noEmit
npm test
npm run e2e
```

All four must pass. CI runs them too.

## Adding images

Only public-domain, CC0, or generated images. Add the file under `public/images/`, record its title, author, licence and source in `public/LICENSES.md`, keep it under 220KB, and a test will check the rest. No images of identifiable people.

## Proposing a country or a language

Open an issue first with the sources. See [docs/ADDING-A-COUNTRY.md](docs/ADDING-A-COUNTRY.md). Translations need a native reviewer for any legal or crisis text. A poor machine translation is worse than English.

## Commit messages

Short imperative summary, then a sentence of why. For example: `fix: link the Meta guide to the current help page`.

## Licence

No open-source licence has been granted yet (see the README). By contributing you confirm you have the right to submit your work and that the maintainers may use it in the project, including under whatever licence is chosen.
