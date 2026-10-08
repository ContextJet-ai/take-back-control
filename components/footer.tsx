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
        <nav aria-label="Site" className="flex flex-col">
          <Link href="/start" className="inline-flex min-h-[44px] items-center hover:text-accent">Start</Link>
          <Link href="/platforms" className="inline-flex min-h-[44px] items-center hover:text-accent">Platforms</Link>
          <Link href="/resources" className="inline-flex min-h-[44px] items-center hover:text-accent">Resources</Link>
          <Link href="/evidence" className="inline-flex min-h-[44px] items-center hover:text-accent">Evidence log</Link>
        </nav>
        <nav aria-label="About" className="flex flex-col">
          <Link href="/about" className="inline-flex min-h-[44px] items-center hover:text-accent">About</Link>
          <Link href="/privacy" className="inline-flex min-h-[44px] items-center hover:text-accent">Privacy</Link>
        </nav>
        <p className="sm:col-span-3">Made with care by{" "}<a href="https://contextjetai.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-medium text-fg underline hover:text-accent">ContextJet AI</a>.</p>
        <p className="sm:col-span-3">Need to leave fast? Use the Quick exit button. On a computer, pressing Escape twice does the same.</p>
      </div>
    </footer>
  );
}
