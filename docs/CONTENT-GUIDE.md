# Content guide

Most useful contributions are corrections. Report forms move, laws change, and a dead link costs a distressed person time they do not have.

## The rules

1. **Open every URL in a real browser** before adding or changing it. Some official sites block automated requests, so a script alone is not proof.
2. **Date it.** Legal levers and resources carry `verifiedOn: "YYYY-MM-DD"`. Update the date when you re-check.
3. **Prefer primary sources**: the regulator, the statute, the platform's own help page.
4. **Plain language.** People reading this are frightened and often on a phone.
5. **No em or en dashes** in visible text. Use a hyphen or restructure. A test enforces this for content.
6. **Never invent a figure.** Every number links to its source.

## Platforms (`content/platforms/<slug>.ts`)

| Field | Meaning |
|---|---|
| `slug`, `name` | URL segment and display name |
| `contentTypes` | `image`, `video`, `threat` |
| `reportUrl` | the page where the person starts. Open it and confirm it still works |
| `steps` | at least three concrete steps, in order |
| `expectedResponse` | honest timing |
| `escalation` | what to do if ignored |
| `acceptsStopNCIIHashes` | shows the "Honours StopNCII hashes" tag |
| `abuseEmail` | optional. Only if published by the platform. Adds an "Open in your email app" link |
| `notes` | caveats, for example "no web form, report in the app" |

Register the platform in `content/platforms/index.ts`. Platforms never say "StopNCII" to minors: `buildPlan` rewrites it to "Take It Down", but write steps that make sense for both.

## Resources (`content/resources/*.ts`)

Each entry has a `region` (`global`, an ISO country code, or `EU`), a `kind` (`crisis`, `legal`, `reporting`, `prevention`), `forMinors` and `forAdults` flags, and an optional `phone` (rendered as a tap-to-call link). Child services must have `forMinors: true, forAdults: false`.

## Legal levers (`content/levers/*.ts`)

A lever is a route with force: a statute, a deadline, a regulator. Give it a `summary` in plain language, a `url` to the primary source, an optional `deadline`, and `verifiedOn`. If it comes with a letter, set `letterKind`.

## Letters (`content/letters/*.md`)

Placeholders: `{{date}}`, `{{platform}}`, `{{urls}}`, `{{name}}`, `{{contact}}`, `{{signature}}`. A statutory letter must contain every element the law requires. Check the statute, not a summary. Examples: the TAKE IT DOWN Act request needs identification of the content, a non-consent statement, good faith, contact details and a signature. A Digital Services Act notice needs the four Article 16(2) elements, and the name and email may be waived for child sexual abuse material.

Never let a letter ask a person to attach, send or describe an intimate image.

## After editing

```bash
npm test
npm run e2e
```
