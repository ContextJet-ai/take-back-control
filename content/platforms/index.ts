import type { Platform } from "../types";
import { meta } from "./meta";
import { tiktok } from "./tiktok";
import { snapchat } from "./snapchat";
import { x } from "./x";
import { reddit } from "./reddit";
import { discord } from "./discord";
import { telegram } from "./telegram";
import { youtube } from "./youtube";
import { pornhub } from "./pornhub";
import { onlyfans } from "./onlyfans";
import { googleSearch } from "./google-search";
import { bingSearch } from "./bing-search";
import { other } from "./other";

export const platforms: Platform[] = [meta, tiktok, snapchat, x, reddit, discord, telegram, youtube, pornhub, onlyfans, googleSearch, bingSearch, other];
const SEARCH = ["google-search", "bing-search"];
export const selectablePlatforms = platforms.filter((p) => !SEARCH.includes(p.slug));
export const searchEngines = platforms.filter((p) => SEARCH.includes(p.slug));
export function getPlatform(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
