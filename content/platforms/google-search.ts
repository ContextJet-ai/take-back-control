import type { Platform } from "../types";
export const googleSearch: Platform = {
  slug: "google-search",
  name: "Google Search",
  contentTypes: ["image", "video"],
  reportUrl: "https://support.google.com/websearch/troubleshooter/3111061",
  steps: [
    "Open the removal troubleshooter linked above.",
    "Choose that you want to remove intimate images shared without consent.",
    "Paste the link to each search result and the page it points to.",
    "Submit. Google emails you when the result is removed.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within a few days.",
  escalation: "If a result remains after a week, submit again with the exact search terms that show it.",
  notes: "This removes results from Google, not the page itself. Report the page to its platform or host as well.",
};
