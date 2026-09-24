# Jurisdiction Engine

This repository includes a fail-closed jurisdiction engine intended to block unsafe workflows when legal authority is unclear.

## Rules required

- Country and region
- Profession and license type
- Service type and telehealth rules
- Prescribing and pharmacy permissions
- Cross-border restrictions
- Effective dates and version control

## Safety requirement

The engine must deny access by default when a rule is missing, stale, or not externally reviewed.
