# Clinical Safety Policy

## Purpose

This project is built around a fail-closed, safety-aware healthcare architecture. It is not a replacement for licensed professional judgment, emergency care, pharmacy regulation, or local jurisdiction law.

## Safety boundaries

- Danmante is not an emergency service.
- Local emergency services must be contacted in medical emergencies.
- AI is support tooling only: it may assist with translation, intake organization, scheduling, and summaries.
- AI must not diagnose, prescribe, override clinicians, determine licensure, or approve clinical workflows.
- A user must never be presented with care flows that are not explicitly permitted by the jurisdiction rules engine.

## Clinical risk handling

- workflows fail closed when the legality or scope is unknown
- jurisdiction rules must be versioned and auditable
- verification status must remain human-reviewable
- pharmacy and prescribing steps must be restricted by legal scope

## Current status

The repository includes a working fail-closed jurisdiction engine and safety-oriented documentation. It does not yet constitute a real clinical operations system or a clinically reviewed product for live patient deployment.

## External review requirement

Healthcare legal review, clinical safety review, and professional licensing review remain required before any real-world patient or pharmacy use.
