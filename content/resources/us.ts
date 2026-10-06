import type { Resource } from "../types";
export const usResources: Resource[] = [
  { region: "US", name: "Childhelp Hotline", kind: "crisis", url: "https://www.childhelphotline.org/", phone: "1-800-422-4453", description: "24-hour support for children and teens, and for adults worried about a child.", forMinors: true, forAdults: false },
  { region: "US", name: "FBI: sextortion", kind: "reporting", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/sextortion", description: "What to do if someone is threatening you over images. Report at tips.fbi.gov or call 1-800-CALL-FBI.", forMinors: true, forAdults: true },
  { region: "US", name: "CCRI attorney directory", kind: "legal", url: "https://cybercivilrights.org/professionals-helping-victims/", description: "Lawyers who take image-based abuse cases, listed by state.", forMinors: false, forAdults: true, verifiedOn: "2026-10-06" },
];
