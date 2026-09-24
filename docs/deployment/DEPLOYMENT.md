# Deployment Overview

## Public website

The public Next.js site is exported statically and deployed by [.github/workflows/deploy-pages.yml](../../.github/workflows/deploy-pages.yml). The expected project-site URL is:

`https://danmante.github.io/Danmante/`

The workflow runs `npm ci`, lint, typecheck, tests, and `npm run build:pages` before uploading `out/`. The live URL is not considered verified until the GitHub Pages environment reports a successful deployment and the published site has been tested.

## Private backend

GitHub Pages must not host the API, database, authentication service, clinical data, payment webhooks, private storage, or WebRTC signaling. The current [Dockerfile](../../Dockerfile) and [docker-compose.yml](../../docker-compose.yml) provide a root-level API container foundation for private infrastructure, but production deployment is not configured or verified.

Required private services include:

- API and authentication runtime
- PostgreSQL with migration execution, backups, and access controls
- Redis or equivalent infrastructure only when a real feature requires it
- encrypted object storage for documents
- payment provider and webhook endpoint
- verification integrations and review operations
- observability, alerting, incident response, and restore testing

## Local backend startup

```bash
docker compose up -d postgres redis
npm run db:migrate
npm run api
```

The migration runner applies numbered root migrations transactionally and records
completed files in `schema_migrations`. Never edit an already-applied migration;
add the next numbered migration instead.

The API exposes `/health/live` for process liveness and `/health/ready` for
dependency readiness. PostgreSQL is required for readiness; Redis remains optional
until a feature explicitly depends on it, and a configured-but-unwired Redis URL
keeps readiness negative.

## Environment rules

Never place `DATABASE_URL`, service-role keys, JWT secrets, encryption keys, payment secrets, or private wallet keys in the static frontend. Use the environment examples as naming references only; real production values must come from a managed secret store.

## Current status

The static artifact and repository base-path checks pass locally. Backend deployment, database integration, live Pages verification, and production rollback/restore procedures remain external blockers.
