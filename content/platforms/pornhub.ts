import type { Platform } from "../types";
export const pornhub: Platform = {
  slug: "pornhub",
  name: "Pornhub",
  contentTypes: ["image", "video"],
  reportUrl: "https://www.pornhub.com/content-removal",
  steps: [
    "Open the content removal form linked above.",
    "Choose that the content was uploaded without your consent.",
    "Paste the link to each video and describe how to identify you in it.",
    "Submit. You get a confirmation email with a reference.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 48 hours.",
  escalation: "If the video remains after 72 hours, reply to the confirmation email and add the video to StopNCII, which this site uses to block re-uploads.",
};
