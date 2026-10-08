// Generates the illustration set from scripts/image-prompts.json with OpenAI's image API.
// Run once by a maintainer; the resulting WebP files are committed, so the site itself needs no key.
//   OPENAI_API_KEY=... node scripts/generate-images.mjs [--force] [name ...]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("Set OPENAI_API_KEY in the environment to run this script."); process.exit(1); }

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const prompts = JSON.parse(fs.readFileSync("scripts/image-prompts.json", "utf8"));
const outDir = "public/images/generated";
fs.mkdirSync(outDir, { recursive: true });
const MODELS = ["gpt-image-2", "gpt-image-1.5", "gpt-image-1"];

async function generate(prompt) {
  let last = "";
  for (const model of MODELS) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, prompt, size: "1536x1024", quality: "medium", n: 1 }),
    });
    const body = await res.json();
    if (res.ok && body.data?.[0]?.b64_json) return { model, png: Buffer.from(body.data[0].b64_json, "base64") };
    last = `${model}: ${body.error?.message ?? res.status}`;
    console.error("  failed", last.slice(0, 160));
  }
  throw new Error(last);
}

for (const [name, { prompt }] of Object.entries(prompts)) {
  if (only.length && !only.includes(name)) continue;
  const file = path.join(outDir, `${name}.webp`);
  if (fs.existsSync(file) && !force) { console.log("skip", name); continue; }
  console.log("generating", name);
  const { model, png } = await generate(prompt);
  await sharp(png).resize({ width: 1400 }).webp({ quality: 74 }).toFile(file);
  console.log("  wrote", file, `${Math.round(fs.statSync(file).size / 1024)}KB`, "via", model);
}
