import { describe, it, expect } from "vitest";
import { SHADER_POLICY } from "@/components/landing/shader-panel";

describe("hero light policy", () => {
  it("stays cheap: delayed, low resolution, capped frame rate", () => {
    expect(SHADER_POLICY.startDelayMs).toBeGreaterThanOrEqual(1000);
    expect(SHADER_POLICY.scale).toBeLessThanOrEqual(0.5);
    expect(SHADER_POLICY.fps).toBeLessThanOrEqual(30);
  });
});
