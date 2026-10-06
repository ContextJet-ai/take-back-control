import type { Resource } from "../types";
export const gbResources: Resource[] = [
  { region: "GB", name: "Childline", kind: "crisis", url: "https://www.childline.org.uk/", phone: "0800 1111", description: "Free, confidential support for anyone under 19 in the UK, any time.", forMinors: true, forAdults: false },
  { region: "GB", name: "CEOP Safety Centre", kind: "reporting", url: "https://www.ceop.police.uk/Safety-Centre/", description: "Report online sexual abuse or grooming of a child to UK police.", forMinors: true, forAdults: false },
];
