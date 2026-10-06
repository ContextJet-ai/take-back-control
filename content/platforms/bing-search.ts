import type { Platform } from "../types";
export const bingSearch: Platform = {
  slug: "bing-search",
  name: "Bing Search",
  contentTypes: ["image", "video"],
  reportUrl: "https://www.bing.com/webmaster/tools/eu-privacy-request",
  steps: [
    "Open the request form linked above.",
    "Choose the option for non-consensual intimate images.",
    "Paste the link to each search result and the page it points to.",
    "Submit. Bing emails you about the outcome.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within a few days.",
  escalation: "If a result remains after a week, submit the form again with the search terms that show it.",
  notes: "This removes results from Bing, not the page itself.",
};
