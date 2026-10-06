"use client";
import { useState } from "react";
import { renderLetter } from "@/lib/letters";
import { letterTitles, type LetterKind } from "@/content/letters";
import { Button } from "@/components/button";

export function LetterCard({ kind, platform, urls }: { kind: LetterKind; platform: string; urls: string[] }) {
  const [name, setName] = useState("");
  const [extraUrls, setExtraUrls] = useState(urls.join("\n"));
  const [copied, setCopied] = useState(false);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const text = renderLetter(kind, { platform, urls: extraUrls.split("\n").map((s) => s.trim()).filter(Boolean), date, name });
  const id = `${kind}-${platform.replace(/\s+/g, "-")}`;

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked; user can select text */ }
  }
  function download() {
    try {
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${kind}.txt`; a.click(); URL.revokeObjectURL(a.href);
    } catch { /* copy still works */ }
  }

  return (
    <article className="flex flex-col gap-3 rounded-card border border-border p-5">
      <h4 className="font-semibold">{letterTitles[kind]}<span className="font-normal text-muted"> for {platform}</span></h4>
      <label className="text-sm font-medium" htmlFor={`${id}-urls`}>Links, one per line</label>
      <textarea id={`${id}-urls`} value={extraUrls} onChange={(e) => setExtraUrls(e.target.value)} rows={3} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
      <label className="text-sm font-medium" htmlFor={`${id}-name`}>Your name (optional)</label>
      <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
      <pre className="whitespace-pre-wrap rounded-card bg-surface p-4 text-sm leading-relaxed">{text}</pre>
      <div className="flex gap-3">
        <Button onClick={copy} className="px-4 py-2 text-sm">{copied ? "Copied" : "Copy"}</Button>
        <Button variant="secondary" onClick={download} className="px-4 py-2 text-sm">Download</Button>
      </div>
    </article>
  );
}
