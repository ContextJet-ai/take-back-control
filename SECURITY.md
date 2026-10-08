# Security policy

## Reporting a vulnerability

Please report privately. Use the **Security** tab of this repository, then **Report a vulnerability**. Do not open a public issue for a security problem.

Include what you found, how to reproduce it, and the impact. **Never include real victim data.**

We read every report and respond on a best-effort basis. There is no bounty.

## What matters most here

Because this site is used by people in a vulnerable moment, we treat these as serious:

- anything that sends a person's answers, files or letter text off their device
- anything that lets a page, link or extension read stored answers
- a way to bypass or weaken the content security policy or other headers
- cross-site scripting or injection, including through content files or letter templates
- Quick exit failing to clear state, or state reappearing after exit
- a dependency with a known exploitable vulnerability

## Out of scope

- The privacy limits listed in [docs/PRIVACY-AND-SECURITY.md](docs/PRIVACY-AND-SECURITY.md#what-this-does-not-protect), such as browser history on a shared device
- Reports about third-party sites we link to
- Missing headers on a host you configured yourself

## Supported versions

Only the latest commit on `main`.
