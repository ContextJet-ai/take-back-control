import type { Platform } from "../types";
export const onlyfans: Platform = {
  slug: "onlyfans",
  name: "OnlyFans",
  contentTypes: ["image", "video"],
  reportUrl: "https://onlyfans.com/contact",
  steps: [
    "Open the contact form linked above and choose the option for reporting content.",
    "Paste the link to the account and describe the content that shows you.",
    "Say clearly that you did not consent and are not the account holder.",
    "Submit and keep the ticket email.",
  ],
  abuseEmail: "support@onlyfans.com",
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within a few days.",
  escalation: "If there is no reply in five days, email support@onlyfans.com with the ticket number and add the images to StopNCII.",
};
