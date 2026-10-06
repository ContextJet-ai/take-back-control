import type { Platform } from "../types";
export const reddit: Platform = {
  slug: "reddit",
  name: "Reddit",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://www.reddit.com/report?reason=non-consensual-intimate-media",
  steps: [
    "Open the report form linked above. You can report without an account.",
    "Paste the link to each post or comment.",
    "Say that the content shows you and was shared without your permission.",
    "Submit. Also message the moderators of the community so they can remove it faster.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 24 hours.",
  escalation: "If the post remains after 48 hours, report it again and add the images to StopNCII.",
};
