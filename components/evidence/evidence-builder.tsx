"use client";
import { useEffect, useMemo, useState } from "react";
import { hashFile, renderEvidenceLog, renderEvidenceJson, MAX_HASH_BYTES, type EvidenceFile } from "@/lib/evidence";
import { loadState } from "@/lib/wizard-state";
import { Button } from "@/components/button";

function download(name: string, text: string, type: string): boolean {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch { return false; }
}

const field = "rounded-card border border-border bg-bg px-3 py-2";
type MinorState = "unknown" | "yes" | "no";

export function EvidenceBuilder() {
  const [urls, setUrls] = useState(""); const [accounts, setAccounts] = useState(""); const [statement, setStatement] = useState(""); const [firstSeen, setFirstSeen] = useState("");
  const [files, setFiles] = useState<EvidenceFile[]>([]); const [busy, setBusy] = useState(false); const [skipped, setSkipped] = useState(0);
  const [minor, setMinor] = useState<MinorState | null>(null);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => { const s = loadState(); setMinor(!s ? "unknown" : s.answers.minor === "yes" ? "yes" : "no"); }, []);

  async function onFiles(list: FileList | null) {
    if (!list) return; setBusy(true);
    for (const f of Array.from(list)) {
      const sha256 = f.size > MAX_HASH_BYTES ? "" : await hashFile(f);
      const entry: EvidenceFile = { name: f.name, size: f.size, type: f.type, sha256, lastModified: f.lastModified };
      setFiles((prev) => {
        const dup = sha256 ? prev.some((x) => x.sha256 === sha256) : prev.some((x) => x.name === f.name && x.size === f.size);
        if (dup) { setSkipped((n) => n + 1); return prev; }
        return [...prev, entry];
      });
    }
    setBusy(false);
  }
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  const input = useMemo(() => ({ urls: lines(urls), accounts: lines(accounts), statement, firstSeen, files, generatedAt: new Date(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }), [urls, accounts, statement, firstSeen, files]);
  const logText = renderEvidenceLog(input);
  const stamp = () => new Date().toISOString().slice(0, 10);

  async function copy() {
    try { await navigator.clipboard.writeText(logText); setCopied("done"); setTimeout(() => setCopied("idle"), 1500); } catch { setCopied("failed"); }
  }

  const caution = "If anyone in it is under 18, including you at the time, do not save or screenshot the image. Log the links and account names only.";

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2"><span className="font-medium">Links, one per line</span>
        <textarea rows={4} value={urls} onChange={(e) => setUrls(e.target.value)} className={field} /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">Account names, one per line</span>
        <textarea rows={2} value={accounts} onChange={(e) => setAccounts(e.target.value)} className={field} /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">When did you first see it?</span>
        <input value={firstSeen} onChange={(e) => setFirstSeen(e.target.value)} className={field} placeholder="Date and rough time, for example 5 October, about 9pm" /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">What happened, in your words</span>
        <span className="text-sm text-muted">Include how you found it and who you think posted it.</span>
        <textarea rows={5} value={statement} onChange={(e) => setStatement(e.target.value)} className={field} /></label>

      {minor === "yes" && (
        <p role="note" className="rounded-card border border-accent bg-surface p-4 text-sm">Because someone in the content is under 18, do not save or screenshot the image itself. The links and account names above are enough for the police and the platforms.</p>
      )}
      {minor === "unknown" && <p role="note" className="rounded-card border border-accent bg-surface p-4 text-sm">{caution}</p>}
      {(minor === "no" || minor === "unknown") && (
        <label className="flex flex-col gap-2"><span className="font-medium">Add screenshots or files</span>
          <input type="file" multiple disabled={busy} onChange={(e) => onFiles(e.target.files)} className="text-sm" />
          <span className="text-sm text-muted">Files stay on your device. Only a fingerprint of each one goes in the log. Files over 100MB are listed without a fingerprint.</span></label>
      )}
      {busy && <p className="text-sm text-muted" aria-live="polite">Fingerprinting files...</p>}
      {skipped > 0 && <p className="text-sm text-muted">Skipped {skipped} file{skipped === 1 ? "" : "s"} already in the list.</p>}
      {files.length > 0 && (
        <ul className="divide-y divide-border rounded-card border border-border text-sm" aria-busy={busy}>
          {files.map((f) => <li key={f.sha256 || `${f.name}-${f.size}`} className="flex flex-col gap-1 p-3"><span className="font-medium">{f.name}</span><span className="break-all text-muted">{f.sha256 || "Too large to fingerprint. Listed by name and size."}</span></li>)}
        </ul>
      )}

      <label className="flex flex-col gap-2"><span className="font-medium">Log text</span>
        <textarea readOnly rows={10} value={logText} className={`${field} font-mono text-xs`} aria-label="Log text" /></label>
      <div className="flex flex-wrap gap-3">
        <Button onClick={copy} disabled={busy}>{copied === "done" ? "Copied" : "Copy log"}</Button>
        <Button variant="secondary" onClick={() => download(`evidence-log-${stamp()}.txt`, logText, "text/plain")} disabled={busy}>Download log</Button>
        <Button variant="secondary" onClick={() => download(`evidence-log-${stamp()}.json`, renderEvidenceJson(input), "application/json")} disabled={busy}>Download as JSON</Button>
      </div>
      {copied === "failed" && <p className="text-sm text-muted">Copying was blocked. Select the log text above and copy it by hand.</p>}
      <p className="text-sm text-muted">Email the log to yourself right away. Your email provider&apos;s timestamp is independent of your device clock. The download is saved to this device. If you share this device, email it and then delete the copy here.</p>
    </div>
  );
}
