import type { Platform } from "../types";
export const x: Platform = {
  slug: "x",
  name: "X",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://help.x.com/en/rules-and-policies/intimate-media",
  steps: [
    "Open the post, tap the three dots, and choose Report post.",
    "Choose It displays a sensitive photo or video, then An unauthorized photo or video, then It includes unauthorized, intimate content of me or someone else.",
    "Say whether you are reporting for yourself. You can add up to five posts in one report.",
    "Submit. The policy page linked above has the same steps with screenshots, and X permanently suspends the original poster.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Often within 24 hours, sometimes several days.",
  escalation: "If the post is still up after five days, report it again from a different post in the same thread, and ask Google and Bing to remove it from search results.",
  notes: "X's web forms now require you to appeal an account restriction first, so in-app reporting is the reliable route.",
};
