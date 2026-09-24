# Clinical Workflow Model (Foundation Draft — External Clinical Review Required)

## Scope of Practice
Each nurse record carries a `scope_of_practice` JSON payload keyed by jurisdiction (see `nurses.scope_of_practice`, `packages/jurisdiction` `NurseScopeRules`). The UI must never present an action (e.g. "recommend medication") that the nurse's active jurisdiction rule set does not permit.

## Escalation / Emergency Handling
Booking flows call `getEmergencyGuidance(jurisdiction)` and display it persistently. Structured intake includes an explicit emergency-symptom checklist (not free-text inference) that, if any item is checked, interrupts booking and shows local emergency guidance instead of a scheduling calendar.

## Documentation
Every encounter produces an `encounters` row. AI-assisted summaries are stored in a separate `ai_assisted_summary` column with `ai_assisted = true` and require `professional_reviewed = true` before being treated as part of the authoritative record.

## Consent
`consents` table tracks per-patient, per-purpose consent (telehealth, data sharing, recording) with grant/revoke timestamps, queried before enabling the corresponding feature.

## Referral / Medication Workflow
See `docs/architecture/ARCHITECTURE.md` "Data Flow" section — every medication request passes the jurisdiction engine twice: once for the nurse's referral authority, once for the pharmacy's fulfillment eligibility.

**This document does not constitute medical protocol content.** Actual clinical decision criteria, symptom checklists, and escalation thresholds must be authored/reviewed by a licensed clinical professional before production use.
