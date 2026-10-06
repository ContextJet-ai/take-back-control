import type { Platform } from "../types";
export const snapchat: Platform = {
  slug: "snapchat",
  name: "Snapchat",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://help.snapchat.com/hc/en-us/requests/new?co=true&ticket_form_id=149423",
  steps: [
    "Open the safety report form linked above.",
    "Choose that someone is sharing intimate images of you without consent.",
    "Give the username of the account sharing the content and describe what was shared.",
    "Submit. Snapchat replies by email to the address you give.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 24 hours.",
  escalation: "Reply to the support email if the account is still active after 48 hours. Also report the account in the app by pressing and holding its name.",
};
