import type { Platform } from "../types";
export const telegram: Platform = {
  slug: "telegram",
  name: "Telegram",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://telegram.org/support",
  steps: [
    "Open the support form linked above.",
    "Describe what was shared and paste the link to the channel, group, or message.",
    "Email abuse@telegram.org with the same details so it reaches the abuse team directly.",
    "Keep the automatic reply as evidence that you reported it.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Variable. Public channels are handled faster than private groups.",
  escalation: "Telegram rarely confirms removals. Check the link after a few days. If it is still up, email again and report through your country's police cybercrime unit.",
  notes: "Telegram has no dedicated intimate-image form. Email is the most reliable route.",
};
