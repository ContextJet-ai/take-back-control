import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EvidenceBuilder } from "@/components/evidence/evidence-builder";
import { clearState, saveState } from "@/lib/wizard-state";

describe("EvidenceBuilder", () => {
  beforeEach(() => clearState());

  it("hashes a chosen file and lists it once even if chosen twice", async () => {
    render(<EvidenceBuilder />);
    const input = screen.getByLabelText(/add screenshots or files/i) as HTMLInputElement;
    const file = new File(["abc"], "shot.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(screen.getAllByText(/ba7816bf/).length).toBe(1));
    fireEvent.change(input, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getAllByText(/ba7816bf/).length).toBe(1);
  });

  it("accepts a PDF", async () => {
    render(<EvidenceBuilder />);
    const input = screen.getByLabelText(/add screenshots or files/i);
    fireEvent.change(input, { target: { files: [new File(["x"], "chat.pdf", { type: "application/pdf" })] } });
    await waitFor(() => expect(screen.getByText("chat.pdf")).toBeTruthy());
  });

  it("downloads a log with only links", () => {
    const create = vi.fn(() => "blob:x"); const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    render(<EvidenceBuilder />);
    fireEvent.change(screen.getByLabelText(/^links, one per line$/i), { target: { value: "https://a.example/1" } });
    fireEvent.click(screen.getByRole("button", { name: /download log/i }));
    expect(create).toHaveBeenCalled();
  });

  it("hides the file input for minors and explains", () => {
    saveState({ step: 6, answers: { contentType: "image", posted: "yes", platformSlugs: [], otherUrl: "", selfTaken: "no", minor: "yes", country: null } });
    render(<EvidenceBuilder />);
    expect(screen.queryByLabelText(/add screenshots or files/i)).toBeNull();
    expect(screen.getByText(/do not save or screenshot the image/i)).toBeTruthy();
  });
});
