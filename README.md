# Danmante

**Healthcare access, connected.**

Danmante is an open engineering foundation for jurisdiction-aware digital health workflows connecting patients, healthcare professionals, and pharmacies. The project is founded by Johnny Dubic and is designed for international expansion without treating healthcare as a cryptocurrency product.

The public website is available as a static Next.js experience. It communicates the product direction and prepared workflows honestly; it is not a live clinical service.

## What is included

- Responsive public website with accessible mobile navigation
- Patient, nurse, pharmacy, operations, safety, company, sign-in, and legal routes
- Fail-closed jurisdiction rules engine with regression tests
- Fastify API scaffold and foundational relational schema
- Testable Fastify app factory with jurisdiction and readiness boundary tests
- Root-level Docker/Compose API foundation for private infrastructure
- Playwright browser E2E and axe accessibility coverage for implemented public journeys
- Static export configuration for GitHub Pages
- GitHub Actions quality and Pages deployment workflows
- Draft privacy, terms, cookie, and accessibility content requiring review

## Current status

**NOT YET READY for regulated production deployment.**

Implemented: public website, static export, design system, route structure, metadata, jurisdiction foundation, test/build pipeline, and honest status messaging.

Prepared: patient/professional/pharmacy/admin information architecture, authentication entry points, verification concepts, payment boundaries, multilingual extension points, and API integration surfaces.

Not implemented: production authentication and RBAC, real patient records, live consultations, professional or pharmacy verification, clinical documentation, payment provider integration, operational monitoring, and external clinical/legal/security review.

See [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md) and [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

## Architecture

- `app/`: Next.js App Router website and static metadata routes
- `app/components/`: shared navigation, footer, page-frame, role, and legal surfaces
- `src/`: jurisdiction and domain foundation
- `packages/jurisdiction/`: reusable jurisdiction package
- `packages/security/`: security foundation package
- `server.ts`, `routes/`: Fastify/API scaffold
- `app.ts`: reusable Fastify application factory for API tests and private deployment
- `schema.sql`, `0001_init.sql`: database foundation
- `tests/`, `engine.test.ts`: regression coverage
- `docs/`: audit, architecture, safety, operations, and readiness documentation

The existing healthcare, security, jurisdiction, and database architecture remains the source of truth. The website does not bypass server-side controls or claim to replace them.

## Local development

Requirements: Node.js 20 and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Environment examples are provided in `.env.example`, `.env.development.example`, `.env.staging.example`, `.env.production.example`, and `.env.test.example`. Never expose server secrets through `NEXT_PUBLIC_*` variables.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

The normal build uses static export because the public website is Pages-compatible. The explicit Pages build is:

```bash
npm run build:pages
```

## GitHub Pages

The deployment workflow is [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml). It runs install, lint, typecheck, tests, static build, artifact upload, and Pages deployment on pushes to `main` or manual dispatch.

Expected project URL after GitHub Pages is enabled for the repository:

`https://danmante.github.io/Danmante/`

The repository uses `/Danmante` as the Pages base path in Actions, trailing-slash routes, unoptimized static-compatible images, and generated sitemap/robots metadata. Deployment is not claimed as live until the GitHub Pages environment actually reports success.

## Security and healthcare safety

- No secrets, database credentials, or private payment keys belong in the static frontend.
- PHI, diagnoses, clinical notes, prescriptions, and patient records must remain off-chain.
- Digital assets, if integrated later, are payment rails only and must not determine clinical eligibility.
- Unsupported or unclear jurisdictions must fail closed.
- AI is assistive only where implemented and cannot independently diagnose, prescribe, or override professional judgment.
- Danmante is not an emergency service. In an emergency, contact local emergency services immediately.

Read [SECURITY.md](SECURITY.md), [CLINICAL_SAFETY.md](CLINICAL_SAFETY.md), [PRIVACY.md](PRIVACY.md), and [PRODUCTION_BLOCKERS.md](PRODUCTION_BLOCKERS.md).

## Internationalization

English is the default public language. The route and content structure is ready to support Haitian Creole, French, and Spanish through a future locale layer. Availability and healthcare services depend on local laws, licensing, and supported jurisdictions; the website does not claim universal availability.

## Legal and compliance

Privacy, terms, cookies, and accessibility pages are drafts. They are not legal advice and do not claim HIPAA certification, GDPR certification, FDA approval, government approval, or universal healthcare authorization. External legal, privacy, clinical, security, regulatory, and professional review is required before regulated deployment.

## License

MIT.
