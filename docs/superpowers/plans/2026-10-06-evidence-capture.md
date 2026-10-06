# Evidence Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A page where the person builds a downloadable evidence log in the browser: links, account names, dates, a statement in their own words, and a SHA-256 fingerprint of each screenshot file they choose, with nothing uploaded.

**Architecture:** `lib/evidence.ts` holds two pure functions (hash a file, render a log) with unit tests. `components/evidence/evidence-builder.tsx` is a client component that uses them. `/evidence` is a static page. The plan's "Right now" section links to it. For minors, the page refuses image files and explains why.

**Tech Stack:** WebCrypto `crypto.subtle.digest`, File API, Blob download. No dependencies added.

**Spec:** `docs/superpowers/specs/2026-10-06-roadmap-stress-test.md` section 9.

## Global Constraints

- No file content ever leaves the browser. No fetch calls on this page.
- The log states that timestamps come from the device clock and tells the person to email the log to themselves for a provider timestamp.
- Minor mode (from wizard state) disables file selection with an explanation.
- No em or en dashes.

## Review Focus

1. A 20MB screenshot must hash without freezing the page. Test in Task 1 (hash of a 5MB synthetic buffer completes) and a manual check at 20MB.
2. Selecting the same file twice must not duplicate the entry. Test in Task 2.
3. A log with zero files and only URLs must still download. Test in Task 2.
4. Non-image files (PDF of a chat export) must be accepted. Test in Task 2.
5. Minor mode with wizard state present must hide the file input and still allow the URL log. Test in Task 2.

---

### Task 1: Pure evidence functions

**Files:**
- Create: `lib/evidence.ts`
- Test: `tests/evidence.test.ts`

**Interfaces:**
- Produces:

```ts
export interface EvidenceFile { name: string; size: number; type: string; sha256: string }
export interface EvidenceInput { urls: string[]; accounts: string[]; statement: string; files: EvidenceFile[]; generatedAt: Date; timeZone: string }
export async function hashBytes(data: ArrayBuffer): Promise<string>; // lowercase hex
export async function hashFile(file: Blob): Promise<string>;
export function renderEvidenceLog(input: EvidenceInput): string;
export function renderEvidenceJson(input: EvidenceInput): string;
```

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from "vitest";
import { hashBytes, hashFile, renderEvidenceLog, renderEvidenceJson } from "@/lib/evidence";

const base = { urls: ["https://a.example/p/1"], accounts: ["@someone"], statement: "They posted it on 5 October.", files: [], generatedAt: new Date("2026-10-06T10:00:00Z"), timeZone: "Asia/Kolkata" };

