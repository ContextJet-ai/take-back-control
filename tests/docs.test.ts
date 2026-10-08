import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const docs = ["README.md", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "docs/README.md", "docs/ARCHITECTURE.md", "docs/CONTENT-GUIDE.md", "docs/ADDING-A-COUNTRY.md", "docs/PRIVACY-AND-SECURITY.md", "docs/DEPLOYMENT.md"];
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

describe("documentation", () => {
  it("has every expected document", () => {
    for (const d of docs) expect(fs.existsSync(d), d).toBe(true);
  });
  it("only links to files that exist", () => {
    const broken: string[] = [];
    for (const d of docs.filter((x) => fs.existsSync(x))) {
      const text = fs.readFileSync(d, "utf8");
      for (const m of text.matchAll(/\]\((?!https?:|mailto:|#)([^)#\s]+)(#[^)]*)?\)/g)) {
        const target = path.normalize(path.join(path.dirname(d), m[1]));
        if (!fs.existsSync(target)) broken.push(`${d} -> ${m[1]}`);
      }
    }
    expect(broken).toEqual([]);
  });
  it("only documents npm scripts that exist", () => {
    const missing: string[] = [];
    for (const d of docs.filter((x) => fs.existsSync(x))) {
      for (const m of fs.readFileSync(d, "utf8").matchAll(/npm run ([a-z0-9:]+)/g)) if (!pkg.scripts[m[1]]) missing.push(`${d}: npm run ${m[1]}`);
    }
    expect(missing).toEqual([]);
  });
  it("names no local machine paths or personal addresses", () => {
    for (const d of docs.filter((x) => fs.existsSync(x))) {
      const text = fs.readFileSync(d, "utf8");
      expect(text, d).not.toMatch(/\/Users\/|@gmail\.com/);
    }
  });
  it("explains the licence situation plainly", () => {
    expect(fs.readFileSync("README.md", "utf8")).toMatch(/## Licen[cs]e/);
  });
  it("README shows the CI badge and the privacy promise", () => {
    const r = fs.readFileSync("README.md", "utf8");
    expect(r).toContain("actions/workflows/ci.yml/badge.svg");
    expect(r).toMatch(/nothing .* uploaded/i);
  });
});
