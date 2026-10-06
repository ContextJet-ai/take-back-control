import platformReport from "./platform-report.md?raw";
import dmcaTakedown from "./dmca-takedown.md?raw";
import hostAbuse from "./host-abuse.md?raw";

export type LetterKind = "platform-report" | "dmca-takedown" | "host-abuse";
export const letterTemplates: Record<LetterKind, string> = {
  "platform-report": platformReport,
  "dmca-takedown": dmcaTakedown,
  "host-abuse": hostAbuse,
};
export const letterTitles: Record<LetterKind, string> = {
  "platform-report": "Removal request",
  "dmca-takedown": "Copyright takedown notice",
  "host-abuse": "Hosting provider abuse report",
};
