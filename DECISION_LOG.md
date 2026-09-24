# Architecture Decision Log

## ADR-001: Fail-closed jurisdiction engine
**Decision:** Any jurisdiction not explicitly registered and marked `active` blocks the relevant workflow.
**Rationale:** Healthcare regulation varies by country/region; assuming permissiveness risks unlawful or unsafe workflows (see CLINICAL_SAFETY.md §1).
**Status:** Accepted.

## ADR-002: Blockchain isolated from clinical data
**Decision:** `wallet_transactions` never stores clinical fields; clinical tables never reference chain identifiers.
**Rationale:** Medical records must never be immutable/public in the way blockchain data is, and clinical availability must not depend on chain availability.
**Status:** Accepted.

## ADR-003: Monorepo via pnpm workspaces + Turborepo
**Decision:** Use Turborepo over Nx for this stage.
**Rationale:** Simpler config surface for the current team size; revisit if build-graph complexity grows.
**Status:** Accepted, revisit at Phase 5+.
