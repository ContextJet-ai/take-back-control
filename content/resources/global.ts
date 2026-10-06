import type { Resource } from "../types";
export const globalResources: Resource[] = [
  { region: "global", name: "StopNCII", kind: "prevention", url: "https://stopncii.org/", description: "Creates a fingerprint of your images on your own device so partner platforms can block them. Adults only.", forMinors: false, forAdults: true },
  { region: "global", name: "Take It Down", kind: "prevention", url: "https://takeitdown.ncmec.org/", description: "Run by NCMEC. Fingerprints images of anyone under 18 so platforms can remove and block them.", forMinors: true, forAdults: false },
  { region: "global", name: "NCMEC CyberTipline", kind: "reporting", url: "https://report.cybertip.org/", description: "Report sexual images of anyone under 18. Reports reach law enforcement worldwide.", forMinors: true, forAdults: false },
  { region: "global", name: "NCMEC: Is Your Explicit Content Out There", kind: "reporting", url: "https://www.missingkids.org/gethelpnow/isyourexplicitcontentoutthere", description: "Sextortion help for under 18s: what to do when someone threatens to share your images, and how to get them taken down.", forMinors: true, forAdults: false },
  { region: "global", name: "Cyber Civil Rights Initiative", kind: "crisis", url: "https://cybercivilrights.org/ccri-safety-center/", phone: "+1 844 878 2274", description: "Image-based abuse helpline and safety guides.", forMinors: false, forAdults: true },
  { region: "global", name: "Revenge Porn Helpline", kind: "crisis", url: "https://revengepornhelpline.org.uk/", description: "UK-based helpline that also answers international queries by email.", forMinors: false, forAdults: true },
  { region: "global", name: "Find a Helpline", kind: "crisis", url: "https://findahelpline.com/", description: "Free, confidential crisis lines by country.", forMinors: true, forAdults: true },
];
