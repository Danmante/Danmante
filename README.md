<p align="center">
  <img src="./docs/project-banner.svg" alt="Danmante project banner" width="960" />
</p>

<p align="center">
  <img src="./danmante-logo.png" alt="Danmante logo" width="120" />
</p>

# Danmante

<p align="center">
  <a href="https://github.com/Danmante/Danmante/actions/workflows/ci.yml"><img src="https://github.com/Danmante/Danmante/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status" /></a>
  <a href="https://github.com/Danmante/Danmante/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.2.35-000000?logo=next.js&logoColor=white" alt="Next.js 14" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://danmante.github.io/Danmante/"><img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github&logoColor=white" alt="GitHub Pages" /></a>
</p>

<p align="center">
  <strong>Healthcare access, connected.</strong>
</p>

Danmante is an open engineering foundation for jurisdiction-aware digital health workflows connecting patients, healthcare professionals, and pharmacies. The project is designed for international expansion without treating healthcare as a speculative crypto product or a casual marketing layer.

The repository includes a public static website, a safety-first architecture, a jurisdiction rules foundation, and a strong compliance-oriented project narrative. It is intentionally transparent about what is implemented versus what still requires external legal, clinical, and operational review.

## Why Danmante

- Builds trust around access, identity, and clinical boundaries
- Keeps jurisdiction, safety, and readiness logic explicit
- Connects patient, nurse, pharmacy, and operational workflows in one architecture
- Maintains a responsible public-facing interface without claiming live clinical service delivery
- Creates a foundation that can grow into regulated healthcare operations with proper review

## Current status

> Danmante is not yet ready for regulated production deployment.

### Implemented

- Public website and static export for GitHub Pages
- Accessible responsive navigation and landing pages
- Role-based public journeys for patients, nurses, pharmacies, and administrators
- Safety and trust content layers
- Jurisdiction rules foundation and regression tests
- API scaffold, database schema, and app factory patterns
- Authentication foundation with secure password hashing, sessions, RBAC guards, recovery flow, and protected dashboard routes
- CI and deployment automation

### Prepared

- Professional identity and onboarding flows
- Pharmacy verification and fulfillment processes
- Multilingual and regional content architecture
- API integration surfaces for future operations

### Not yet implemented

- Database-backed authentication sessions and token persistence
- Transactional email delivery for verification and recovery
- Real patient records or PHI handling
- Clinical consultations, documentation, or prescribing workflows
- Payment provider integrations
- Monitoring, alerting, and incident tooling for regulated deployment
- External legal, privacy, clinical, and security review

See [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md) and [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

## Roadmap

### Phase 1 — Foundation and trust

- finalize public product narrative and navigation
- harden static Pages deployment and domain strategy
- improve safety messaging and governance visibility
- strengthen contributor documentation and issue tracking

### Phase 2 — Operational readiness

- formalize identity, access, and jurisdiction rules
- expand security and compliance review flows
- define pharmacy and provider onboarding processes
- build production-quality API boundaries and observability

### Phase 3 — Clinical and regulatory maturity

- integrate verified professional workflows and approvals
- define patient and provider safety controls in production contexts
- add external compliance and audit planning
- prepare for healthcare-sector review and governance integration

### Phase 4 — Scale responsibly

- multilingual and regional expansion
- interoperability and data portability strategy
- operational adoption in supported jurisdictions only
- continuous safety and legal review as the product evolves

## Repository structure

- `app/`: Next.js App Router site and static metadata routes
- `app/components/`: shared navigation, footer, page-frame, and role-based UI
- `src/`: core domain logic and jurisdiction foundation
- `packages/jurisdiction/`: reusable jurisdiction package
- `packages/security/`: security foundations
- `server.ts`, `routes/`, `app.ts`: API and app scaffolding
- `schema.sql`, `0001_init.sql`, `0002_auth_sessions.sql`: database and authentication persistence foundation
- `migrations/run.ts`: transactional migration runner
- `docs/api/openapi.yaml`: API contract for health, auth, dashboard, and jurisdiction endpoints
- `tests/`, `engine.test.ts`: verification and regression coverage
- `docs/`: architecture, operations, compliance, and readiness documentation

## Quick start

Requirements: Node.js 20 and npm.

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:3000
```

Environment examples are included in:

- [.env.example](.env.example)
- [.env.development.example](.env.development.example)
- [.env.staging.example](.env.staging.example)
- [.env.production.example](.env.production.example)
- [.env.test.example](.env.test.example)

Never expose secrets through `NEXT_PUBLIC_*` variables.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run db:migrate # requires DATABASE_URL and a reachable PostgreSQL instance
```

Static export for GitHub Pages:

```bash
npm run build:pages
```

Security automation runs in [.github/workflows/security.yml](.github/workflows/security.yml)
and includes dependency review, npm audit reporting, and CodeQL analysis.

## GitHub Pages deployment

The deployment workflow lives in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).

It performs:

- dependency installation
- linting
- type checks
- unit tests
- static export
- artifact upload
- Pages deployment

Expected URL after GitHub Pages is enabled:

```text
https://danmante.github.io/Danmante/
```

## Security and healthcare safety

Danmante is designed around safety-first assumptions:

- No secrets, database credentials, or private payment keys belong in the static frontend.
- PHI, diagnoses, clinical notes, prescriptions, and patient records remain off-chain.
- Digital assets, if integrated later, are only payment rails and must never determine clinical eligibility.
- Unsupported or unclear jurisdictions fail closed.
- AI is assistive only where implemented and does not independently diagnose, prescribe, or override professional judgment.
- Danmante is not an emergency service. In an emergency, contact local emergency services immediately.

Review:

- [SECURITY.md](SECURITY.md)
- [CLINICAL_SAFETY.md](CLINICAL_SAFETY.md)
- [PRIVACY.md](PRIVACY.md)
- [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md)

## Internationalization and compliance

English is the default public language. The routing and content structure is prepared for future expansion into Haitian Creole, French, and Spanish.

Legal and compliance materials are draft guidance, not legal advice. They do not claim HIPAA certification, GDPR certification, FDA approval, government approval, or universal healthcare authorization. External legal, privacy, clinical, security, regulatory, and professional review remains required before regulated deployment.

## Community and support

Danmante is designed to be transparent, safe, and contributor-friendly. We welcome thoughtful issues, pull requests, and ideas that improve the project without overstating readiness or misrepresenting clinical safety.

Project health and leadership:

- [CHANGELOG.md](CHANGELOG.md)
- [docs/ROADMAP.md](docs/ROADMAP.md)
- [docs/VERSIONING.md](docs/VERSIONING.md)
- [docs/GITHUB_DISCUSSIONS.md](docs/GITHUB_DISCUSSIONS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md)

Join the conversation:

- [GitHub Discussions](https://github.com/Danmante/Danmante/discussions)
- [Issues](https://github.com/Danmante/Danmante/issues)
- [Pull requests](https://github.com/Danmante/Danmante/pulls)

## Open-source readiness checklist

- [x] clear project vision and honest maturity model
- [x] community documentation and contribution guide
- [x] roadmap and changelog
- [x] issue templates and contributor workflows
- [x] automation for releases and pages deployment
- [x] governance and maintainer structure
- [x] safety and compliance boundaries documented
- [x] versioning, release management, and discussion guidance

## License

MIT.

## Project vision

Danmante aims to become a trustworthy digital foundation for healthcare access, professional workflows, and jurisdiction-aware operations without overselling readiness. The project is intentionally honest about boundaries, safety, and compliance so future expansion can happen with real institutional confidence.
