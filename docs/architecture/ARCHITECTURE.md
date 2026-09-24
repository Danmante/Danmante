# Architecture Overview

## Target direction

Danmante is intentionally designed around a fail-closed, jurisdiction-aware healthcare platform architecture. The system treats clinical workflow legitimacy as a controlled and reviewable decision, not as a convenience feature.

## High-level layers

- Web and public experience
- Patient role experience
- Nurse/professional role experience
- Pharmacy workflow experience
- Admin operational console
- Shared rules and identity packages
- Fastify API service
- Relational database and migration layer
- Integration and observability components

## Domain separation

The architecture separates:

- identity and access management
- jurisdiction and clinical rules
- patient data and encounter records
- pharmacy actions
- payment rails
- audit trail and event records
- non-clinical AI assistance features

This intended boundary is essential because clinical workflows must remain legally and professionally constrained.

## Current implemented status

At present, the repository contains:

- a production-buildable Next.js site
- a jurisdiction engine with fail-closed logic
- a schema for core healthcare entities
- a Fastify skeleton API

The following remain intentionally unimplemented or external-review-bound:

- patient app flows
- professional verification life cycle
- pharmacy fulfillment
- payments
- monitoring and backups
- production auth and authorization

## Principle

The architecture must not permit the software to silently override jurisdiction, licensure, or safety review. Any workflow that is not clearly permitted by the rules engine should be denied, logged, and escalated to a human review path.
