# Incident Response Plan

## Severity Levels
- SEV1: PHI breach, payment system compromise, full outage.
- SEV2: Partial outage, suspected unauthorized access without confirmed breach.
- SEV3: Degraded performance, non-security bug with user impact.

## Response Steps
1. Detect (monitoring alert, report, or audit anomaly).
2. Contain (revoke sessions/tokens, disable affected endpoint, isolate service).
3. Assess scope using the current audit-log foundation (`index.ts`) and any configured persistence records.
4. Notify affected users and relevant regulators per jurisdiction requirements (legal review required per jurisdiction — see `PRODUCTION_READINESS_REPORT.md`).
5. Remediate and patch.
6. Post-incident review, logged in `docs/architecture/DECISION_LOG.md`.

## On-call / Escalation
Placeholder — to be defined with real contacts before production deployment.
