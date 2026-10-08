import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";

const tracked = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
const textFiles = tracked.filter((f) => !/\.(webp|jpg|jpeg|png|ico|woff2?|lock)$/.test(f) && f !== "package-lock.json" && fs.existsSync(f));

describe("repository hygiene", () => {
  it("tracks no environment files", () => {
    expect(tracked.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".example"))).toEqual([]);
  });
  it("contains nothing shaped like an API key", () => {
    const hits: string[] = [];
    for (const f of textFiles) {
      const text = fs.readFileSync(f, "utf8");
      if (/\bsk-[A-Za-z0-9_-]{20,}/.test(text)) hits.push(`${f}: sk- key`);
      if (/\b(AKIA|ASIA)[A-Z0-9]{16}\b/.test(text)) hits.push(`${f}: AWS key`);
      if (/\bgh[pousr]_[A-Za-z0-9]{30,}/.test(text)) hits.push(`${f}: GitHub token`);
      if (/^\s*[A-Z_]*API_KEY\s*=\s*["']?[A-Za-z0-9_-]{16,}/m.test(text)) hits.push(`${f}: API_KEY assignment`);
    }
    expect(hits).toEqual([]);
  });
  it("needs no environment variables to run", () => {
    const used = new Set<string>();
    for (const f of tracked.filter((x) => /^(app|components|lib|content)\/.*\.tsx?$/.test(x))) {
      for (const m of fs.readFileSync(f, "utf8").matchAll(/process\.env\.([A-Z_]+)/g)) used.add(m[1]);
    }
    expect([...used]).toEqual([]);
  });
});
