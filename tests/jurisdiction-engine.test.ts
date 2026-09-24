import { describe, it, expect } from "vitest";
import { canBookConsultation, canPharmacyFulfill, canNursePrescribeReferral } from "../src/engine";

describe("jurisdiction engine", () => {
  it("blocks unsupported jurisdictions", () => {
    const result = canBookConsultation({ country: "ZZ" }, "video");
    expect(result.allowed).toBe(false);
  });

  it("blocks stale rules even when marked active", () => {
    const result = canBookConsultation({ country: "US", region: "US-CA" }, "video");
    expect(result.allowed).toBe(false);
  });

  it("blocks controlled-substance fulfillment", () => {
    const result = canPharmacyFulfill({ country: "US", region: "US-CA" }, {
      controlledSubstance: true,
      requiresPrescription: true,
    });

    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reasonCode).toBe("PHARMACY_NOT_ELIGIBLE");
    }
  });

  it("blocks nurse referrals outside configured jurisdictions", () => {
    const result = canNursePrescribeReferral({ country: "ZZ" });
    expect(result.allowed).toBe(false);
  });
});
