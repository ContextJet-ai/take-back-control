import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const dir = "public/images";
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(webp|jpg|png)$/.test(f)) : [];
const licenses = fs.existsSync("public/LICENSES.md") ? fs.readFileSync("public/LICENSES.md", "utf8") : "";

function sourceFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(root, e.name);
    return e.isDirectory() ? sourceFiles(p) : /\.(tsx|ts)$/.test(e.name) ? [p] : [];
  });
}

describe("site images", () => {
  it("ships the five hope photographs", () => {
    for (const n of ["hero-dawn", "step-document", "step-remove", "step-prevent", "closing-horizon"]) expect(files).toContain(`${n}.webp`);
  });
  it("keeps every image under 220KB", () => {
    for (const f of files) expect(fs.statSync(path.join(dir, f)).size, f).toBeLessThan(220 * 1024);
  });
  it("records a free license and a Commons source for every image", () => {
    for (const f of files) {
      const block = licenses.split("\n## ").find((b) => b.includes(f));
      expect(block, `${f} missing from LICENSES.md`).toBeTruthy();
      expect(block).toMatch(/License: (CC0|Public domain)/);
      expect(block).toMatch(/Source: https:\/\/commons\.wikimedia\.org\//);
    }
  });
  it("only references images that exist", () => {
    const refs = new Set<string>();
    for (const f of [...sourceFiles("components"), ...sourceFiles("app")]) {
      for (const m of fs.readFileSync(f, "utf8").matchAll(/["'`]\/images\/([\w.-]+)["'`]/g)) refs.add(m[1]);
    }
    for (const r of refs) expect(files, `${r} referenced but missing`).toContain(r);
    expect(refs.size).toBeGreaterThanOrEqual(5);
  });
});
