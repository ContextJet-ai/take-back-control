import type { Platform } from "../types";
export const tiktok: Platform = {
  slug: "tiktok",
  name: "TikTok",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://www.tiktok.com/legal/report/privacy",
  steps: [
    "Open the page linked above and press Continue. It redirects to TikTok's report form, which works without an account.",
    "Choose the option for intimate or sexual content shared without consent.",
    "Paste the link to each video. In the app, use Share then Copy link.",
    "Submit and note the reference number in the confirmation email.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 48 hours.",
  escalation: "If the video is still up after 72 hours, submit the form again quoting your reference number, and add the video to StopNCII.",
};
