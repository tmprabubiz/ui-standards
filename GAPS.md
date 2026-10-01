# Gaps

This is a set of observed examples, not a list of every supported or unsupported app domain.
Any project may uncover other needs. Record a gap in its own coverage/next-iteration file;
promote it here only when the behavior is reusable across contexts (see `CAPABILITIES.md`).

| Date | What was missing | App / context | Proposed code | Status |
|---|---|---|---|---|
| 2026-10-01 | Hosted customer payments and subscriptions (checkout, receipts, failed renewal) | Research review | BE-PAY / FE-PAY family | Open — separate from provider API spend |
| 2026-10-01 | Real-time collaboration (presence, live cursors, conflict merge) | Research review | FE-COLLAB | Open |
| 2026-10-01 | Offline mode and sync | Research review | FE-SHELL / BE-SYNC | Open |
| 2026-10-01 | Charts and data visualisation accessibility | Research review | FE-VIZ | Open |
| 2026-10-01 | Domain-specific AI rules not shared by general generation/retrieval (e.g. voice identity or regulated advice) | Multiple project contexts | Propose only after source/rights review | Open; always research per project |
| 2026-10-01 | Native mobile platform-specific rules (push permission timing, app store review rules) | Research review | FE-MOBILE | Open; shared patterns exist, platform details need context |
| 2026-10-01 | Target-first routing and desktop/local-first patterns | Real PySide6/local-first build feedback | FE-DESK, BE-LOCAL | Addressed in 1.2.0; not a complete domain taxonomy |
| 2026-10-01 | Paid-call confirmation, duplicate-charge prevention and outcome-unknown recovery | Real metered-provider workflow feedback | FE-COST, BE-COST | Addressed in 1.2.0 |
| 2026-10-01 | Screen-by-screen owner walkthrough, test-first rule, plain-word layer | Real incremental-build workflow feedback | CORE-CARD, SLICE-WALKTHROUGH.md, GLOSSARY.md | Addressed in 1.2.0 |
| 2026-10-01 | Build host may lack virtualization/Docker/GPU; needs remote image build and cloud runtime decisions | Owner build-machine constraint | BUILD-ENVIRONMENTS.md, BE-DEPLOY, BE-CLOUD | Addressed in 1.3.0; provider examples are not exhaustive |
| 2026-10-01 | Domain examples could be mistaken for supported-domain limit | Owner clarification | CAPABILITIES.md, open-ended ADVISOR | Addressed in 1.3.0 |
| 2026-10-01 | Agents may notice but fail to load transitive `Composes` dependencies | Cloud image/VM ADVISE regression probe | SKILL.md, PROCESS.md | Addressed in 1.3.0; regression probe passed |
