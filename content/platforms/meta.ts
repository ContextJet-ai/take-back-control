import type { Platform } from "../types";
export const meta: Platform = {
  slug: "meta",
  name: "Facebook and Instagram",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://www.meta.com/en-gb/help/policies/867240510905645/",
  steps: [
    "Open the post in the Facebook or Instagram app, tap the three dots, and choose Report.",
    "Choose Nudity or sexual activity, then the option for an intimate image shared without permission.",
    "Say the image shows you. Trained reviewers handle these reports, and the account is usually disabled.",
    "If you have no account, ask someone you trust to report it for you, and read the guide linked above for other options.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 24 to 48 hours.",
  escalation: "If the post is still up after 72 hours, report it again and add the image to StopNCII so Facebook, Instagram, and Messenger block re-uploads.",
  notes: "Meta no longer offers a standalone web form for this. Reporting happens inside the app.",
};
