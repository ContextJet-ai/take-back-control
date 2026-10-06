import type { Platform } from "../types";
export const discord: Platform = {
  slug: "discord",
  name: "Discord",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://dis.gd/report",
  steps: [
    "Open the report form linked above.",
    "Choose the option for non-consensual intimate content.",
    "Paste the message link. Right-click or long-press the message and choose Copy Message Link.",
    "Submit and note the ticket number.",
  ],
  acceptsStopNCIIHashes: false,
  expectedResponse: "Usually within a few days.",
  escalation: "If the content remains after five days, reply to the ticket email. Report the server and user from inside the app too.",
};
