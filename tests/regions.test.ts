import { describe, it, expect } from "vitest";
import { regionFor, EU_MEMBERS } from "@/content/regions";
describe("regionFor", () => {
  it("adds EU for member states", () => { expect(regionFor("DE")).toEqual(["DE", "EU"]); expect(regionFor("FR")).toEqual(["FR", "EU"]); });
  it("single region for non-EU", () => { expect(regionFor("US")).toEqual(["US"]); expect(regionFor("IN")).toEqual(["IN"]); });
  it("empty for null or unknown", () => { expect(regionFor(null)).toEqual([]); expect(regionFor("ZZ")).toEqual(["ZZ"]); });
  it("has 27 EU members", () => { expect(EU_MEMBERS.length).toBe(27); });
});
