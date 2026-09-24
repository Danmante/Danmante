import { describe, it, expect } from "vitest";
import { canBookConsultation, canPharmacyFulfill, canNursePrescribeReferral } from "./src/engine";

describe("jurisdiction engine — fail closed", () => {
  it("blocks consultation booking for an unconfigured jurisdiction", () => {
    const result = canBookConsultation({ country: "ZZ" }, "video");
    expect(result.allowed).toBe(false);
  });

  it("blocks provisional rules even when marked active", () => {
    const result = canBookConsultation({ country: "US", region: "US-CA" }, "video");
    expect(result.allowed).toBe(false);
  });

  it("blocks controlled substance fulfillment even in a configured jurisdiction", () => {
    const result = canPharmacyFulfill(
      { country: "US", region: "US-CA" },
      { controlledSubstance: true, requiresPrescription: true }
    );

    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reasonCode).toBe("PHARMACY_NOT_ELIGIBLE");
    }
  });

  it("blocks nurse prescription referral for unconfigured jurisdiction", () => {
    const result = canNursePrescribeReferral({ country: "ZZ" });
    expect(result.allowed).toBe(false);
  });
});
