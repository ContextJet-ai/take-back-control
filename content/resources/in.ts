import type { Resource } from "../types";
export const inResources: Resource[] = [
  { region: "IN", name: "Childline India", kind: "crisis", url: "https://wcd.gov.in/", phone: "1098", description: "Free 24-hour helpline for children in distress across India, run under the Ministry of Women and Child Development. Call 1098.", forMinors: true, forAdults: false },
  { region: "IN", name: "National Cyber Crime Reporting Portal", kind: "reporting", url: "https://cybercrime.gov.in/", phone: "1930", description: "Report online sexual abuse. Reports about children are prioritised.", forMinors: true, forAdults: true },
  { region: "IN", name: "National Legal Services Authority", kind: "legal", url: "https://nalsa.gov.in/", phone: "15100", description: "Free legal aid for women and for anyone who cannot afford a lawyer. Call 15100 or contact your district legal services authority.", forMinors: false, forAdults: true, verifiedOn: "2026-10-06" },
];
