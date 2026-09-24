export type ConsultationType = "video" | "audio" | "message";

export interface JurisdictionKey {
  country: string;
  region?: string;
}

export interface NurseScopeRules {
  canIssueGeneralGuidance: boolean;
  canRecommendOtcMedication: boolean;
  canInitiatePrescriptionReferral: boolean;
  canPrescribeIndependently: boolean;
  requiresSupervisingPhysician: boolean;
}

export interface PharmacyRules {
  telehealthReferralsAccepted: boolean;
  otcFulfillmentAllowed: boolean;
  prescriptionFulfillmentAllowed: boolean;
  controlledSubstanceFulfillmentAllowed: boolean;
  requiresLicensedResponsiblePharmacistOnFile: boolean;
}

export interface TelehealthRules {
  allowed: boolean;
  allowedConsultationTypes: ConsultationType[];
  crossBorderConsultationAllowed: boolean;
  patientMustBePhysicallyPresentInJurisdiction: boolean;
}

export interface JurisdictionRuleSet {
  key: JurisdictionKey;
  active: boolean;
  lastReviewedAt: string;
  nurse: NurseScopeRules;
  pharmacy: PharmacyRules;
  telehealth: TelehealthRules;
  emergencyGuidanceText: string;
  emergencyPhoneNumber: string | null;
  source: "externally_reviewed" | "external_review_required" | "provisional_placeholder";
}

export type RuleDecision =
  | { allowed: true }
  | { allowed: false; reasonCode: string; message: string };
