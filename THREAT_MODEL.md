# Threat Model (Foundation Draft)

| Threat | Impact | Mitigation | Detection | Recovery |
|---|---|---|---|---|
| Account takeover | Unauthorized access to PHI/payment data | MFA, session revocation, rate limiting, anomaly hooks | Failed-login/audit anomaly alerts | Force logout all sessions, password/token reset, notify user |
| Fake healthcare professional | Patient receives unverified "clinical" guidance | Verification state machine, human review gate before "verified" | Admin verification queue, license-expiry job | Suspend account, audit-trail review, notify affected patients |
| Fake pharmacy | Unsafe/unlawful dispensing | Pharmacy verification + jurisdiction engine gate on every request | Audit log of pharmacy_requests vs verification status | Suspend pharmacy, block pending requests |
| PHI exposure (IDOR) | Privacy breach, legal exposure | Object-level authorization on every record fetch, audit-on-access | Audit log query patterns, access-pattern alerts | Incident response per INCIDENT_RESPONSE.md |
| Payment fraud / double-charge | Financial loss, chargebacks | Idempotency keys on `payments`, provider webhook signature verification | Duplicate idempotency-key rejects | Refund workflow, provider dispute process |
| Wallet fraud | Loss of funds, unconfirmed tx treated as paid | Require on-chain confirmation before marking `payments.status = succeeded` | Wallet tx monitoring | Manual reconciliation, provider support |
| Malicious file upload | Malware distribution, storage abuse | Content-type validation, size limits, AV-scan hook (not yet integrated), private buckets | Upload audit log | Quarantine + delete, notify uploader |
| AI misuse (over-trusting output) | Unsafe clinical guidance treated as authoritative | AI output tagged `ai_assisted`, requires professional acknowledgment before becoming part of record | Review of unacknowledged AI content | Retract/correct record, notify professional |
| Supply-chain attack (dependency) | Compromised build | Dependency/secret scanning in CI (`ci.yml`) | Dependabot alerts | Pin/rollback dependency, rebuild |

**Not yet performed:** independent penetration test, live dependency vulnerability scan (blocked by no network access in this build environment), red-team exercise on jurisdiction-bypass attempts.
