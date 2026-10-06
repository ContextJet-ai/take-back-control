import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EvidenceBuilder } from "@/components/evidence/evidence-builder";
import { renderEvidenceLog } from "@/lib/evidence";
import { clearState } from "@/lib/wizard-state";

const base = { urls: [], accounts: [], statement: "", firstSeen: "", files: [], generatedAt: new Date("2026-10-06T10:00:00Z"), timeZone: "UTC" };

describe("evidence review fixes", () => {
  beforeEach(() => clearState());

  it("warns about under-18 content when wizard state is absent", () => {
    render(<EvidenceBuilder />);
    expect(screen.getByLabelText(/add screenshots or files/i)).toBeTruthy();
    expect(screen.getByText(/if anyone in it is under 18/i)).toBeTruthy();
  });

  it("offers the log as text with a copy button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<EvidenceBuilder />);
    fireEvent.change(screen.getByLabelText(/^links, one per line$/i), { target: { value: "https://a.example/1" } });
    fireEvent.click(screen.getByRole("button", { name: /copy log/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(writeText.mock.calls[0][0]).toContain("https://a.example/1");
    expect((screen.getByLabelText(/log text/i) as HTMLTextAreaElement).value).toContain("https://a.example/1");
  });

  it("keeps both batches when files are chosen back to back", async () => {
    render(<EvidenceBuilder />);
    const input = screen.getByLabelText(/add screenshots or files/i);
    fireEvent.change(input, { target: { files: [new File(["abc"], "a.png", { type: "image/png" })] } });
    fireEvent.change(input, { target: { files: [new File(["xyz"], "b.png", { type: "image/png" })] } });
    await waitFor(() => { expect(screen.getByText("a.png")).toBeTruthy(); expect(screen.getByText("b.png")).toBeTruthy(); });
  });

  it("lists oversized files without hashing them", async () => {
    render(<EvidenceBuilder />);
    const big = new File(["x"], "video.mp4", { type: "video/mp4" });
    Object.defineProperty(big, "size", { value: 200 * 1024 * 1024 });
    fireEvent.change(screen.getByLabelText(/add screenshots or files/i), { target: { files: [big] } });
    await waitFor(() => expect(screen.getByText(/too large to fingerprint/i)).toBeTruthy());
    expect(renderEvidenceLog({ ...base, files: [{ name: "video.mp4", size: 1, type: "video/mp4", sha256: "", lastModified: 0 }] })).toMatch(/not computed, file too large/);
  });

  it("records when the content was first seen and each file's own timestamp", () => {
    const log = renderEvidenceLog({ ...base, firstSeen: "5 October, about 9pm", files: [{ name: "s.png", size: 3, type: "image/png", sha256: "aa", lastModified: Date.UTC(2026, 9, 5, 15, 30) }] });
    expect(log).toContain("First seen: 5 October, about 9pm");
    expect(log).toContain("2026-10-05T15:30:00.000Z");
    render(<EvidenceBuilder />);
    expect(screen.getByLabelText(/when did you first see it/i)).toBeTruthy();
  });

  it("warns about the downloads folder on a shared device", () => {
    render(<EvidenceBuilder />);
    expect(screen.getByText(/if you share this device/i)).toBeTruthy();
  });
});
