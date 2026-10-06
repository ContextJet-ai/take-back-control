import platformReport from "./platform-report.md?raw";
import dmcaTakedown from "./dmca-takedown.md?raw";
import hostAbuse from "./host-abuse.md?raw";

export type LetterKind = "platform-report" | "dmca-takedown" | "host-abuse" | "take-it-down-notice" | "india-grievance" | "dsa-notice";
export const letterTemplates: Record<LetterKind, string> = {
  "platform-report": platformReport,
  "dmca-takedown": dmcaTakedown,
  "host-abuse": hostAbuse,
  "take-it-down-notice": "",
  "india-grievance": "",
  "dsa-notice": "",
};
export const letterTitles: Record<LetterKind, string> = {
  "platform-report": "Removal request",
  "dmca-takedown": "Copyright takedown notice",
  "host-abuse": "Hosting provider abuse report",
  "take-it-down-notice": "TAKE IT DOWN Act removal request",
  "india-grievance": "Grievance complaint under IT Rules 2021",
  "dsa-notice": "Illegal content notice under the Digital Services Act",
};
