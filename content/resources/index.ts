import type { Resource } from "../types";
import { globalResources } from "./global";
import { usResources } from "./us";
import { gbResources } from "./gb";
import { inResources } from "./in";
import { auResources } from "./au";
import { caResources } from "./ca";
import { euResources } from "./eu";
import { regionFor } from "../regions";

const byRegion: Record<string, Resource[]> = { US: usResources, GB: gbResources, IN: inResources, AU: auResources, CA: caResources, EU: euResources };

export function resourcesFor(country: string | null, forMinor: boolean): Resource[] {
  const regional = regionFor(country).flatMap((r) => byRegion[r] ?? []);
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
