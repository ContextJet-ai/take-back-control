"use client";
import { useState } from "react";
import { renderLetter } from "@/lib/letters";
import { letterTitles, type LetterKind } from "@/content/letters";
import { Button } from "@/components/button";
import { buildMailto } from "@/lib/mailto";

export function LetterCard({ kind, platform, urls, email, minor = false }: { kind: LetterKind; platform: string; urls: string[]; email?: string; minor?: boolean }) {
  const [name, setName] = useState("");
  const [extraUrls, setExtraUrls] = useState(urls.join("\n"));
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [contact, setContact] = useState("");
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const text = renderLetter(kind, { platform, urls: extraUrls.split("\n").map((s) => s.trim()).filter(Boolean), date, name, contact, minor });
  const id = `${kind}-${platform.replace(/\s+/g, "-")}`;
  const subject = text.split("\n")[0].replace(/^Subject:\s*/, "");
  const statutory = kind === "take-it-down-notice" || kind === "india-grievance" || kind === "dsa-notice";
  const needsContact = statutory || kind === "dmca-takedown";
  const nameRequired = statutory && !(kind === "dsa-notice" && minor);
  const incomplete = needsContact && ((nameRequired && !name.trim()) || !contact.trim());
  const mail = email ? buildMailto(email, subject, text) : null;

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setCopyFailed(false); setTimeout(() => setCopied(false), 1500); } catch { setCopyFailed(true); }
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
      <label className="text-sm font-medium" htmlFor={`${id}-name`}>{nameRequired ? "Your full name (required)" : "Your name (optional)"}</label>
      <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
      {needsContact && (
        <>
          <label className="text-sm font-medium" htmlFor={`${id}-contact`}>Your contact details (email or postal address, required for a valid notice)</label>
          <input id={`${id}-contact`} value={contact} onChange={(e) => setContact(e.target.value)} className="rounded-card border border-border bg-bg px-3 py-2 text-sm" />
        </>
      )}
      <pre className="whitespace-pre-wrap rounded-card bg-surface p-4 text-sm leading-relaxed">{text}</pre>
      {copyFailed && <p role="alert" className="text-sm text-muted">Copying was blocked by your browser. Select the text above and copy it.</p>}
      <div className="flex gap-3">
        <Button onClick={copy} className="px-4 py-2 text-sm">{copied ? "Copied" : "Copy"}</Button>
        <Button variant="secondary" onClick={download} className="px-4 py-2 text-sm">Download</Button>
        {mail && !mail.tooLong && !incomplete && <a href={mail.href} className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium">Open in your email app</a>}
      </div>
      {incomplete && <p className="text-sm text-muted">Fill in your name and contact details before sending. Platforms can reject a request without them.</p>}
      {mail?.tooLong && <p className="text-sm text-muted">Too long for an email link. Copy it and paste into an email to {email}.</p>}
    </article>
  );
}
