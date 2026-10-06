import type { Platform } from "../types";
export const x: Platform = {
  slug: "x",
  name: "X",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://help.x.com/en/forms/safety-and-sensitive-content/private-information",
  steps: [
    "Open the private information report form linked above.",
    "Choose that the report is about intimate media shared without consent.",
    "Paste the link to each post. Open the post and copy the address from the browser bar.",
    "Submit and keep the case number from the confirmation email.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Often within 24 hours, sometimes several days.",
  escalation: "If there is no reply in five days, submit the form again with the case number and report each post in the app as well.",
};
