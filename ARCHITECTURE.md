# Architecture Overview

## Current system

Danmante currently has two deliberately separate surfaces:

1. **Public static website:** Next.js App Router, exported to `out/`, and deployable to GitHub Pages under `/Danmante/`.
2. **Backend foundation:** Fastify application factory and server entrypoint for future private infrastructure. This service is not hosted on GitHub Pages and does not yet provide authentication, patient records, or clinical transactions.

## Runtime boundaries

```text
GitHub Pages
  -> public website and non-sensitive product/demo content

Separate private infrastructure
  -> API, authentication, database, storage, payments, verification, notifications, telehealth, observability
```

The static frontend must never receive database credentials, service-role keys, JWT secrets, encryption keys, payment secrets, or private wallet keys. `NEXT_PUBLIC_*` values are public configuration only.

## Code ownership

- `app/`: active website routes and shared UI shell
- `src/`: canonical jurisdiction domain logic
- `app.ts`: testable Fastify application factory
- `server.ts`: API process entrypoint
- `routes/`: API route modules
- `schema.sql`: current database foundation
- `packages/`: reusable domain/security package entrypoints
- `tests/`: unit and API boundary tests

## Safety model

Jurisdiction decisions are centralized and fail closed. A rule must be active, explicitly marked `externally_reviewed`, validly dated, and reviewed within the current policy window before clinical or pharmacy eligibility can be allowed. The frontend may display guidance, but it is not an authorization boundary.

AI is assistive only where implemented. It cannot diagnose, prescribe, override professional judgment, or bypass jurisdiction rules. Clinical data and PHI remain off-chain.

## Production gap

The repository is not a complete monorepo despite legacy manifests describing one. Authentication, authorization, persistence, verification, payment orchestration, telehealth, and operational infrastructure require separate implementation and external review. See [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md).
