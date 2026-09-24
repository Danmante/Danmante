import { getJurisdiction } from "./registry";
import type { ConsultationType, JurisdictionKey, RuleDecision } from "./types";

const MAX_RULE_AGE_MS = 365 * 24 * 60 * 60 * 1000;

function hasCurrentExternalReview(rules: NonNullable<ReturnType<typeof getJurisdiction>>): boolean {
  const reviewedAt = Date.parse(rules.lastReviewedAt);
  return (
    rules.source === "externally_reviewed" &&
    Number.isFinite(reviewedAt) &&
    reviewedAt <= Date.now() &&
    Date.now() - reviewedAt <= MAX_RULE_AGE_MS
  );
}

function getUsableRules(key: JurisdictionKey) {
  const rules = getJurisdiction(key);
  return rules && rules.active && hasCurrentExternalReview(rules) ? rules : null;
}

export function canBookConsultation(
  key: JurisdictionKey,
  type: ConsultationType
): RuleDecision {
  const rules = getUsableRules(key);

  if (!rules || !rules.active) {
    return {
      allowed: false,
      reasonCode: "JURISDICTION_NOT_SUPPORTED",
      message: "Telehealth is not yet configured for this jurisdiction.",
    };
  }

  if (!rules.telehealth.allowed) {
    return {
      allowed: false,
      reasonCode: "JURISDICTION_NOT_SUPPORTED",
      message: "Telehealth consultations are not permitted in this jurisdiction.",
    };
  }

  if (!rules.telehealth.allowedConsultationTypes.includes(type)) {
    return {
      allowed: false,
      reasonCode: "CONSULTATION_NOT_ALLOWED",
      message: `${type} consultations are not permitted in this jurisdiction.`,
    };
  }

  return { allowed: true };
}

export function canNursePrescribeReferral(key: JurisdictionKey): RuleDecision {
  const rules = getUsableRules(key);

  if (!rules || !rules.active) {
    return {
      allowed: false,
      reasonCode: "JURISDICTION_NOT_SUPPORTED",
      message: "Prescribing rules are not configured for this jurisdiction.",
    };
  }

  if (!rules.nurse.canInitiatePrescriptionReferral) {
    return {
      allowed: false,
      reasonCode: "CONSULTATION_NOT_ALLOWED",
      message: "Nurses in this jurisdiction may not initiate a prescription referral.",
    };
  }

  return { allowed: true };
}

export function canPharmacyFulfill(
  key: JurisdictionKey,
  opts: { controlledSubstance: boolean; requiresPrescription: boolean }
): RuleDecision {
  const rules = getUsableRules(key);

  if (!rules || !rules.active) {
    return {
      allowed: false,
      reasonCode: "PHARMACY_NOT_ELIGIBLE",
      message: "Pharmacy rules are not configured for this jurisdiction.",
    };
  }

  if (opts.controlledSubstance && !rules.pharmacy.controlledSubstanceFulfillmentAllowed) {
    return {
      allowed: false,
      reasonCode: "PHARMACY_NOT_ELIGIBLE",
      message: "Controlled-substance fulfillment is not permitted in this jurisdiction.",
    };
  }

  if (opts.requiresPrescription && !rules.pharmacy.prescriptionFulfillmentAllowed) {
    return {
      allowed: false,
      reasonCode: "PHARMACY_NOT_ELIGIBLE",
      message: "Prescription fulfillment is not permitted for this pharmacy's jurisdiction.",
    };
  }

  if (!opts.requiresPrescription && !rules.pharmacy.otcFulfillmentAllowed) {
    return {
      allowed: false,
      reasonCode: "PHARMACY_NOT_ELIGIBLE",
      message: "OTC fulfillment is not permitted for this pharmacy's jurisdiction.",
    };
  }

  return { allowed: true };
}

export function getEmergencyGuidance(key: JurisdictionKey) {
  const rules = getJurisdiction(key);
  return {
    text:
      rules?.emergencyGuidanceText ??
      "If this is a medical emergency, contact your local emergency services immediately.",
    phone: rules?.emergencyPhoneNumber ?? null,
  };
}
