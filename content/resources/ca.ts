import type { Resource } from "../types";
export const caResources: Resource[] = [
  { region: "CA", name: "Kids Help Phone", kind: "crisis", url: "https://kidshelpphone.ca/", phone: "1-800-668-6868", description: "24-hour support for young people across Canada. Text CONNECT to 686868.", forMinors: true, forAdults: false },
  { region: "CA", name: "Cybertip.ca", kind: "reporting", url: "https://www.cybertip.ca/", description: "Canada's tipline for online sexual exploitation of children. Also runs NeedHelpNow.ca for teens.", forMinors: true, forAdults: false },
];
