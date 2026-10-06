export interface EvidenceFile { name: string; size: number; type: string; sha256: string; lastModified: number }
export interface EvidenceInput { urls: string[]; accounts: string[]; statement: string; firstSeen: string; files: EvidenceFile[]; generatedAt: Date; timeZone: string }

export const MAX_HASH_BYTES = 100 * 1024 * 1024;

export async function hashBytes(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashFile(file: Blob): Promise<string> {
  return hashBytes(await file.arrayBuffer());
}

function localTime(d: Date, timeZone: string): string {
  try { return d.toLocaleString("en-GB", { timeZone, dateStyle: "medium", timeStyle: "short" }); } catch { return d.toISOString(); }
}

export function renderEvidenceLog(i: EvidenceInput): string {
  const lines: string[] = [];
  lines.push("Evidence log", "");
  lines.push(`Generated: ${i.generatedAt.toISOString()} (${localTime(i.generatedAt, i.timeZone)} in time zone ${i.timeZone})`);
  lines.push("Note: this time comes from the device clock. Email this log to yourself now so your email provider records an independent time.", "");
  lines.push(`First seen: ${i.firstSeen.trim() || "(not given)"}`, "");
  lines.push("Statement:", i.statement.trim() || "(none)", "");
  lines.push("Links:", ...(i.urls.length ? i.urls : ["(none)"]), "");
  lines.push("Accounts:", ...(i.accounts.length ? i.accounts : ["(none)"]), "");
  lines.push("Files (SHA-256 fingerprints, computed on this device; the files themselves are not included):");
  if (i.files.length === 0) lines.push("(none)");
  for (const f of i.files) {
    const when = f.lastModified ? new Date(f.lastModified).toISOString() : "unknown";
    const hash = f.sha256 ? `sha256=${f.sha256}` : "sha256=(not computed, file too large)";
    lines.push(`${f.name}  ${f.size} bytes  ${f.type || "unknown type"}  file time=${when}  ${hash}`);
  }
  lines.push("", "How to use this: keep the original files unchanged. Anyone can recompute the fingerprint of a file and compare it to this log to show the file has not been altered since this time.");
  lines.push("Recompute on a Mac or Linux: shasum -a 256 FILE. On Windows: certutil -hashfile FILE SHA256.");
  return lines.join("\n");
}

export function renderEvidenceJson(i: EvidenceInput): string {
  return JSON.stringify({ ...i, generatedAt: i.generatedAt.toISOString() }, null, 2);
}
