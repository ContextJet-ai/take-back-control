import type { Resource } from "../types";
export const auResources: Resource[] = [
  { region: "AU", name: "Kids Helpline", kind: "crisis", url: "https://kidshelpline.com.au/", phone: "1800 55 1800", description: "Free, private counselling for anyone aged 5 to 25 in Australia.", forMinors: true, forAdults: false },
  { region: "AU", name: "eSafety Commissioner", kind: "reporting", url: "https://www.esafety.gov.au/report/image-based-abuse", description: "Australia's regulator takes image-based abuse reports, contacts the platform, and can order removal within 24 hours. Someone can report for you.", forMinors: true, forAdults: true },
  { region: "AU", name: "1800RESPECT", kind: "crisis", url: "https://www.1800respect.org.au/", phone: "1800 737 732", description: "National 24-hour counselling for sexual assault, domestic and family violence, including image-based abuse.", forMinors: false, forAdults: true, verifiedOn: "2026-10-06" },
];
