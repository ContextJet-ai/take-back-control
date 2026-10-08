# Roadmap Stress Test

Date: 2026-10-06
Scope: the ten follow-on ideas, each tested against what we can verify today. Verdicts: BUILD (plan written), BUILD LATER (needs a decision or a dependency first), REDESIGN (the idea survives but not in its original form), BLOCKED (cannot be done by us).

Facts established by research on 2026-10-06, each linked in the References section:

- StopNCII is run by SWGfL, a UK charity, with Meta's technology and funding. It is not a government service. Its FAQ says it accepts hashes only from the person in the content, and the only integration it offers is for platforms that consume hashes. Partnership contact: partner@swgfl.org.uk. Non-platform supporters contribute by signposting.
- NCMEC Take It Down works the same way: hashes go to a list that platforms consume. No third-party submission route.
- Meta's PDQ hash has a WebAssembly build on npm (`@amedee/pdq`), so client-side hashing is a solved problem.
- The Bing Visual Search API was retired on 11 August 2025. TinEye is the only commercial reverse-image API with public pricing: USD 200 per 5,000 searches, and TinEye Alerts at USD 300 per year for 500 monitored images with weekly crawls. Both require uploading the image to TinEye.
- The US TAKE IT DOWN Act has been enforced by the FTC since 19 May 2026. Platforms must remove within 48 hours of a valid request. A valid request needs a signature, information to locate the content, contact details, and a statement that the depiction is non-consensual.
- India's IT Rules 2021, Rule 3(2)(b), require intermediaries to remove intimate imagery within 24 hours of a complaint. Every intermediary must publish a grievance officer. Complaints also go to cybercrime.gov.in and the 1930 helpline.
- Australia's eSafety Commissioner takes image-based abuse reports directly, contacts the platform, and issues removal notices with a 24-hour deadline. Reports can be made on behalf of someone else.
- The UK treats sharing intimate images without consent as a priority offence under the Online Safety Act (section 66B of the Sexual Offences Act 2003). The Revenge Porn Helpline achieved a 94 percent removal rate on 20,800 images in 2025.
- EU trusted-flagger status is granted by a Digital Services Coordinator to a legal entity established in that member state, for two years, renewable. Individuals cannot hold it.

## 1. Direct StopNCII hashing inside the plan

**Verdict: BLOCKED as described. REDESIGN as a supporter partnership.**

What kills it: StopNCII will not accept a hash from anyone but the person depicted, through their own site, and offers no API for that. StopNCII is run by a UK charity, not a government body, so there is no government API to request. Hashing locally is easy; submission is the whole problem.

What survives: SWGfL lists supporters who signpost to StopNCII. Becoming a listed supporter gives credibility and a direct contact for escalations. The practical product change is a tighter hand-off: pre-explain the StopNCII flow screen by screen so the person arrives ready, and open it in a new tab from the plan.

Action: email partner@swgfl.org.uk describing this site and asking to be listed as a supporter, and asking whether a referral link or case-reference scheme exists for support organisations. Zero code until they reply.

## 2. Encrypted case tracking

**Verdict: BUILD LATER. Needs one decision from you.**

What kills it: the site's entire trust story is "nothing is uploaded". The moment we store anything server-side, even encrypted, that sentence becomes a paragraph, and a breach becomes possible. Passphrase-encrypted storage with the key derived client-side is sound, but passphrase loss means total loss, and people in crisis forget passphrases.

Stress points: key derivation in the browser (WebCrypto PBKDF2 or Argon2 via WASM), zero-knowledge server (it stores ciphertext and nothing else), no account recovery by design, retention limits, jurisdiction of the database.

Alternative that keeps the promise: a local-only case file. Export an encrypted JSON file the person keeps, re-import to continue. No server. Covers 80 percent of the value (a record of what was sent where) without storing anything.

Open decision: a server-side encrypted store, or a local encrypted file. Recommended: the local file first. It ships in days and does not change the privacy statement.

## 3. Automated takedown sending

**Verdict: BUILD LATER. Depends on item 2 and has a legal wrinkle.**

