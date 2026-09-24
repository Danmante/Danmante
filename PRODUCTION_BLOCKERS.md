# Production Blockers

## Engineering blockers

- Authentication and server-side RBAC foundations are implemented, but they still use an in-memory adapter and do not provide production MFA.
- Patient, nurse, pharmacy, and admin workflows beyond access control are not operational.
- The repository is a buildable foundation, not a complete health platform backend.
- Real telehealth, consultation, pharmacy fulfillment, and payment services remain unimplemented.

## Security blockers

- Dependency audit still reports notable vulnerabilities in the current toolchain and must be resolved or explicitly accepted with full review.
- No full secret-scanning, vulnerability review, or penetration test has been completed.
- No production-grade secret management pipeline is in place, and password recovery email delivery is not connected.

## Clinical blockers

- All clinical workflows remain subject to external clinical review.
- The jurisdiction engine is intentionally fail-closed but still requires legal and clinical validation for production use.
- AI support remains assistive only and must not become authoritative clinical logic.

## Legal blockers

- Jurisdiction-specific legal review is required before any live patient, prescribing, or pharmacy workflow is deployed.
- Privacy notices and terms require jurisdiction-specific legal review.

## Regulatory blockers

- No region-specific professional scope or telehealth rules have been verified against actual regulator requirements.
- Pharmacy and controlled-substance pathways remain legally unapproved without external review.

## External audit blockers

- Penetration test required.
- Privacy review required.
- Clinical safety review required.
- Security architecture review required.

## Mainnet/payment blockers

- Blockchain and wallet flows must remain disabled for clinical data and must not be treated as confirmed payment success without proper validation.
- Payment provider integrations are not production-approved and should not be used for real patient billing until reviewed.
