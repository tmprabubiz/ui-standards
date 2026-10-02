# Changelog

## 1.4.0 — 2026-10-02

- Replaced the short slice walkthrough with an owner-confirmed per-screen contract covering visual design, states, data, interactions, associated elements, responsiveness, accessibility, navigation, first-run differences and risks.
- Require every catalogue entry to declare its composed dependencies and validate the walkthrough dimensions and version metadata.
- Preserve owner-added skill files during reinstall and document the validator's development-only YAML dependency.

## 1.3.0 — 2026-10-01

- Reframed the skill as context-first guidance for any app/domain; examples and profiles are retrieval aids, not a closed taxonomy.
- Replaced the fixed feature questionnaire with open-ended discovery across user goal, domain, data/rights, runtime, build host, deployment, outside services and cost.
- Added open-world capability routing and an explicit uncatalogued-needs path; unknown requirements are written into coverage and next iteration instead of forced into a nearby code.
- Added remote build/cloud-environment guidance for machines without local Docker, virtualization or GPUs, plus provider-neutral AWS/GCP service examples.
- Added AI/media, source-grounded knowledge, cloud resource, remote image build and deployment patterns.
- Rewrote PROCESS.md into one ordered context-to-verified-slices workflow.
- Reframed the README plan comparison as one bounded field-recordings planning case study, not general proof of coverage.
- Audited all 19 local research reports into 27 observable UI behavior checks; identified live collaboration and offline sync as partial/open.
- Ran six fresh-context ADVISE probes across distinct app/build contexts; a cloud composition miss led to explicit transitive `Composes` resolution.
- Added evaluation limits: planning/traceability checks do not prove generated apps work.

## 1.2.0 — 2026-10-01

- Added target-first routing and generated web/desktop indexes; local single-user apps no longer load account or hosted-API families by default.
- Added FE-DESK, FE-COST, BE-LOCAL and BE-COST families for desktop workflows, local data safety and paid/metered operations.
- Added compact CORE card, screen/slice walkthrough, plain-word glossary, and optional Python/JavaScript test starters.
- Updated test-first guidance; explicitly prohibit weakening existing tests.
- Added required provider-option gating, paid-call ledger/reconciliation, desktop task closeout, copyable diagnostics and preview Stop behaviour.

## 1.1.0 — 2026-10-01

Fixes found by running the skill on a real planning task (see `evals/2026-10-plan-comparison`).

- Approval gates a choice, not a Required behaviour; Required items that depend on one are built behind a setting.
- ADVISOR: the owner's brief overrides default answers.
- Resolved Required/Approval clashes in BE-DATA-04, FE-FEED-02, BE-FILE-01, FE-MEDIA-02, FE-ACCT-01, BE-OPS-06, BE-JOB-02, FE-COLL-05.
- Coverage template: "Not cast" section; gate each code once.
- Added `examples/field-recordings` and the plan-comparison evaluation.

## 1.0.0 — 2026-10-01

- First release: `ui-standards` Agent Skill with ADVISE and BUILD modes.
- CORE: 16 floors, 5-state frame, 7 shared defaults.
- 77 entries across 7 front-end and 6 back-end families.
- Advisor question bank, slice contract, coverage sheet and next-iteration templates.
- Installers for Windows and macOS/Linux; adapters for AGENTS.md, CLAUDE.md, Copilot, Cursor.
- Validator, generated index and CI check.
