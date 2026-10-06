import { describe, it, expect } from "vitest";
import { hashBytes, hashFile, renderEvidenceLog, renderEvidenceJson } from "@/lib/evidence";

const base = { urls: ["https://a.example/p/1"], accounts: ["@someone"], statement: "They posted it on 5 October.", files: [], generatedAt: new Date("2026-10-06T10:00:00Z"), timeZone: "Asia/Kolkata" };

describe("evidence", () => {
  it("hashes bytes to the known SHA-256 of 'abc'", async () => {
    expect(await hashBytes(new TextEncoder().encode("abc").buffer as ArrayBuffer)).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
  it("hashes a Blob the same as its bytes", async () => {
    expect(await hashFile(new Blob(["abc"]))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
  it("hashes a 5MB buffer", async () => {
    const big = new Uint8Array(5 * 1024 * 1024);
    const h = await hashBytes(big.buffer);
    expect(h).toHaveLength(64);
  });
  it("renders a log with every section and the clock caveat", () => {
    const log = renderEvidenceLog({ ...base, files: [{ name: "shot.png", size: 1234, type: "image/png", sha256: "ab".repeat(32) }] });
    expect(log).toContain("Evidence log");
    expect(log).toContain("2026-10-06T10:00:00.000Z");
    expect(log).toContain("Asia/Kolkata");
    expect(log).toContain("https://a.example/p/1");
    expect(log).toContain("@someone");
    expect(log).toContain("They posted it on 5 October.");
    expect(log).toContain("shot.png");
    expect(log).toContain("ab".repeat(32));
    expect(log).toMatch(/device clock/i);
    expect(log).toMatch(/email this log to yourself/i);
    expect(log).not.toMatch(/[–—]/);
  });
  it("renders JSON that round-trips", () => {
    const json = JSON.parse(renderEvidenceJson(base));
    expect(json.urls).toEqual(base.urls);
    expect(json.generatedAt).toBe("2026-10-06T10:00:00.000Z");
  });
});
