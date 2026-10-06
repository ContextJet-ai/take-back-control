import { letterTemplates, type LetterKind } from "@/content/letters";

export interface LetterVars { platform: string; urls: string[]; date: string; name?: string }

export function renderLetter(kind: LetterKind, vars: LetterVars): string {
  const signature = vars.name?.trim() ? `\n${vars.name.trim()}` : "";
  return letterTemplates[kind]
    .replaceAll("{{platform}}", vars.platform)
    .replaceAll("{{date}}", vars.date)
    .replaceAll("{{urls}}", vars.urls.join("\n"))
    .replaceAll("{{signature}}", signature)
    .trimEnd();
}
