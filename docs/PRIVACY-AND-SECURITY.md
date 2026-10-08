# Privacy and security

The strongest protection is that there is almost nothing to protect. The site collects no personal data, so there is no database to breach, no log to subpoena and no account to take over.

## What is stored, and where

| Data | Location | Leaves the device? |
|---|---|---|
| Wizard answers | `sessionStorage` (`wizard`) and memory | No |
| Checklist ticks | `sessionStorage` (`plan-progress`) and memory | No |
| Letter text the person edits | React state | No, unless they send it from their own email app |
| Evidence log text and file fingerprints | React state; the person may download it | No |
| Files chosen for the evidence log | Read in the browser to compute SHA-256 | **Never read by a server** |

There are no cookies, no `localStorage`, no analytics, no tracking pixels, no third-party scripts and no remote fonts. The app makes no network requests of its own. External links open in a new tab with `noopener noreferrer`.

`sessionStorage` is wiped when the tab closes and by Quick exit.

## Safeguards built in

- **Quick exit** on every page and Escape twice. It clears state, replaces the history entry and leaves. A back-forward-cache guard reloads if the page is restored.
- **Headers** (`next.config.ts`): a content security policy limited to the site itself, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a `Permissions-Policy` denying camera, microphone and location.
- **`/plan` is `noindex`**, and `robots.txt` disallows it.
- **Under-18 safeguards**: no file input in the evidence log, a warning never to forward or save the image, and a plan that never sends a young person to StopNCII.
- **No secrets in the repository.** A test fails the build if any tracked file looks like it holds an API key, if an environment file is tracked, or if app code reads an environment variable.

## What this does not protect

Be honest with the people using it:

- **Browser history.** Visiting the site is visible in the browser's history on that device. Private browsing helps. Quick exit does not delete history.
- **A compromised or monitored device**, including spyware, shared accounts or someone watching the screen.
- **Network observers** can see that the person visited the site, though not what they entered.
- **Your host's logs.** Whatever platform serves the site may keep ordinary server logs such as IP addresses. Choose and configure a host accordingly. See [DEPLOYMENT.md](DEPLOYMENT.md).
- **Email.** Letters open in the person's own email client. Their provider handles that message.
- **Downloaded evidence logs** are ordinary files on the device.

## Content security policy note

The policy allows inline scripts and styles because the framework's hydration needs them. Tightening this with per-request nonces is a known improvement. There is no user-generated content, so the exposure is limited.

## Reporting a vulnerability

See [SECURITY.md](../SECURITY.md). Never include real victim data in a report.