What kills it: sending email from our domain means the platform's reply comes to us, not the person. We then hold correspondence about a specific person's intimate images. That needs a privacy policy, a data-retention rule, and a lawful basis under GDPR for EU users and under the DPDP Act for Indian users.

Second wrinkle: the TAKE IT DOWN Act requires the request to carry the person's signature and contact details. A request sent from our address on their behalf may not qualify. The safe form is a `mailto:` link that opens the person's own mail client with the letter prefilled, so the email comes from them. That works today with no backend.

Action: add `mailto:` buttons to letter cards now (folded into the country-pack plan, since the abuse addresses live in platform data). Revisit true automated sending only if item 2 chooses server-side storage.

## 4. Search-engine monitoring

**Verdict: REDESIGN. The original idea breaks the privacy promise.**

What kills it: every reverse-image service needs the image. Uploading the person's intimate image to TinEye from our server contradicts "nothing leaves your device", and TinEye's terms do not promise to discard uploads. Bing's API no longer exists. Google Lens has no API.

What survives: guided self-monitoring. The person runs the check themselves on TinEye or Google Lens, in their own browser, with step-by-step instructions, and the site schedules reminders (local notifications, no server). We never touch the image. A second survivor: URL-based monitoring. For URLs the person already reported, a serverless check that fetches the page and reports whether the content is still up. That touches no images, only URLs the person gave us, and tells them when a takedown actually landed.

Plan: write after item 2's decision, because URL monitoring needs somewhere to keep the URL list between visits.

## 5. Country packs

**Verdict: BUILD. Plan written.**

Stress points survived: the content model already has regions. The real value is not helplines but statutory levers that come with their own letter form. Four of them are strong enough to change outcomes: the US 48-hour notice, India's 24-hour grievance rule, Australia's eSafety scheme, and the EU DSA Article 16 notice. The UK pack is mostly referral to the Revenge Porn Helpline, which outperforms anything we can do.

Risk: legal drift. Laws change. Mitigation: each pack carries a `verifiedOn` date shown to the person, and a quarterly check is a maintenance task, not a feature.

Plan: `docs/superpowers/plans/2026-10-06-country-packs.md`

## 6. Trusted-flagger status

**Verdict: BLOCKED for now.**

Requires a legal entity established in an EU member state with a track record of accurate notices. ContextJet-ai is not that entity. Revisit if an EU partner organisation wants to co-operate the site, or once the site has a year of reporting history that an EU NGO could adopt.

## 7. Human support channel

**Verdict: BUILD LATER, as referral only.**

Running a helpline is a staffing commitment with safeguarding obligations. Not a code task. What ships now: country-specific referral to existing helplines is already in the country-pack plan. A callback-request form would hold personal data and is out until item 2 is decided.

## 8. Minors' path hardening

**Verdict: BUILD. Plan written.**

Stress points: a minor who is being sextorted needs a different plan from a minor whose image was posted. The current site collapses both. Two legal traps the current plan ignores: forwarding the image to anyone, including a parent or the police, is itself distribution of CSAM in most countries, and the site must say so plainly. And a minor must never be told to use StopNCII, which the plan already handles.

Plan: `docs/superpowers/plans/2026-10-06-minors-path.md`

## 9. Evidence capture tool

**Verdict: BUILD. Plan written.**

Stress points: a court-grade evidence bundle needs more than a screenshot. It needs the URL, the capture time, a hash of each file, and a statement from the person. All of that can be produced in the browser with WebCrypto and the File API. Nothing is uploaded. The one thing we cannot do client-side is a trusted timestamp; we state the device clock and tell the person to also email the bundle to themselves, which gives a provider-timestamped copy.

Plan: `docs/superpowers/plans/2026-10-06-evidence-capture.md`

## 10. Translations

**Verdict: BUILD LATER, after country packs.**

Mechanically easy once a locale field exists. The blocker is review: machine translation of legal and crisis text without a native reviewer is worse than English. Each language needs a named reviewer before it ships.

## 11. Guided chatbot (secondary item)

**Verdict: BUILD LATER, after country packs, with hard guardrails. Design below.**

