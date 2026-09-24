# Security Policy

## Current status

This repository is an engineering foundation, not a production healthcare platform. Security controls are intentionally documented and some foundations exist, but the project still requires external review before deployment to real users.

## Vulnerability reporting

Please do not open a public GitHub issue for a security vulnerability.

Instead, report it privately through the repository security process and allow maintainers time to assess and remediate the issue before public disclosure.

For direct reporting, send a message to:

- security@danmante.com

Please include:

- a concise description of the vulnerability
- reproduction steps or proof of concept
- affected version or branch
- impact assessment and suggested remediation if available

We ask that reporters allow a reasonable response window before publishing details publicly.

## Security principles

- secure-by-default configuration
- fail-closed jurisdiction checks
- explicit separation of clinical and operational logic
- no secrets in repository files
- validation of required environment variables before production startup
- clear documentation of limitations and unknowns
- no unsupported claim of production security certification

## Known gaps

- no production auth provider or secure session model
- no real RBAC or object-level authorization enforcement
- no full OWASP review or external penetration test
- no production secrets management or rotation policy
- no real dependency or container vulnerability policy enforced in a deployment pipeline
- no live healthcare operational environment or patient data processing boundary

## Required pre-production work

Before any live deployment, the project must implement:

- identity and authentication flow
- MFA and recovery process
- role-based and resource-based authorization
- API rate limits and abuse monitoring
- environment-specific secrets management
- dependency scanning and vulnerability response process
- external security review
- defined operational incident response and escalation procedure

## Responsible disclosure expectations

We appreciate reports that are acted on responsibly. We do not expect reporters to perform dangerous or invasive testing against production systems. Please avoid exfiltration of real patient or operational data, and stay within the bounds of a safe, ethical security assessment.

## Important note

This repository is designed to support applicable security requirements, but it is not a claim of security certification or production authorization.
