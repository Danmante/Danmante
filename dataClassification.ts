export type DataClass =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SENSITIVE"
  | "PHI"
  | "PAYMENT_SENSITIVE"
  | "SECURITY_SENSITIVE";

export interface FieldClassification {
  field: string;
  class: DataClass;
  encryptAtRest: boolean;
  auditOnAccess: boolean;
}

// Example classification map for the `patients` table. Real maps live
// alongside each domain package (packages/clinical, packages/identity, etc).
export const patientFieldClassification: FieldClassification[] = [
  { field: "full_name", class: "SENSITIVE", encryptAtRest: true, auditOnAccess: true },
  { field: "date_of_birth", class: "SENSITIVE", encryptAtRest: true, auditOnAccess: true },
  { field: "diagnosis_notes", class: "PHI", encryptAtRest: true, auditOnAccess: true },
  { field: "country", class: "INTERNAL", encryptAtRest: false, auditOnAccess: false },
  { field: "preferred_language", class: "PUBLIC", encryptAtRest: false, auditOnAccess: false },
];
