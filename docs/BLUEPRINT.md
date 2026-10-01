# ui-standards — Blueprint

Version 1.2 · 2026-10-01 · Status: built

## 1. Goal

Give a non-technical app owner a **standard-parts catalogue** that any AI coding agent
(Claude Code, Codex, Copilot, Cursor, others that read `AGENTS.md` or Agent Skills) loads
on demand, routed first by app target (web, desktop, mobile, hybrid), so that:

1. Conventional front-end **and** back-end behaviour is built by default, not rediscovered
   through prompt wording.
2. Every screen and slice is checked against a coverage sheet before code is written, so
   nothing is missed silently.
3. Features that are useful but not essential are **asked about or advised**, never
   added silently, and land in a next-iteration list in plain English.

**Guardrail:** the catalogue describes *behaviour*, never a specific framework, visual
style or brand. A project's own design and stack always win; the catalogue fills gaps.

## 2. Non-goals

- Not a component library, design system, or code generator.
- Not a visual style guide (colours, fonts) — use a design skill for that.
- Not a replacement for security review, legal review, or accessibility audit.
- No telemetry, no network calls, no runtime dependencies.

## 3. Source research

19 model-generated studies in `Research/` (gitignored, kept locally). Ideas adopted:

| Idea | Source file(s) |
|---|---|
| Coverage sheet before code (Frame → Cast → Cover → Build → Gate) | 001Q, 001R |
| Floors (always-on baseline) + 5-state frame + bill of conventions | 001K |
| Four rule levels: Required / Conditional / Suggest / Approval | 001D, 001E, 001H |
| Cross-component ("between widgets") composition rules | 001J |
| Evidence rule + convention budget (≤ 7 Required per entry) | 001H, 001P |
| Authority labels on sources (standard / convention / proposal) | 001E, 001N |
| Lean on existing accessible libraries; standard only fills gaps | 001B |
| Gap-driven growth (GAPS.md) | 001H, 001K |

Gaps the research left open and this blueprint closes:

| Gap | Closed by |
|---|---|
| Back end not covered | `references/backend/*` + slice contract linking UI ↔ API ↔ data |
| No guidance for the *definition* phase | `ADVISOR.md` question bank (plain English, multiple choice, recommended default) |
| Suggestions lost after the build | `NEXT-ITERATION.md` template written into the app |
| Tool lock-in (Claude-only examples) | Agent Skills standard + adapters for AGENTS.md / CLAUDE.md / Copilot / Cursor |
| Catalogue drift / bloat | `scripts/validate.mjs` (format, budget, references) + generated `INDEX.md` |
| App shell, account, settings, onboarding, i18n missing | `FE-SHELL`, `FE-ACCT` families |
| Real desktop/local-first workflow did not fit web-shaped defaults | `PROFILES.md`, `indexes/desktop.md`, `FE-DESK`, `BE-LOCAL` |
| Paid provider calls lacked per-action safeguards | `FE-COST`, `BE-COST` |
| No owner confirmation before each incremental slice | `SLICE-WALKTHROUGH.md` and per-screen confirmation |
| Token cost and technical wording blocked adoption | `CORE-CARD.md` (≤2 KB) and `GLOSSARY.md` |

## 4. Architecture

```
ui-standards/
├─ skill/ui-standards/            ← the installable Agent Skill (single source of truth)
│  ├─ SKILL.md                    entry: modes, procedure, precedence (short)
│  └─ references/
│     ├─ CORE-CARD.md             compact, owner-first rules loaded for every target
│     ├─ PROFILES.md               target routing; local/web/hybrid boundaries
│     ├─ PROCESS.md               phases, outputs, stack notes
│     ├─ CORE.md                  floors + 5-state frame (always applied)
│     ├─ ADVISOR.md               question bank for defining the app
│     ├─ SLICES.md                slice contract: screen ↔ API ↔ data ↔ checks
│     ├─ INDEX.md                 GENERATED full trigger → code table
│     ├─ indexes/                  GENERATED target-specific retrieval maps
│     ├─ templates/               coverage, next iteration, slice walkthrough
│     ├─ tests/                    optional Python and JavaScript test starters
│     ├─ frontend/                FE-* entries by family
│     └─ backend/                 BE-* entries by family
├─ adapters/                      pointer snippets per tool
├─ install/                       install.ps1, install.sh
├─ scripts/                       validate.mjs, build-index.mjs (no deps)
├─ docs/                          BLUEPRINT.md, ENTRY-FORMAT.md
├─ .github/workflows/validate.yml
├─ GAPS.md · DECISIONS.md · CHANGELOG.md
└─ Research/                      local only (gitignored)
```

### Loading model (token budget)

