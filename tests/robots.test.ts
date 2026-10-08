import { describe, it, expect } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("allows the site but keeps the private plan out of search", () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toContain("/plan");
  });
});
