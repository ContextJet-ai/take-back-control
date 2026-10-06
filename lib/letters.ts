import { letterTemplates, type LetterKind } from "@/content/letters";

export interface LetterVars { platform: string; urls: string[]; date: string; name?: string; contact?: string; minor?: boolean }

export function renderLetter(kind: LetterKind, vars: LetterVars): string {
  const signature = vars.name?.trim() ? `\n${vars.name.trim()}` : "";
  const dsaMinor = kind === "dsa-notice" && vars.minor;
  let template = letterTemplates[kind];
  if (dsaMinor) {
    template = template.replace(
      "My name and email address: {{name}}, {{contact}}",
      "My name and email address: not required for this notice, because the content shows a person under 18 (Article 16(2)(c)). Optional: {{name}}, {{contact}}",
    );
  }
  return template
    .replaceAll("{{platform}}", vars.platform)
    .replaceAll("{{date}}", vars.date)
    .replaceAll("{{urls}}", vars.urls.join("\n"))
    .replaceAll("{{name}}", vars.name?.trim() || (dsaMinor ? "(name, optional)" : "(your full name, required)"))
    .replaceAll("{{signature}}", signature)
    .replaceAll("{{contact}}", vars.contact?.trim() || "(add your email or postal address)")
    .trimEnd();
}
