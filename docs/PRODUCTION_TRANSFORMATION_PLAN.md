# Production transformation plan

## Executive summary

The repository currently contains a solid public website and a strong architectural foundation, but it is not yet a real operational production healthcare platform. The main gaps are in server-side authentication, authorization, database-backed user operations, session security, production deployment, and external configuration.

## Current state

### Present

- Next.js public site with static export support in [next.config.js](../next.config.js)
- Fastify scaffolding in [server.ts](../server.ts) and [app.ts](../app.ts)
- API routes in [routes](../routes)
- database schema in [schema.sql](../schema.sql) and [0001_init.sql](../0001_init.sql)
- jurisdiction logic in [src](../src) and [packages](../packages)
- quality gates in [package.json](../package.json) and [.github/workflows/ci.yml](../.github/workflows/ci.yml)
- static website deployment in [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
- tests in [tests](../tests) and [e2e](../e2e)
- migration runner in [migrations/run.ts](../migrations/run.ts)

### Missing or not production-operational

- production database-backed identity system
- transactional session and token persistence
- production MFA and email delivery
- email verification and reset flows
- password hashing with production-grade security
- admin portal enforcement and auditing
- full payment workflow with secure server-side confirmation
- complete patient, nurse, pharmacy, and admin app experiences backed by real data
- deployment to a production-capable hosting environment
- real external providers for email, auth, and payments

## Production target

The end-state is a secure healthcare platform with separate public website and application surfaces, backed by a real backend, authenticated sessions, protected routes, RBAC, database records, and production deployment infrastructure.

## Phases

### Phase 1 — App foundation

- define user and role model
- design secure session model
- implement auth APIs and protected route guards
- add validation and error handling
- implement email verification and password reset flows
- run numbered database migrations transactionally

### Phase 2 — Real data and governance

- finalize database schema for users, sessions, roles, profiles, verification, audit logs
- enforce server-side authorization and data ownership rules
- add logging and audit trail for privileged actions
- add server-side validation before any state changes

### Phase 3 — Role portals

- patient dashboard and profile experience
- nurse onboarding and verification flows
- pharmacy management and verification workflows
- admin dashboard and audit tooling

### Phase 4 — Production security and operations

- production secrets and environment management
- rate limiting, abuse protections, and hardened cookies
- dependency audits and security reviews
- health checks, monitoring, and deployment automation
- domain and TLS configuration

### Phase 5 — Full verification

- unit, integration, and E2E coverage for registration/login/logout/RBAC
- production deployment verification
- domain and HTTPS testing
- rollback and incident readiness checks

## Hard blockers

These cannot be fully completed without external configuration or provider integration:

- transactional email provider
- production auth provider or secure identity service
- real domain and DNS configuration
- real payment provider credentials
- healthcare regulator and compliance review for live patient workflows
- production database hosting and backup automation

## Conclusion

The repository is a credible engineering foundation and a strong public-facing product prototype, but it is not yet a real production healthcare application. The next implementation steps must focus on real backend identity, enforced authorization, reliable database models, and external production services.
