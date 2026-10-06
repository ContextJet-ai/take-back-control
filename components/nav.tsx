import Link from "next/link";
import { Button } from "./button";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">Take Back Control</Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/platforms" className="hidden sm:inline">Platforms</Link>
          <Link href="/resources" className="hidden sm:inline">Resources</Link>
          <Button href="/start" className="px-4 py-2 text-sm">Start</Button>
        </div>
      </nav>
    </header>
  );
}
