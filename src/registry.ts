import type { JurisdictionKey, JurisdictionRuleSet } from "./types";

const registry = new Map<string, JurisdictionRuleSet>();

function keyToString(key: JurisdictionKey): string {
  return key.region ? `${key.country}:${key.region}` : key.country;
}

export function registerJurisdiction(rules: JurisdictionRuleSet): void {
  registry.set(keyToString(rules.key), rules);
}

export function getJurisdiction(key: JurisdictionKey): JurisdictionRuleSet | null {
  return (
    registry.get(keyToString(key)) ??
    (key.region ? registry.get(key.country) : null) ??
    null
  );
}

export function listJurisdictions(): JurisdictionRuleSet[] {
  return Array.from(registry.values());
}

registerJurisdiction({
  key: { country: "US", region: "US-CA" },
  active: true,
  lastReviewedAt: "1970-01-01",
  source: "provisional_placeholder",
  nurse: {
    canIssueGeneralGuidance: true,
    canRecommendOtcMedication: true,
    canInitiatePrescriptionReferral: true,
    canPrescribeIndependently: false,
    requiresSupervisingPhysician: true,
  },
  pharmacy: {
    telehealthReferralsAccepted: true,
    otcFulfillmentAllowed: true,
    prescriptionFulfillmentAllowed: true,
    controlledSubstanceFulfillmentAllowed: false,
    requiresLicensedResponsiblePharmacistOnFile: true,
  },
  telehealth: {
    allowed: true,
    allowedConsultationTypes: ["video", "audio", "message"],
    crossBorderConsultationAllowed: false,
    patientMustBePhysicallyPresentInJurisdiction: true,
  },
  emergencyGuidanceText: "If this is a medical emergency, call 911 immediately.",
  emergencyPhoneNumber: "911",
});
