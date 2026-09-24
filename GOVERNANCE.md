# Governance

Danmante is maintained as an open-source project under the direction of its founder, Johnny Dubic, with technical decisions made through open pull requests and documented in `docs/architecture/DECISION_LOG.md`.

## Decision Categories
- **Engineering decisions** (architecture, tooling, code structure): resolved by maintainer review + CI passing.
- **Clinical-safety decisions** (scope of practice defaults, emergency-escalation criteria, jurisdiction rule content): require sign-off from a qualified clinical reviewer before merge — engineering alone cannot approve these.
- **Legal/compliance decisions** (terms, privacy policy language, regulatory claims): require legal review before merge.

## Maintainer Responsibilities
Enforce `CLINICAL_SAFETY.md` and `SECURITY.md` on every PR touching consultation, pharmacy, verification, payment, or PHI-handling code.
