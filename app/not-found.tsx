import Link from "next/link";
import { Button } from "@/components/button";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">That link does not go anywhere. The <Link href="/platforms" className="text-accent underline">platform guides</Link> and <Link href="/resources" className="text-accent underline">resources</Link> are still here.</p>
      <div className="mt-8"><Button href="/start">Start</Button></div>
    </div>
  );
}
