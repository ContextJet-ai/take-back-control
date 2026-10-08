import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./button";
import { QuickExitBar } from "./quick-exit";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Take Back Control, home" className="flex min-h-[44px] items-center gap-2 font-semibold tracking-tight">
          <ShieldCheck size={22} weight="fill" className="text-accent" aria-hidden="true" />
          <span className="sm:hidden">TBC</span>
          <span className="hidden sm:inline">Take Back Control</span>
        </Link>
        <div className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/platforms" className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent">Platforms</Link>
          <Link href="/resources" className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent">Resources</Link>
          <Button href="/start" className="px-4 py-2 text-sm">Start</Button>
        </div>
      </nav>
      <QuickExitBar />
    </header>
  );
}
