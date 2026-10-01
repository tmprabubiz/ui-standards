# Gaps

Conventional behaviour an agent missed that no entry covered. Each gap is the evidence
for a new entry or a change to an existing one (see `docs/BLUEPRINT.md` § Growth rules).

| Date | What was missing | App / context | Proposed code | Status |
|---|---|---|---|---|
| 2026-10-01 | Hosted customer payments and subscriptions (checkout, receipts, failed renewal) | Research review | BE-PAY / FE-PAY family | Open — separate from provider API spend |
| 2026-10-01 | Real-time collaboration (presence, live cursors, conflict merge) | Research review | FE-COLLAB | Open |
| 2026-10-01 | Offline mode and sync | Research review | FE-SHELL / BE-SYNC | Open |
| 2026-10-01 | Charts and data visualisation accessibility | Research review | FE-VIZ | Open |
| 2026-10-01 | AI features in apps (generated content review, provenance, cost limits) | Research review | FE-AI / BE-AI | Open |
| 2026-10-01 | Native mobile specifics (push permission timing, app store review rules) | Research review | FE-MOBILE | Open |
| 2026-10-01 | Target-first loading; desktop windows, local pickers and stoppable work | Real PySide6/local-first build feedback | FE-DESK, BE-LOCAL | Addressed in 1.2.0 |
| 2026-10-01 | Paid-call confirmation, duplicate-charge prevention and outcome-unknown recovery | Real metered-provider workflow feedback | FE-COST, BE-COST | Addressed in 1.2.0 |
| 2026-10-01 | Screen-by-screen owner walkthrough, test-first rule, plain-word layer | Real incremental-build workflow feedback | CORE-CARD, SLICE-WALKTHROUGH.md, GLOSSARY.md | Addressed in 1.2.0 |
