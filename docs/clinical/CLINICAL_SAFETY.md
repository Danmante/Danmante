# Clinical Safety

## Scope

This document defines the safety boundary for Danmante's platform and design guidance for the current repository baseline.

## High-level principles

- The platform does not replace emergency care.
- The platform does not replace licensed clinical judgment.
- AI may assist with translation, intake organization, note summarization, and admin tasks, but it must not independently diagnose, prescribe, or override clinical rules.
- Jurisdiction checks fail closed and deny workflows when legal or professional authority is unclear.
- Human review remains required for verifying professionals and pharmacy workflows.

## Prohibited autonomous actions

- Independent diagnosis
- Independent prescribing or treatment authorization
- Overrides of professional licensure and scope-of-practice rules
- Automatic approval of clinical workflows when legal authority is not confirmed

## Allowed assistive functions

- Translation and multilingual support
- Intake structuring
- Administrative summaries
- Scheduling and reminder assistance
- Accessibility support
- General education content that does not replace clinician judgment

## Emergency guidance

If a person is in a medical emergency, they should contact local emergency services immediately.

## Production requirement

Clinical safety decisions require legal review, clinical review, and operational safeguards before real-world use.
