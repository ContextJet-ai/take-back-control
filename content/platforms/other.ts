import type { Platform } from "../types";
export const other: Platform = {
  slug: "other",
  name: "Another website",
  contentTypes: ["image", "video"],
  reportUrl: "https://lookup.icann.org/",
  steps: [
    "Look for an abuse or contact email in the site's terms, privacy page, or footer. Send the hosting provider letter from your plan to it.",
    "If there is no contact, open the ICANN lookup linked above and search the site's domain.",
    "Use the abuse email listed for the registrar or hosting company, and send the same letter there.",
    "Keep every email you send and receive. If nothing happens in a week, ask Google and Bing to remove the page from search.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Depends on the host. Reputable hosts act within a few days.",
  escalation: "If the host ignores you, report the site to your country's police cybercrime unit and ask search engines to de-index it.",
};
