import { getPlatform, searchEngines as allSearchEngines } from "@/content/platforms";
import { resourcesFor } from "@/content/resources";
import type { Platform, Resource } from "@/content/types";
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
  rightNow: string[];
  platforms: Platform[];
  otherUrl: string | null;
  searchEngines: Platform[];
  prevention: Resource[];
  letters: PlanLetter[];
  support: Resource[];
}

export function buildPlan(a: Answers): Plan {
  const isMinor = a.minor === "yes";
  const posted = a.posted === "yes" || a.posted === "unsure";

  const rightNow: string[] = [];
  if (posted) {
    rightNow.push("Take screenshots of every post, including the URL, the account name, and the date. Save them somewhere private.");
  } else {
    rightNow.push("Take screenshots of the threats, including the account name and the date. Save them somewhere private.");
  }
  rightNow.push("Do not pay, reply, or engage with the person threatening you. It almost always makes it worse.");
  if (isMinor) {
    rightNow.push("If you can, tell a trusted adult. You are not in trouble, and this is not your fault.");
  }

  const platforms = posted
    ? a.platformSlugs.map(getPlatform).filter((p): p is Platform => Boolean(p) && p!.slug !== "other")
    : [];
  const hasOther = posted && a.platformSlugs.includes("other") && a.otherUrl.trim().length > 0;
  const otherUrl = hasOther ? a.otherUrl.trim() : null;

  const all = resourcesFor(a.country, isMinor);
  const prevention = all.filter((r) => r.kind === "prevention");
  const support = all.filter((r) => r.kind !== "prevention");

  const letters: PlanLetter[] = [];
  for (const p of platforms) {
    letters.push({ kind: "platform-report", platform: p.name, urls: [] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: p.name, urls: [] });
  }
  if (otherUrl) {
    letters.push({ kind: "host-abuse", platform: "the hosting provider", urls: [otherUrl] });
    if (!isMinor && a.selfTaken === "yes") letters.push({ kind: "dmca-takedown", platform: "the hosting provider", urls: [otherUrl] });
  }

  return {
    isMinor,
    rightNow,
    platforms,
    otherUrl,
    searchEngines: posted ? allSearchEngines : [],
    prevention,
    letters,
    support,
  };
}
