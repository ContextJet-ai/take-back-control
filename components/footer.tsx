import Link from "next/link";
import { NoUploadNotice } from "./no-upload-notice";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-muted sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-fg">Take Back Control</span>
          <NoUploadNotice />
        </div>
        <nav aria-label="Site" className="flex flex-col gap-2">
          <Link href="/start" className="hover:text-accent">Start</Link>
          <Link href="/platforms" className="hover:text-accent">Platforms</Link>
          <Link href="/resources" className="hover:text-accent">Resources</Link>
          <Link href="/evidence" className="hover:text-accent">Evidence log</Link>
        </nav>
        <nav aria-label="About" className="flex flex-col gap-2">
          <Link href="/about" className="hover:text-accent">About</Link>
          <Link href="/privacy" className="hover:text-accent">Privacy</Link>
        </nav>
        <p className="sm:col-span-3">Need to leave fast? Use the Quick exit button. On a computer, pressing Escape twice does the same.</p>
      </div>
    </footer>
  );
}
