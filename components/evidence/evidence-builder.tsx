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

const field = "rounded-card border border-border bg-bg px-3 py-2";

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
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  const input = () => ({ urls: lines(urls), accounts: lines(accounts), statement, files, generatedAt: new Date(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const stamp = () => new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2"><span className="font-medium">Links, one per line</span>
        <textarea rows={4} value={urls} onChange={(e) => setUrls(e.target.value)} className={field} /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">Account names, one per line</span>
        <textarea rows={2} value={accounts} onChange={(e) => setAccounts(e.target.value)} className={field} /></label>
      <label className="flex flex-col gap-2"><span className="font-medium">What happened, in your words</span>
        <textarea rows={5} value={statement} onChange={(e) => setStatement(e.target.value)} className={field} /></label>
      {minor ? (
        <p role="note" className="rounded-card border border-accent bg-surface p-4 text-sm">Because someone in the content is under 18, do not save or screenshot the image itself. The links and account names above are enough for the police and the platforms.</p>
      ) : (
        <label className="flex flex-col gap-2"><span className="font-medium">Add screenshots or files</span>
          <input type="file" multiple onChange={(e) => onFiles(e.target.files)} className="text-sm" />
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
      <p className="text-sm text-muted">Email the log to yourself right away. Your email provider&apos;s timestamp is independent of your device clock.</p>
    </div>
  );
}
