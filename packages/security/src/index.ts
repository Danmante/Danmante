export const ErrorCodes = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  FORBIDDEN: "FORBIDDEN",
  VERIFICATION_REQUIRED: "VERIFICATION_REQUIRED",
  LICENSE_EXPIRED: "LICENSE_EXPIRED",
  JURISDICTION_NOT_SUPPORTED: "JURISDICTION_NOT_SUPPORTED",
  CONSULTATION_NOT_ALLOWED: "CONSULTATION_NOT_ALLOWED",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  EMERGENCY_ESCALATION: "EMERGENCY_ESCALATION",
  PHARMACY_NOT_ELIGIBLE: "PHARMACY_NOT_ELIGIBLE",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export class DanmanteError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, httpStatus = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
  }

  toJSON() {
    return { error: { code: this.code, message: this.message } };
  }
}
