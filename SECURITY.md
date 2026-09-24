# Security Policy

## Current status

This repository is an engineering foundation, not a production healthcare platform. Security controls are intentionally documented and some foundations exist, but the project still requires external review before deployment to real users.

## Vulnerability reporting

Do not open a public GitHub issue for security vulnerabilities. Use a private channel for responsible disclosure before production deployment. A monitored security contact must be established before live usage.

## Security principles

- secure-by-default configuration
- fail-closed jurisdiction checks
- explicit separation of clinical and operational logic
- no secrets in repository files
- validation of required environment variables before production startup
- no unsupported claim of production security certification

## Known gaps

- no production auth provider or secure session model
- no real RBAC or object-level authorization enforcement
- no full OWASP review or external penetration test
- no production secrets management or rotation policy
- no real dependency or container vulnerability policy enforced in a deployment pipeline

## Required pre-production work

Before any live deployment, the project must implement:

- identity and authentication flow
- MFA and recovery process
- role-based and resource-based authorization
- API rate limits and abuse monitoring
- environment-specific secrets management
- dependency scanning and vulnerability response process
- external security review

## Important note

This repository is designed to support applicable security requirements, but it is not a claim of security certification or production authorization.
