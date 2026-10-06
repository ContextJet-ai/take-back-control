import type { Platform } from "../types";
export const bingSearch: Platform = {
  slug: "bing-search",
  name: "Bing Search",
  contentTypes: ["image", "video"],
  reportUrl: "https://www.microsoft.com/digitalsafety/report-a-concern",
  steps: [
    "Open Microsoft's Report a concern form linked above and press Continue.",
    "Choose Bing as the service and paste the link to the search result or page.",
    "On the next step choose the option for intimate images shared without consent, then describe how to identify you.",
    "Submit. Microsoft emails you about the outcome.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within a few days.",
  escalation: "If a result remains after a week, submit the form again with the search terms that show it.",
  notes: "This removes results from Bing, not the page itself.",
};
