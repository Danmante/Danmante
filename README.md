<p align="center">
  <img src="./danmante-logo.png" alt="Danmante logo" width="140" />
</p>

# Danmante

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
- CI and deployment automation

### Prepared

- Professional identity and onboarding flows
- Pharmacy verification and fulfillment processes
- Multilingual and regional content architecture
- API integration surfaces for future operations

### Not yet implemented

- Production authentication and RBAC
- Real patient records or PHI handling
- Clinical consultations, documentation, or prescribing workflows
- Payment provider integrations
- Monitoring, alerting, and incident tooling for regulated deployment
- External legal, privacy, clinical, and security review

See [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md) and [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

## Repository structure

- `app/`: Next.js App Router site and static metadata routes
- `app/components/`: shared navigation, footer, page-frame, and role-based UI
- `src/`: core domain logic and jurisdiction foundation
- `packages/jurisdiction/`: reusable jurisdiction package
- `packages/security/`: security foundations
- `server.ts`, `routes/`, `app.ts`: API and app scaffolding
- `schema.sql`, `0001_init.sql`: database foundation
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
```

Static export for GitHub Pages:

```bash
npm run build:pages
```

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

## License

MIT.

## Project vision

Danmante aims to become a trustworthy digital foundation for healthcare access, professional workflows, and jurisdiction-aware operations without overselling readiness. The project is intentionally honest about boundaries, safety, and compliance so future expansion can happen with real institutional confidence.
