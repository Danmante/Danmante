# Contributing to Danmante

## Contribution principles

- prioritize correctness and safety over feature speed
- keep clinical decisions and jurisdiction rules separate from software convenience
- do not claim production readiness without evidence
- do not implement fake healthcare workflows or fabricated user outcomes

## Development workflow

1. Create a feature branch.
2. Install dependencies with npm.
3. Run the relevant tests and type checks.
4. Keep documentation honest about implementation status.
5. Open a pull request with a clear description of risk and validation.

## Required validation

Before merging, run:

```bash
npm run typecheck
npm test
npm run build
```

## Safety-sensitive areas

Any change touching:

- jurisdiction and permission logic
- clinical workflows
- verification lifecycle
- pharmacy operations
- payments
- security boundaries

must be reviewed with the repository’s safety and security guidance before merge.

## Code quality expectations

- prefer TypeScript types over `any`
- keep domain logic in shared packages, not duplicated app code
- avoid placeholder or fake production behavior
- document limitations honestly
