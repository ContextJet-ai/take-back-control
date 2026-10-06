import type { Platform } from "../types";
export const youtube: Platform = {
  slug: "youtube",
  name: "YouTube",
  contentTypes: ["video", "threat"],
  reportUrl: "https://support.google.com/youtube/answer/2802268",
  steps: [
    "Open the privacy complaint page linked above and follow the link to the complaint form.",
    "Choose that the video shows you in an intimate way without your consent.",
    "Paste the link to the video and the timestamp where you appear.",
    "Submit. YouTube emails you a case number.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within 48 hours.",
  escalation: "If no action is taken in a week, reply to the case email, and ask Google Search to remove the video from results.",
};
