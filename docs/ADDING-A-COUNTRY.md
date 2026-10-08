# Adding a country

A country pack gives people there their own legal route, a letter in the right legal form where one exists, and local helplines. It takes about an hour once you have the sources. Use Singapore or New Zealand as practice: both are wanted and neither exists yet.

## Before you write code

Gather, from primary sources:

1. The law that makes sharing or threatening to share an intimate image an offence, and any **removal duty** on platforms with a deadline.
2. The **regulator or agency** that takes reports, and whether someone can report for the victim.
3. **Helplines** for adults, and separately for children and young people.
4. Whether a **letter in a specific form** is required to trigger the platform's duty.

Open every URL in a browser. Note today's date for `verifiedOn`.

## Steps

1. **Resources.** Create `content/resources/<code>.ts` exporting a `Resource[]` (see [CONTENT-GUIDE.md](CONTENT-GUIDE.md)). Include at least one adult route and one child route. Register it in `content/resources/index.ts` under the uppercase ISO code.
2. **Levers.** Create `content/levers/<code>.ts` exporting a `Lever[]`. Register it in `content/levers/index.ts`. A lever with no letter is fine, for example a regulator that acts for the victim.
3. **Region mapping.** A single country needs nothing in `content/regions.ts`. A new bloc needs an entry there.
4. **Statutory letter (only if the law needs one).**
   - Add `content/letters/<kind>.md` using the placeholders listed in the content guide.
   - Add the kind to the `LetterKind` union, `letterTemplates` and `letterTitles` in `content/letters/index.ts`.
   - Set `letterKind` on the lever. `buildPlan` then uses it in place of the generic platform letter.
   - Make sure a minor gets a safe version. If the law waives identity for child material, handle it in `lib/letters.ts`.
5. **Country picker.** Add the name to `NAMES` and the code to `PACKS` in `components/wizard/country-picker.tsx`.
6. **Tests.** Add to `tests/content.test.ts` (the lever, a dated `verifiedOn`, no dashes), `tests/plan.test.ts` (the letter chosen for that country, and that a minor never gets a copyright letter), and `tests/letters.test.ts` (the required elements).
7. **Run everything.**

```bash
npm test
npm run e2e
```

## Review checklist for a pull request

- Every URL was opened in a browser, and the source is primary.
- Every lever and resource has a `verifiedOn` date.
- A letter contains every legally required element, quoted from the statute in the pull request description.
- Child helplines are `forMinors` and not shown as adult help.
- No em or en dashes, no invented numbers.
- Nothing presents guidance as legal advice.
