import type { Platform } from "../types";
export const snapchat: Platform = {
  slug: "snapchat",
  name: "Snapchat",
  contentTypes: ["image", "video", "threat"],
  reportUrl: "https://help.snapchat.com/hc/en-us/articles/7012399221652",
  steps: [
    "In the app, press and hold the Snap, Story, or chat message and tap Report. Choose the option for nudity or sexual content shared without permission.",
    "Open the help page linked above and scroll to the section on reporting non-consensual intimate imagery. Its link opens Snapchat's web form.",
    "On the form choose They're actually sharing my nudes/intimate imagery without my permission, give the username, and describe what was shared.",
    "Submit. Snapchat acknowledges by email and tells you the outcome. In-app reports can be tracked under My Reports.",
  ],
  acceptsStopNCIIHashes: true,
  expectedResponse: "Usually within 24 hours.",
  escalation: "If the account is still active after 48 hours, report the account itself from the Chat screen (press and hold the name, Manage Friendship, Report) and add the images to StopNCII.",
};