Why it earns a place: the wizard handles the common cases in six questions, but people arrive with situations the wizard cannot branch on ("my ex has the photos on a laptop I still have access to", "the site is in Russian", "I am a teacher and a student came to me"). A grounded assistant that answers from our own content and routes to the right service gives people one place to go for everything they need.

What kills the naive version:

- **Privacy.** Every message goes to a model provider. That contradicts "nothing you enter is uploaded". The chatbot must be opt-in, behind a plain statement of what leaves the device, and it must never ask for or accept images. Text only, and we tell the person not to paste names or links they would not want a third party to see.
- **Wrong legal advice.** A model that improvises a statute is worse than no answer. The assistant answers only from our content files and the stress-test references, cites which page it drew from, and says "I do not know, here is who does" when outside that.
- **Crisis.** People in this situation express suicidal intent. The assistant must detect that and put crisis lines at the top of the reply, every time, before anything else.
- **Minors.** The assistant must never instruct a minor to use StopNCII, must never suggest sending the image to anyone, and must route to Take It Down and a child helpline.
- **Cost and abuse.** Unauthenticated, free chat gets scraped. Rate limit by IP, cap conversation length, no history retained server-side.

Design that survives:

- A server route (the site's first) that forwards the conversation to the Claude API with a system prompt built from the content files, a retrieval step over the same files, and strict instructions to cite and to refuse outside scope. No conversation is stored. Logs hold counts, not text.
- Client: a panel on the plan page and the landing page, closed by default, opening with the privacy statement and an "I understand" step. Conversation lives in memory only and is cleared by quick exit.
- Safety layer before the model: keyword and classifier check for self-harm and for minor indicators, which prepends crisis resources and switches the system prompt to the minors variant.
- Evaluation: a fixed set of 60 scripted situations (adult, minor, sextortion, crisis, out-of-scope, prompt injection) run on every content change. The assistant fails the build if it ever recommends StopNCII to a minor, invents a URL not in our content, or omits crisis lines on a crisis prompt.

Full design with stack decision, route handler sketch, safety layer, eval, and cost: `docs/superpowers/specs/2026-10-06-chatbot-design.md`. Dependencies: country packs first, an Anthropic API key, and your approval of the privacy statement change.

## Order of execution

1. Minors' path (smallest, highest harm if wrong, no dependencies)
2. Evidence capture (client-only, used by every path)
3. Country packs (largest content task; includes `mailto:` sending)
4. Email SWGfL in parallel, today
5. Decide on case storage, then plan items 2, 4 and 7
6. Chatbot (item 11) once the country packs exist to ground it

## References

- StopNCII FAQ: https://stopncii.org/faq/
- StopNCII partners and supporters: https://stopncii.org/about-us/
- SWGfL PhotoDNA and partners: https://swgfl.org.uk/magazine/stopncii-announces-photodna-integration-and-niantic-as-new-industry-partner/
- Take It Down: https://takeitdown.ncmec.org/faq/
- PDQ WebAssembly: https://npmjs.com/package/@amedee/pdq
- Bing Search API retirement: https://learn.microsoft.com/en-us/lifecycle/announcements/bing-search-api-retirement
- TinEye pricing: https://blog.tineye.com/new-image-search-pricing/
- TAKE IT DOWN Act in effect: https://www.finnegan.com/en/insights/articles/the-take-it-down-act-is-now-in-full-effect-what-platforms-need-to-know.html
- India Rule 3(2)(b): https://theleaflet.in/why-india-needs-a-robust-content-deletion-procedure-to-repress-revenge-pornography/
- eSafety image-based abuse: https://www.esafety.gov.au/report/image-based-abuse
- UK priority offence: https://www.mishcon.com/news/online-safety-act-reforms-tackling-intimate-image-abuse-and-revenge-porn-come-into-force
- Revenge Porn Helpline 2025 report: https://swgfl.org.uk/magazine/revenge-porn-helpline-handles-record-number-of-cases-in-2025/
- DSA trusted flaggers: https://lausen.com/en/the-trusted-flaggers-in-the-digital-services-act/
