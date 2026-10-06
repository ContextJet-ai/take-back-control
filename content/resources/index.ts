import type { Resource } from "../types";
import { globalResources } from "./global";
import { usResources } from "./us";
import { gbResources } from "./gb";
import { inResources } from "./in";
import { auResources } from "./au";
import { caResources } from "./ca";

const byRegion: Record<string, Resource[]> = { US: usResources, GB: gbResources, IN: inResources, AU: auResources, CA: caResources };

export function resourcesFor(region: string | null, forMinor: boolean): Resource[] {
  const regional = region && byRegion[region] ? byRegion[region] : [];
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
