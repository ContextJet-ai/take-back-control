import { describe, it, expect } from "vitest";
import { buildMailto } from "@/lib/mailto";
describe("buildMailto", () => {
  it("encodes subject and body", () => {
    const m = buildMailto("abuse@example.com", "Hi there", "Line 1\nLine 2 & more");
    expect(m.href).toBe("mailto:abuse@example.com?subject=Hi%20there&body=Line%201%0ALine%202%20%26%20more");
    expect(m.tooLong).toBe(false);
  });
  it("flags long bodies", () => { expect(buildMailto("a@b.c", "s", "x".repeat(3000)).tooLong).toBe(true); });
});
