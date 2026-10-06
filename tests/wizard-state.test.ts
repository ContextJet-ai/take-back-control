import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadState, saveState, clearState } from "@/lib/wizard-state";

describe("wizard state", () => {
  beforeEach(() => { sessionStorage.clear(); clearState(); });

  it("round-trips state", () => {
    saveState({ step: 2, answers: { contentType: "image" } });
    expect(loadState()).toEqual({ step: 2, answers: { contentType: "image" } });
  });
  it("returns null when nothing is saved", () => {
    expect(loadState()).toBeNull();
  });
  it("clears state", () => {
    saveState({ step: 1, answers: {} });
    clearState();
    expect(loadState()).toBeNull();
  });
  it("falls back to memory when storage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => saveState({ step: 3, answers: { minor: "no" } })).not.toThrow();
    expect(loadState()).toEqual({ step: 3, answers: { minor: "no" } });
    spy.mockRestore(); get.mockRestore();
  });
  it("ignores corrupt stored json", () => {
    sessionStorage.setItem("wizard", "{not json");
    expect(loadState()).toBeNull();
  });
});
