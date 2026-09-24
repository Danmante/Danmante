# Production Readiness Report

**Status: NOT PRODUCTION-READY.** This repository is a verified engineering foundation with a static public website and a small Fastify safety API. It is not a live clinical, pharmacy, payment, or patient-record system.

## Repository architecture

- `app/` contains the active Next.js App Router website and static GitHub Pages routes.
- `src/` contains the canonical jurisdiction types, registry, and fail-closed decision engine.
- `app.ts` is the reusable Fastify application factory; `server.ts` is the production port entrypoint.
- `schema.sql` and `0001_init.sql` contain the current PostgreSQL foundation.
- `packages/` contains small workspace packages that re-export the current domain/security foundation.
- `.github/workflows/ci.yml` and `.github/workflows/deploy-pages.yml` are the active workflows.

Several root-level duplicate manifests and legacy files describe abandoned pnpm/Turborepo layouts. They are not active runtime sources and require a deliberate archival/removal pass.

## Subsystem status

| Subsystem | Classification | Evidence |
| --- | --- | --- |
| Public website | IMPLEMENTED | Static Next.js routes, responsive shell, metadata, legal drafts, Pages build |
| Patient application | PREPARED | Public information architecture only; no auth or patient records |
| Nurse application | PREPARED | Public information architecture only; no credential workflow |
| Pharmacy application | PREPARED | Public information architecture only; no fulfillment workflow |
| Admin application | PREPARED | Public information architecture only; no admin controls |
| Jurisdiction engine | IMPLEMENTED | Unit-tested fail-closed decisions; provisional/stale rules denied |
| API foundation | IMPLEMENTED | Fastify factory, health routes, validated jurisdiction endpoint, injection tests |
| Database | FOUNDATION ONLY | Schema and migration exist; no adapter, migration runner, or production database |
| Authentication/RBAC | NOT IMPLEMENTED | No sessions, MFA, server authorization, or object-level policy enforcement |
| Verification | NOT IMPLEMENTED | Status model exists in schema/docs, no review service or evidence workflow |
| Payments/wallet | NOT IMPLEMENTED | Boundary documented; no provider, webhook, reconciliation, or wallet integration |
| Telehealth/WebRTC | NOT IMPLEMENTED | No signaling or secure consultation session service |
| Internationalization | PREPARED | English content and route structure; no translation dictionaries/runtime |
| Accessibility | FOUNDATION ONLY | Semantic markup, focus states, reduced motion, and passing axe checks on critical public pages; full product workflows remain untested |
| SEO | IMPLEMENTED | Metadata, favicon, manifest, static robots and sitemap |
| CI/CD | IMPLEMENTED | npm-based CI and Pages workflows pass locally; GitHub-hosted run not independently verified |
| GitHub Pages | DEPLOYMENT READY | Static artifact and `/Danmante` base-path checks pass; live URL not verified |
| Backend deployment | PREPARED | Dockerfile/Compose target the root API; database/Redis wiring remains incomplete |

## Actual verification

The following commands have passed in the repository:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run build:pages
git diff --check
```

The test suite covers jurisdiction decisions, Fastify injection boundaries, public route navigation, responsive menu behavior, FAQ disclosure, and axe accessibility checks. Chromium, Firefox, WebKit, and mobile Chromium public-site runs have passed independently. Local HTTP smoke checks verified the public routes, robots, sitemap, and homepage content. Live Pages verification, database integration, payment/security workflow tests, and authenticated E2E remain unimplemented because those product systems do not exist yet.

## Clinical and security posture

- Provisional, inactive, malformed, future-dated, and stale jurisdiction rules fail closed.
- Clinical data, PHI, prescriptions, diagnoses, and notes remain outside payment/blockchain boundaries.
- The API validates jurisdiction inputs and does not expose stack traces in client responses.
- Readiness returns `503` until persistence dependencies are actually wired.
- No production authentication, authorization, secrets management, or object-level access control is implemented yet.

## External review required

- Jurisdiction-specific legal and clinical review
- Professional and pharmacy verification review
- Independent security assessment and penetration testing
- Privacy/data-protection review
- Payment-provider and regulated pharmacy review
- Production backup/restore and incident-response validation

## Exact next production blockers

1. Implement authentication, MFA, server-side RBAC/ABAC, and IDOR tests.
2. Wire PostgreSQL migrations, database access, audit persistence, and readiness checks.
3. Implement human-reviewed professional and pharmacy verification.
4. Add provider-isolated payment state, webhook verification, idempotency, and reconciliation.
5. Add API integration, accessibility, and E2E test suites.
6. Upgrade remaining vulnerable backend dependencies through a compatibility-tested major-version pass.
7. Perform independent clinical, legal, privacy, and security review before regulated use.