describe("evidence", () => {
  it("hashes bytes to the known SHA-256 of 'abc'", async () => {
    expect(await hashBytes(new TextEncoder().encode("abc").buffer)).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
  it("hashes a Blob the same as its bytes", async () => {
    expect(await hashFile(new Blob(["abc"]))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
  it("hashes a 5MB buffer", async () => {
    const big = new Uint8Array(5 * 1024 * 1024);
    const h = await hashBytes(big.buffer);
    expect(h).toHaveLength(64);
  });
  it("renders a log with every section and the clock caveat", () => {
    const log = renderEvidenceLog({ ...base, files: [{ name: "shot.png", size: 1234, type: "image/png", sha256: "ab".repeat(32) }] });
    expect(log).toContain("Evidence log");
    expect(log).toContain("2026-10-06T10:00:00.000Z");
    expect(log).toContain("Asia/Kolkata");
    expect(log).toContain("https://a.example/p/1");
    expect(log).toContain("@someone");
    expect(log).toContain("They posted it on 5 October.");
    expect(log).toContain("shot.png");
    expect(log).toContain("ab".repeat(32));
    expect(log).toMatch(/device clock/i);
    expect(log).toMatch(/email this log to yourself/i);
    expect(log).not.toMatch(/[–—]/);
  });
  it("renders JSON that round-trips", () => {
    const json = JSON.parse(renderEvidenceJson(base));
    expect(json.urls).toEqual(base.urls);
    expect(json.generatedAt).toBe("2026-10-06T10:00:00.000Z");
  });
});
```

Run: `npm test`
Expected: FAIL, module not found. If `crypto.subtle` is undefined under jsdom, add to `tests/setup.ts`: `import { webcrypto } from "node:crypto"; if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });`

- [ ] **Step 2: Implement**

```ts
// lib/evidence.ts
export interface EvidenceFile { name: string; size: number; type: string; sha256: string }
export interface EvidenceInput { urls: string[]; accounts: string[]; statement: string; files: EvidenceFile[]; generatedAt: Date; timeZone: string }

export async function hashBytes(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashFile(file: Blob): Promise<string> {
  return hashBytes(await file.arrayBuffer());
}

export function renderEvidenceLog(i: EvidenceInput): string {
  const lines: string[] = [];
  lines.push("Evidence log", "");
  lines.push(`Generated: ${i.generatedAt.toISOString()} (time zone ${i.timeZone})`);
  lines.push("Note: this time comes from the device clock. Email this log to yourself now so your email provider records an independent time.", "");
  lines.push("Statement:", i.statement.trim() || "(none)", "");
  lines.push("Links:", ...(i.urls.length ? i.urls : ["(none)"]), "");
  lines.push("Accounts:", ...(i.accounts.length ? i.accounts : ["(none)"]), "");
  lines.push("Files (SHA-256 fingerprints, computed on this device; the files themselves are not included):");
  if (i.files.length === 0) lines.push("(none)");
  for (const f of i.files) lines.push(`${f.name}  ${f.size} bytes  ${f.type || "unknown type"}  sha256=${f.sha256}`);
  lines.push("", "How to use this: keep the original files unchanged. Anyone can recompute the fingerprint of a file and compare it to this log to show the file has not been altered since this time.");
  return lines.join("\n");
}

export function renderEvidenceJson(i: EvidenceInput): string {
  return JSON.stringify({ ...i, generatedAt: i.generatedAt.toISOString() }, null, 2);
}
```

- [ ] **Step 3: Run tests, commit**

Run: `npm test`
Expected: all pass.

```bash
git add lib/evidence.ts tests/evidence.test.ts tests/setup.ts
git commit -m "feat: add pure evidence hashing and log rendering"
```

---

### Task 2: Evidence builder component and page

**Files:**
- Create: `components/evidence/evidence-builder.tsx`, `app/evidence/page.tsx`
- Modify: `components/wizard/plan-view.tsx` (link in "Right now")
- Test: `tests/evidence-builder.test.tsx`, `e2e/evidence.spec.ts`

**Interfaces:**
- Consumes: `hashFile`, `renderEvidenceLog`, `renderEvidenceJson`; `loadState` for minor mode.

- [ ] **Step 1: Failing component tests**

```tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EvidenceBuilder } from "@/components/evidence/evidence-builder";
import { clearState, saveState } from "@/lib/wizard-state";

describe("EvidenceBuilder", () => {
  beforeEach(() => clearState());

  it("hashes a chosen file and lists it once even if chosen twice", async () => {
    render(<EvidenceBuilder />);
    const input = screen.getByLabelText(/add screenshots or files/i) as HTMLInputElement;
    const file = new File(["abc"], "shot.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(screen.getAllByText(/ba7816bf/).length).toBe(1));
  });

  it("accepts a PDF", async () => {
    render(<EvidenceBuilder />);
    const input = screen.getByLabelText(/add screenshots or files/i);
    fireEvent.change(input, { target: { files: [new File(["x"], "chat.pdf", { type: "application/pdf" })] } });
    await waitFor(() => expect(screen.getByText("chat.pdf")).toBeTruthy());
  });

  it("downloads a log with only links", () => {
    const create = vi.fn(() => "blob:x"); const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    render(<EvidenceBuilder />);
    fireEvent.change(screen.getByLabelText(/links/i), { target: { value: "https://a.example/1" } });
    fireEvent.click(screen.getByRole("button", { name: /download log/i }));
    expect(create).toHaveBeenCalled();
  });

  it("hides the file input for minors and explains", () => {
    saveState({ step: 6, answers: { contentType: "image", posted: "yes", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "yes", country: null } });
    render(<EvidenceBuilder />);
    expect(screen.queryByLabelText(/add screenshots or files/i)).toBeNull();
    expect(screen.getByText(/do not save or screenshot the image/i)).toBeTruthy();
  });
});
```

Run: `npm test`
Expected: FAIL.

- [ ] **Step 2: Component**

```tsx
// components/evidence/evidence-builder.tsx
"use client";
import { useEffect, useState } from "react";
import { hashFile, renderEvidenceLog, renderEvidenceJson, type EvidenceFile } from "@/lib/evidence";
import { loadState } from "@/lib/wizard-state";
import { Button } from "@/components/button";

function download(name: string, text: string, type: string) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
  } catch { /* nothing else to do */ }
}

export function EvidenceBuilder() {
  const [urls, setUrls] = useState(""); const [accounts, setAccounts] = useState(""); const [statement, setStatement] = useState("");
  const [files, setFiles] = useState<EvidenceFile[]>([]); const [busy, setBusy] = useState(false);
  const [minor, setMinor] = useState(false);
  useEffect(() => { setMinor(loadState()?.answers.minor === "yes"); }, []);

  async function onFiles(list: FileList | null) {
    if (!list) return; setBusy(true);
    const next = [...files];
    for (const f of Array.from(list)) {
      const sha256 = await hashFile(f);
      if (!next.some((x) => x.sha256 === sha256)) next.push({ name: f.name, size: f.size, type: f.type, sha256 });
    }
    setFiles(next); setBusy(false);
  }
  const input = () => ({ urls: urls.split("\n").map((s) => s.trim()).filter(Boolean), accounts: accounts.split("\n").map((s) => s.trim()).filter(Boolean), statement, files, generatedAt: new Date(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const stamp = () => new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2"><span className="font-medium">Links, one per line</span>
        <textarea rows={4} value={urls} onChange={(e) => setUrls(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2" aria-label="Links, one per line" /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">Account names, one per line</span>
        <textarea rows={2} value={accounts} onChange={(e) => setAccounts(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2" /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">What happened, in your words</span>
        <textarea rows={5} value={statement} onChange={(e) => setStatement(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2" /></label>
      {minor ? (
        <p role="note" className="rounded-card border border-accent bg-surface p-4 text-sm">Because someone in the content is under 18, do not save or screenshot the image itself. The links and account names above are enough for the police and the platforms.</p>
      ) : (
        <label className="flex flex-col gap-2"><span className="font-medium">Add screenshots or files</span>
          <input type="file" multiple aria-label="Add screenshots or files" onChange={(e) => onFiles(e.target.files)} className="text-sm" />
          <span className="text-sm text-muted">Files stay on your device. Only a fingerprint of each one goes in the log.</span></label>
      )}
      {files.length > 0 && (
        <ul className="divide-y divide-border rounded-card border border-border text-sm">
          {files.map((f) => <li key={f.sha256} className="flex flex-col gap-1 p-3"><span className="font-medium">{f.name}</span><span className="break-all text-muted">{f.sha256}</span></li>)}
        </ul>
      )}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => download(`evidence-log-${stamp()}.txt`, renderEvidenceLog(input()), "text/plain")} disabled={busy}>Download log</Button>
        <Button variant="secondary" onClick={() => download(`evidence-log-${stamp()}.json`, renderEvidenceJson(input()), "application/json")} disabled={busy}>Download as JSON</Button>
      </div>
      <p className="text-sm text-muted">Email the log to yourself right away. Your email provider's timestamp is independent of your device clock.</p>
    </div>
  );
}
```

- [ ] **Step 3: Page and link**

```tsx
// app/evidence/page.tsx
import { EvidenceBuilder } from "@/components/evidence/evidence-builder";
import { NoUploadNotice } from "@/components/no-upload-notice";
export const metadata = { title: "Evidence log" };
export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Build an evidence log</h1>
      <p className="mt-2 max-w-[65ch] text-muted">Police, lawyers, and platforms all ask for the same things: where it was, who posted it, when you saw it, and proof the files have not changed. This page makes that record.</p>
      <div className="mt-4"><NoUploadNotice /></div>
      <section className="mt-8 rounded-card border border-border p-5 text-sm">
        <h2 className="font-semibold">Taking a useful screenshot</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Include the address bar or the account name and the post date in the frame.</li>
          <li>Phone: press the side button and volume up together. Desktop: Shift+Cmd+4 on Mac, Win+Shift+S on Windows.</li>
          <li>Do not edit or crop the screenshot afterwards. Add it here as it is.</li>
        </ul>
      </section>
      <div className="mt-8"><EvidenceBuilder /></div>
    </div>
  );
}
```

In `plan-view.tsx`, inside the "Right now" section after the list:

```tsx
        <p className="text-sm"><Link href="/evidence" className="font-medium text-accent underline">Build an evidence log</Link> with links, dates, and file fingerprints. Nothing is uploaded.</p>
```

- [ ] **Step 4: e2e**

```ts
// e2e/evidence.spec.ts
import { test, expect } from "@playwright/test";
test("evidence log downloads with a file fingerprint", async ({ page }) => {
  await page.goto("/evidence");
  await page.getByLabel("Links, one per line").fill("https://a.example/1");
  await page.getByLabel("Add screenshots or files").setInputFiles({ name: "shot.png", mimeType: "image/png", buffer: Buffer.from("abc") });
  await expect(page.getByText(/ba7816bf/)).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download log" }).click();
  const file = await dl;
  const text = await (await file.createReadStream()).toArray().then((c) => Buffer.concat(c).toString());
  expect(text).toContain("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  expect(text).toContain("https://a.example/1");
});
```

Run: `npm test && npm run e2e`
Expected: all pass. Manually choose a 20MB file in the dev server and confirm the page stays responsive.

- [ ] **Step 5: Commit**

```bash
git add components/evidence app/evidence components/wizard/plan-view.tsx tests/evidence-builder.test.tsx e2e/evidence.spec.ts
git commit -m "feat: add client-side evidence log builder"
```

## Self-review

Spec coverage: hashes, timestamps, statement, download, clock caveat, minor refusal, link from plan. Review Focus 1 to 5 covered by named tests (item 1 partly manual at 20MB, stated). Types consistent across tasks. No placeholders.
