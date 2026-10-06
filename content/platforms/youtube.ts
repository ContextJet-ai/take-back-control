import type { Platform } from "../types";
export const youtube: Platform = {
  slug: "youtube",
  name: "YouTube",
  contentTypes: ["video", "threat"],
  reportUrl: "https://support.google.com/youtube/answer/142443",
  steps: [
    "Open the Privacy Complaint Process linked above and press Continue to reach the form.",
    "Say that you are uniquely identifiable in the video and that it shows you in private or sensitive circumstances without consent.",
    "Paste the link to the video and the timestamp where you appear.",
    "Submit. YouTube emails you a case number. The uploader may be given 48 hours to remove it before YouTube acts.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within a few days.",
  escalation: "If no action is taken in a week, reply to the case email, and ask Google Search to remove the video from results.",
};
