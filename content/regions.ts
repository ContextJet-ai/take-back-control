export const EU_MEMBERS = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"];
export function regionFor(country: string | null): string[] {
  if (!country) return [];
  return EU_MEMBERS.includes(country) ? [country, "EU"] : [country];
}
