import type { LetterKind } from "./letters";

export type ContentType = "image" | "video" | "threat";
export type ResourceKind = "crisis" | "legal" | "reporting" | "prevention";

export interface Platform {
  slug: string;
  name: string;
  contentTypes: ContentType[];
  reportUrl: string;
  steps: string[];
  acceptsStopNCIIHashes: boolean;
  expectedResponse: string;
  escalation: string;
  notes?: string;
  abuseEmail?: string;
}

export interface Resource {
  region: string; // ISO 3166-1 alpha-2 or "global"
  name: string;
  kind: ResourceKind;
  url: string;
  phone?: string;
  description: string;
  forMinors: boolean;
  forAdults: boolean;
  verifiedOn?: string;
}

export interface Lever {
  region: string;
  name: string;
  summary: string;
  url?: string;
  letterKind?: LetterKind;
  deadline?: string;
  verifiedOn: string;
}
