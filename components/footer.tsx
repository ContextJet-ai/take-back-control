import Link from "next/link";
import { NoUploadNotice } from "./no-upload-notice";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <NoUploadNotice />
        <div className="flex flex-wrap gap-6">
          <Link href="/platforms">Platforms</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
