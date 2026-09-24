# Versioning and release strategy

Danmante follows a transparent, safety-first release model built around semantic versioning.

## Semantic versioning

We use the format:

```text
MAJOR.MINOR.PATCH
```

- MAJOR: incompatible product or governance changes, or major architecture shifts
- MINOR: new features, new flows, or notable capability additions
- PATCH: fixes, maintenance, documentation improvements, and small compatibility updates

## Release policy

- tags are created from the main branch only
- release notes must describe scope, risk, and validation status
- safety-sensitive changes must explicitly document the review status
- any major workflow or trust-model changes should include a documented risk note

## Git tag example

```bash
git tag -a v0.2.0 -m "Initial public foundation release"
git push origin v0.2.0
```

## Current maturity

The project is currently in a pre-production foundation stage. This means:

- the public website and repository are intentionally documented as a foundation
- major healthcare operational features are not treated as production-ready
- release notes should reflect the actual maturity of the implemented capability

## Recommended release cadence

- minor releases for product or architecture milestones
- patch releases for fixes and documentation improvements
- major releases only when the project introduces significant product or governance changes
