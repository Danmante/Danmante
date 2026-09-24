# Disaster Recovery

## Objectives (draft — confirm with infra review)
- RPO (Recovery Point Objective): ≤ 15 minutes for the primary PostgreSQL database (via continuous WAL archiving).
- RTO (Recovery Time Objective): ≤ 4 hours for full platform restoration.

## Backup Strategy
- Automated nightly full backups + continuous WAL archiving to encrypted, versioned object storage.
- Backups are useless until restore is tested: a quarterly restore drill is required (`scripts/restore-drill.sh`, to be scheduled in CI as a manual workflow).

## Restore Procedure (outline)
1. Provision fresh database instance.
2. Restore latest full backup.
3. Replay WAL to target point-in-time.
4. Run migration validation (`database/migrations`).
5. Smoke-test critical paths (auth, appointment read, payment status read) before re-opening traffic.

## Status
Backup automation and restore-drill scripting are **not yet implemented** in this repository — tracked as a Phase 8 blocker in `PRODUCTION_READINESS_REPORT.md`.
