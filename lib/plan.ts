import { getPlatform, searchEngines as allSearchEngines } from "@/content/platforms";
import { resourcesFor } from "@/content/resources";
import { leversFor } from "@/content/levers";
import type { Platform, Resource, Lever } from "@/content/types";
import type { LetterKind } from "@/content/letters";

export interface Answers {
  contentType: "image" | "video" | "threat";
  posted: "yes" | "threatened" | "unsure";
  platformSlugs: string[];
  otherUrl: string;
  selfTaken: "yes" | "no" | "unsure";
  minor: "yes" | "no";
  country: string | null;
}

export interface PlanLetter { kind: LetterKind; platform: string; urls: string[] }

export interface Plan {
  isMinor: boolean;
  isSextortion: boolean;
  warnings: string[];
  rightNow: string[];
  platforms: Platform[];
  otherUrl: string | null;
  searchEngines: Platform[];
  prevention: Resource[];
  letters: PlanLetter[];
  support: Resource[];
  levers: Lever[];
  regulatorFirst: Lever | null;
}

export function buildPlan(a: Answers): Plan {
  const isMinor = a.minor === "yes";
  const posted = a.posted === "yes" || a.posted === "unsure";

  const isSextortion = a.posted === "threatened";
  const warnings: string[] = [];
  const rightNow: string[] = [];

  if (isMinor) {
    warnings.push("Do not forward or send the image to anyone, including a parent, teacher, or the police, and do not download or ask for new copies. In most countries that is itself a crime, even when you are the person in it. Show them the account and the message with the image covered, or give them the link.");
    warnings.push("If the image is already on your phone, you can use Take It Down with it. It makes a fingerprint on your phone and never sends the image anywhere.");
    rightNow.push("Write down the link, the account name, and the date for every post or message. Do not screenshot the image itself.");
    if (isSextortion) {
      rightNow.push("Stop replying. Do not pay and do not send anything else. Paying leads to more demands, not fewer.");
      rightNow.push("Do not delete the account or the messages. They are evidence. Block the person after you have the details above.");
      rightNow.push("Report the account to the app it is on (press and hold the profile or message and choose Report), then report it to NCMEC's CyberTipline using the link in Support below. Both are free and you can stay anonymous.");
    }
    rightNow.push("Tell an adult you trust. You are not in trouble, and this is not your fault.");
  } else {
    rightNow.push(posted
      ? "Take screenshots of every post, including the URL, the account name, and the date. Save them somewhere private."
      : "Take screenshots of the threats, including the account name and the date. Save them somewhere private.");
    rightNow.push("Do not pay, reply, or engage with the person threatening you. It almost always makes it worse.");
  }

  const forMinor = (p: Platform): Platform => ({
    ...p,
    steps: p.steps.map((t) => t.replaceAll("StopNCII", "Take It Down")),
    escalation: p.escalation.replaceAll("StopNCII", "Take It Down"),
    notes: p.notes?.replaceAll("StopNCII", "Take It Down"),
  });
  const platforms = posted
    ? a.platformSlugs.map(getPlatform).filter((p): p is Platform => Boolean(p) && p!.slug !== "other").map((p) => (isMinor ? forMinor(p) : p))
    : [];
  const hasOther = posted && a.platformSlugs.includes("other") && a.otherUrl.trim().length > 0;
  const otherUrl = hasOther ? a.otherUrl.trim() : null;

  const all = resourcesFor(a.country, isMinor);
  const prevention = all
    .filter((r) => r.kind === "prevention")
    .sort((x, y) => (x.name === "Take It Down" ? -1 : y.name === "Take It Down" ? 1 : 0));
  const support = all.filter((r) => r.kind !== "prevention");

  const levers = leversFor(a.country);
  const statutory = levers.find((l) => l.letterKind)?.letterKind;
  const regulatorFirst = levers.find((l) => l.region === "AU") ?? null;
  const platformKind: LetterKind = statutory ?? "platform-report";

  const letters: PlanLetter[] = [];
  for (const p of platforms) {
    letters.push({ kind: platformKind, platform: p.name, urls: [] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: p.name, urls: [] });
  }
  if (otherUrl) {
    letters.push({ kind: statutory ?? "host-abuse", platform: "the hosting provider", urls: [otherUrl] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: "the hosting provider", urls: [otherUrl] });
  }

  return {
    isMinor,
    isSextortion,
    warnings,
    rightNow,
    platforms,
    otherUrl,
    searchEngines: posted ? allSearchEngines : [],
    prevention,
    letters,
    support,
    levers,
    regulatorFirst,
  };
}
