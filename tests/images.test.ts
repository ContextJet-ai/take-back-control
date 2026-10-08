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
      for (const m of fs.readFileSync(f, "utf8").matchAll(/["'`]\/images\/([\w./-]+)["'`]/g)) refs.add(m[1]);
    }
    for (const r of refs) expect(fs.existsSync(path.join(dir, r)), `${r} referenced but missing`).toBe(true);
    expect(refs.size).toBeGreaterThanOrEqual(9);
  });
});

describe("generated illustrations", () => {
  const gdir = path.join(dir, "generated");
  const gfiles = fs.existsSync(gdir) ? fs.readdirSync(gdir).filter((f) => f.endsWith(".webp")) : [];
  const prompts: Record<string, { prompt: string }> = fs.existsSync("scripts/image-prompts.json") ? JSON.parse(fs.readFileSync("scripts/image-prompts.json", "utf8")) : {};
  it("ships the four scenes", () => {
    for (const n of ["lighthouse-dawn", "desk-window", "lantern-path", "sapling-light"]) expect(gfiles).toContain(`${n}.webp`);
  });
  it("keeps each under 220KB", () => {
    for (const f of gfiles) expect(fs.statSync(path.join(gdir, f)).size, f).toBeLessThan(220 * 1024);
  });
  it("records the model, the date, and a stored prompt for each", () => {
    for (const f of gfiles) {
      const key = f.replace(".webp", "");
      const block = licenses.split("\n## ").find((b) => b.startsWith(`images/generated/${f}`));
      expect(block, `${f} missing from LICENSES.md`).toBeTruthy();
      expect(block).toMatch(/Generated with OpenAI gpt-image/);
      expect(block).toMatch(/Date: \d{4}-\d{2}-\d{2}/);
      expect(prompts[key]?.prompt, `${key} missing from scripts/image-prompts.json`).toBeTruthy();
      expect(block).toContain(`Prompt: scripts/image-prompts.json#${key}`);
    }
  });
  it("prompts forbid people and text", () => {
    for (const [k, v] of Object.entries(prompts)) {
      expect(v.prompt, k).toMatch(/no people/i);
      expect(v.prompt, k).toMatch(/no text/i);
    }
  });
});
