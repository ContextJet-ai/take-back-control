import { describe, it, expect } from "vitest";
import fs from "node:fs";
const css = fs.readFileSync("app/globals.css", "utf8");
function token(block: string, name: string) { const m = new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i").exec(block); if (!m) throw new Error(`missing ${name}`); return m[1]; }
function lum(hex: string) { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function ratio(a: string, b: string) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
const light = css.split("@media (prefers-color-scheme: dark)")[0];
const dark = css.split("@media (prefers-color-scheme: dark)")[1];
describe("tokens", () => {
  it("fg on bg passes AAA in both themes", () => { expect(ratio(token(light, "--fg"), token(light, "--bg"))).toBeGreaterThan(7); expect(ratio(token(dark, "--fg"), token(dark, "--bg"))).toBeGreaterThan(7); });
  it("muted on bg passes AA in both themes", () => { expect(ratio(token(light, "--muted"), token(light, "--bg"))).toBeGreaterThan(4.5); expect(ratio(token(dark, "--muted"), token(dark, "--bg"))).toBeGreaterThan(4.5); });
  it("accent-fg on accent passes AA in both themes", () => { expect(ratio(token(light, "--accent-fg"), token(light, "--accent"))).toBeGreaterThan(4.5); expect(ratio(token(dark, "--accent-fg"), token(dark, "--accent"))).toBeGreaterThan(4.5); });
  it("surface differs from bg enough to read as a card", () => { expect(ratio(token(light, "--surface-solid"), token(light, "--bg"))).toBeGreaterThan(1.04); expect(ratio(token(dark, "--surface-solid"), token(dark, "--bg"))).toBeGreaterThan(1.04); });
  it("fg on accent-soft passes AA in both themes", () => { expect(ratio(token(light, "--fg"), token(light, "--accent-soft"))).toBeGreaterThan(4.5); expect(ratio(token(dark, "--fg"), token(dark, "--accent-soft"))).toBeGreaterThan(4.5); });
  it("no pure black or white tokens", () => { expect(css).not.toMatch(/#000000\b|#ffffff\b/i); });
});
