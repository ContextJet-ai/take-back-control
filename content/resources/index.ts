import type { Resource } from "../types";
import { globalResources } from "./global";

const byRegion: Record<string, Resource[]> = { global: globalResources };

export function resourcesFor(region: string | null, forMinor: boolean): Resource[] {
  const regional = region && byRegion[region] ? byRegion[region] : [];
  return [...globalResources, ...regional].filter((r) => (forMinor ? r.forMinors : r.forAdults));
}
