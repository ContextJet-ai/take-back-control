import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4"><Link href="/platforms" className="text-accent underline">See the platform guides</Link> or <Link href="/start" className="text-accent underline">start the wizard</Link>.</p>
    </div>
  );
}