| Layer | When loaded | Size target |
|---|---|---|
| Adapter line in AGENTS.md / CLAUDE.md | every session | ≤ 6 lines |
| `SKILL.md` | when UI/app-structure work starts | ≤ 150 lines |
| `CORE-CARD.md` | every activation | ≤ 2 KB |
| `PROFILES.md`, one profile index, relevant process excerpts | selected by target | keep profile-specific |
| `CORE.md` | only hosted/hybrid server slices | ≤ 250 lines |
| Family files (`frontend/*`, `backend/*`) | only the families the INDEX matched | ≤ 400 lines each |

### Entry families

| Code | File | Covers |
|---|---|---|
| FE-SHELL | frontend/shell.md | app shell, navigation, routing/deep links, responsive layout, theming, i18n, not-found |
| FE-FEED | frontend/feedback.md | toasts, dialogs, confirm/undo, progress, notifications centre |
| FE-FORM | frontend/forms.md | form fields, validation, multi-step, file upload UI, autosave/drafts |
| FE-COLL | frontend/collections.md | data table, list/cards, search, filter/sort, pagination, dashboard |
| FE-SEL | frontend/selection.md | single/multi-select, bulk actions, pickers |
| FE-MEDIA | frontend/media.md | media preview list, player, image gallery, captions |
| FE-ACCT | frontend/account.md | sign-up/in, reset, profile, settings, onboarding, account deletion |
| FE-DESK | frontend/desktop.md | window lifecycle, native file dialogs, stoppable local tasks, shortcuts, copyable diagnostics |
| FE-COST | frontend/metered-actions.md | estimates, second confirmation, dry run, budgets, no duplicate paid calls |
| BE-API | backend/api.md | contract, errors, validation, pagination, idempotency, versioning |
| BE-AUTH | backend/auth.md | authentication, sessions, roles/permissions, OAuth, password reset |
| BE-DATA | backend/data.md | schema conventions, migrations, soft delete, audit log, backups, seed |
| BE-FILE | backend/files.md | upload handling, storage, limits, signed URLs, media processing |
| BE-JOB | backend/jobs.md | background jobs, scheduling, email, notifications, webhooks |
| BE-OPS | backend/ops.md | config/secrets, logging, health, rate limiting, security headers, privacy export/delete |
| BE-LOCAL | backend/local-first.md | local persistence, safe file operations, durable task ledger |
| BE-COST | backend/metered-actions.md | paid-provider secrets, idempotency, reconciliation, cost ledger and limits |

### Entry format

Defined in [ENTRY-FORMAT.md](ENTRY-FORMAT.md) and enforced by `scripts/validate.mjs`.

## 5. Agent procedure (summary)

| Phase | Agent does | Output in the app |
|---|---|---|
| 0 Detect | Resume existing coverage; identify stack and test runner | — |
| 1 Target | Ask web / desktop / mobile / hybrid first; locate data and paid services | Target and Frame |
| 2 Cast | Load CORE card and target index; match only relevant families | Cast table |
| 3 Walk through | One owner-readable line per screen/slice: do → see → saved on failure; confirm before code | Walkthrough table |
| 4 Cover | Required + true Conditional, Suggest, Approval, deliberate exclusions | Cover table |
| 5 Build | One confirmed slice at a time; tests first; don't weaken existing tests | Code and tests |
| 6 Gate and advise | Verify acceptance; report applied codes and next options | Gate + NEXT-ITERATION.md |

Modes: **BUILD** (default when the user asks to build) runs 0–6. **ADVISE** (when the user
is defining or asks "what am I missing") runs 0–3 and 6 with no code.

Precedence: explicit user instruction → floors (security, data safety, accessibility) →
specific entry → CORE defaults → suggestions. A user may decline anything except a floor;
overriding a floor needs a recorded exception in COVERAGE.md.

## 6. Build plan and model allocation

| Step | Work | Model role |
|---|---|---|
| B1 | Blueprint, entry format, SKILL.md, PROCESS, CORE, ADVISOR, SLICES, templates | Frontier (judgement) |
| B2 | Validator + index builder scripts | Frontier |
| B3 | Front-end family files | Mid-tier writer subagent, format-bound |
| B4 | Back-end family files | Mid-tier writer subagent, format-bound |
| B5 | Adapters, installers, CI, README | Frontier |
| B6 | Independent review (fresh context, sees files + this blueprint only) | Separate reviewer subagent |
| B7 | Fix findings, validate, publish to GitHub | Frontier |

## 7. Verification

- `node scripts/validate.mjs` exits 0: unique codes, required sections present,
  ≤ 7 Required per entry, ≥ 3 acceptance checks, all cross-references resolve,
  `INDEX.md` matches generated output, SKILL.md frontmatter valid.
- CI runs the same check on every push.
- Install smoke test: run installer into a temp folder; confirm skill copies and
  adapter markers are present and idempotent on a second run.

## 8. Growth rules

- New entry needs: a real miss recorded in `GAPS.md`, and either an authoritative source
  or the pattern in 3+ mature products.
- Required list capped at 7 per entry; move extras to Conditional or Suggest.
- Every tie-break recorded in `DECISIONS.md`.
