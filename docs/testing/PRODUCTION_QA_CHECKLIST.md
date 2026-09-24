# Production QA Checklist

Status is evidence-based. A checked item requires a passing automated or manual verification record; a route existing is not evidence that a regulated workflow exists.

## Current verified

- [x] `npm ci` completes
- [x] ESLint passes
- [x] TypeScript typecheck passes
- [x] Vitest unit/API tests pass
- [x] Static Pages build passes
- [x] Docker Compose configuration parses
- [x] Public route matrix passes in Chromium, Firefox, WebKit, and mobile Chromium
- [x] Axe checks pass on critical public pages
- [x] Mobile menu and FAQ interactions pass
- [x] No fake patient, payment, licensing, or clinical success states are exposed

## Not implemented

- [ ] Patient authentication, MFA, account recovery, and logout
- [ ] Nurse authentication and verification submission
- [ ] Pharmacy authentication and verification submission
- [ ] Server-side RBAC/ABAC and IDOR tests
- [ ] Consultation lifecycle and status transitions
- [ ] Clinical recommendations and pharmacy referrals
- [ ] Payment provider, webhook, idempotency, refund, and reconciliation flows
- [ ] Wallet/Celo testnet integration
- [ ] WebRTC consultation infrastructure
- [ ] Database integration and state consistency tests
- [ ] Notifications and secure messaging

## External review required

- [ ] Clinical safety review
- [ ] Jurisdiction and legal review
- [ ] Privacy/data-protection review
- [ ] Independent security assessment
- [ ] Payment-provider review
- [ ] Pharmacy/regulatory review
- [ ] Backup restore and disaster-recovery drill

## Release gate

A regulated production release must not proceed while any authentication, authorization, persistence, clinical, payment, or external-review item above remains unresolved.
