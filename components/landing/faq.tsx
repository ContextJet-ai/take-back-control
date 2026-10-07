import { Plus } from "@phosphor-icons/react/dist/ssr";

export const FAQ_ITEMS = [
  { q: "Is anything I type or choose uploaded?", a: "No. Your answers stay in your browser for this visit and are cleared when you close the tab or press Quick exit. There are no accounts, no tracking, and no analytics. Links to other sites open in a new tab and follow their own privacy rules." },
  { q: "How is this different from StopNCII?", a: "StopNCII makes a fingerprint of your images on your device so partner platforms can block them. It cannot remove what is already posted. This site covers that part: who to report to, how, and the letters to send. Your plan links you to StopNCII for the blocking step." },
  { q: "Is it free?", a: "Yes. There is nothing to pay and no sign-up. Be wary of anyone who offers to remove images for a fee." },
  { q: "What if I am under 18?", a: "Answer yes to the under-18 question and you get a plan built for you: Take It Down from NCMEC, steps for sextortion, and child helplines in your country. Never forward or save the image, even to get help. Show the account or give the link instead." },
  { q: "What if the platform ignores my report?", a: "Every platform guide has a next step. Many countries also give you a regulator or a legal deadline, such as 48 hours in the US, 24 hours in India, or an eSafety removal notice in Australia. Your plan shows the ones for your country." },
  { q: "Is this legal advice?", a: "No. It is practical guidance gathered from official sources and checked on the date shown beside each item. For advice about your case, speak to a lawyer or one of the helplines on the resources page." },
  { q: "Can someone else use this on my behalf?", a: "You can sit with a friend and go through it together. StopNCII itself only accepts hashes from the person in the images, and some platforms need to hear from you directly. Australia's eSafety Commissioner does accept reports made for someone else." },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="mx-auto max-w-3xl px-4 py-16">
      <h2 id="faq-h" className="text-3xl font-semibold tracking-tight">Questions people ask first.</h2>
      <div className="mt-8 divide-y divide-border rounded-card border border-border bg-surface-solid">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} className="group px-5">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus size={18} weight="bold" className="shrink-0 text-accent transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="max-w-[62ch] pb-5 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
