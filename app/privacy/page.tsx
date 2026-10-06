export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 text-[1.0625rem]">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <ul className="mt-4 max-w-[65ch] list-disc space-y-2 pl-5 leading-relaxed">
        <li>Your answers stay in your browser&apos;s session storage and are deleted when you close the tab or press Quick exit.</li>
        <li>Nothing is sent to a server. There are no accounts, cookies, or analytics.</li>
        <li>Links to other sites open in a new tab. Their privacy policies apply there.</li>
        <li>Fonts are served from this site, not from a third party.</li>
      </ul>
    </article>
  );
}
