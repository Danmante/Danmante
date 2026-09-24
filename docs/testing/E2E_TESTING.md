# E2E Testing

## Current scope

The repository currently has a static Next.js public website and a small Fastify API foundation. Playwright tests cover the real behavior available today:

- all public, role, safety, legal, and alias routes
- desktop navigation to the patient experience
- responsive mobile navigation open/close and route selection
- FAQ disclosure behavior
- role-page implementation status messaging
- footer/legal/emergency pathways
- basic axe accessibility checks on critical pages
- visible keyboard focus

Patient registration, authentication, consultations, payments, recommendations, pharmacy fulfillment, and RBAC journeys are not tested because those systems are not implemented yet. Adding fake credentials or fake success responses would make the test suite misleading.

## Commands

```bash
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

Run one project:

```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile-chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

The Playwright config starts the actual Next development server, uses accessible selectors, retries in CI, and retains screenshots, videos, and traces when tests fail. Reports are written to `playwright-report/`; failure artifacts are written to `test-results/`.

## Browser matrix

- Chromium desktop
- Firefox desktop
- WebKit desktop
- Chromium iPhone 13 emulation

The CI workflow installs all four browser engines and uploads the HTML report after every run. The test suite does not use production data, credentials, payment providers, or healthcare records.

## API tests

Fastify routes are tested through `app.ts` and `app.inject()` in [tests/api.test.ts](../../tests/api.test.ts). These tests cover unknown and provisional jurisdictions, request validation, and honest readiness status without requiring a database or Redis instance.

## Test-data policy

No patient, nurse, pharmacy, payment, license, or clinical fixtures are currently required. When those workflows are implemented, use disposable local identities and synthetic records only. Never use real PHI, production credentials, or production funds.

## Known test boundary

The public site is static and informational. Browser tests prove navigation and accessibility behavior, not medical authorization, identity verification, payment settlement, or clinical safety. Those must be backed by server-side integration tests before the corresponding product workflows can be considered ready.
