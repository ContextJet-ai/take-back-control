import { EvidenceBuilder } from "@/components/evidence/evidence-builder";
import { NoUploadNotice } from "@/components/no-upload-notice";
export const metadata = { title: "Evidence log" };
export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Build an evidence log</h1>
      <p className="mt-2 max-w-[65ch] text-muted">Police, lawyers, and platforms all ask for the same things: where it was, who posted it, when you saw it, and a fingerprint that shows the files have not been altered since you made the log. This page makes that record.</p>
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
