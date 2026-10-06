import type { Lever } from "../types";
import { regionFor } from "../regions";
import { usLevers } from "./us"; import { inLevers } from "./in"; import { gbLevers } from "./gb"; import { auLevers } from "./au"; import { euLevers } from "./eu"; import { caLevers } from "./ca";
const byRegion: Record<string, Lever[]> = { US: usLevers, IN: inLevers, GB: gbLevers, AU: auLevers, EU: euLevers, CA: caLevers };
export function leversFor(country: string | null): Lever[] {
  return regionFor(country).flatMap((r) => byRegion[r] ?? []);
}
