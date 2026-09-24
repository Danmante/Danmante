# API (v1) — Implemented + Planned

Base path: `/api/v1`

## Implemented in this foundation
- `GET /health/live` → process liveness
- `GET /health/ready` → `200` only when all declared dependencies report ready; currently `503` because persistence is not wired
- `GET /api/v1/jurisdictions/check?country=US&region=US-CA&consultationType=video` → `{ decision, emergency }`
- Fastify app factory in `app.ts` for injection-based API tests and separate production startup in `server.ts`

## Planned (per Phase roadmap, not yet implemented)
```
/api/v1/auth
/api/v1/patients
/api/v1/nurses
/api/v1/pharmacies
/api/v1/appointments
/api/v1/consultations
/api/v1/referrals
/api/v1/payments
/api/v1/wallet
/api/v1/verification
/api/v1/jurisdictions   (admin write endpoints)
/api/v1/clinical-rules
/api/v1/fhir
/api/v1/notifications
```

## Error Format
```json
{ "error": { "code": "JURISDICTION_NOT_SUPPORTED", "message": "..." } }
```
Codes are defined in `packages/security/src/errorCodes.ts`. Stack traces and internal details are never returned to clients.
