# ui-standards — Blueprint

Version 1.4 · 2026-10-02 · Status: built

## 1. Goal

Give a non-technical app owner a **context-first app-building guide** that any AI coding
agent (Claude Code, Codex, Copilot, Cursor, others that read `AGENTS.md` or Agent Skills)
loads on demand. The owner describes any product/domain in their own words; runtime, product
capabilities, build host and deployment constraints are discovered as separate axes. So that:

1. Conventional front-end **and** back-end behaviour is built by default, not rediscovered
   through prompt wording.
2. Every screen and slice is checked against a coverage sheet before code is written, so
   nothing is missed silently.
3. Features that are useful but not essential are **asked about or advised**, never
   added silently, and land in a next-iteration list in plain English.
4. Uncatalogued needs are surfaced rather than forced into an existing app category or
   falsely claimed as covered.

**Guardrail:** the catalogue describes reusable behavior and decision prompts, not an
exhaustive set of product types. A project's domain, constraints, design and stack always
win; the catalogue fills gaps without dictating what the app must be.

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
| Examples risked appearing to define the full product universe | `CAPABILITIES.md` declares itself non-exhaustive and provides an uncatalogued-needs route |
| Build-machine limits were conflated with runtime target | `BUILD-ENVIRONMENTS.md` treats host, remote build and app runtime separately |
| Remote image build, cloud GPU/VM and provider dashboard needs were not covered | `BE-DEPLOY`, `BE-CLOUD`, `FE-CLOUD` with AWS/GCP examples behind provider-neutral contracts |
| AI/media and knowledge workflows were only isolated examples | `FE-AI`, `BE-AI`, `FE-KNOW`, `BE-KNOW` are composable capabilities, not fixed app categories |

## 4. Architecture

```
ui-standards/
├─ skill/ui-standards/            ← the installable Agent Skill (single source of truth)
│  ├─ SKILL.md                    entry: modes, procedure, precedence (short)
│  └─ references/
│     ├─ CORE-CARD.md             compact, owner-first rules loaded for every target
│     ├─ PROFILES.md               open set of runtime contexts; retrieval aid only
│     ├─ CAPABILITIES.md           open-ended capability matching and uncatalogued-needs path
│  ├─ scripts/                       validate.mjs (yaml dev dependency), build-index.mjs (no deps)
│     ├─ PROCESS.md               context → slices → cover → build → verify
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
| `PROFILES.md`, capability map, one or more profile indexes | selected after owner context | indexes are aids, not closed classification |
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
| FE-AI | frontend/ai-features.md | labelled generated/transformed content, review, rights and provenance |
| FE-CLOUD | frontend/cloud-operations.md | app dashboards that view/control real cloud resources |
| FE-KNOW | frontend/knowledge-base.md | source-grounded search/answers and source status |
| BE-API | backend/api.md | contract, errors, validation, pagination, idempotency, versioning |
| BE-AUTH | backend/auth.md | authentication, sessions, roles/permissions, OAuth, password reset |
| BE-DATA | backend/data.md | schema conventions, migrations, soft delete, audit log, backups, seed |
| BE-FILE | backend/files.md | upload handling, storage, limits, signed URLs, media processing |
| BE-JOB | backend/jobs.md | background jobs, scheduling, email, notifications, webhooks |
| BE-OPS | backend/ops.md | config/secrets, logging, health, rate limiting, security headers, privacy export/delete |
| BE-LOCAL | backend/local-first.md | local persistence, safe file operations, durable task ledger |
| BE-COST | backend/metered-actions.md | paid-provider secrets, idempotency, reconciliation, cost ledger and limits |
| BE-AI | backend/ai-services.md | model provider boundaries, untrusted inputs, data minimization and output trace |
| BE-CLOUD | backend/cloud-resources.md | cloud accounts, least privilege, cost guardrails and VM/GPU lifecycle |
| BE-DEPLOY | backend/build-and-deploy.md | remote image builds, releases, health checks and rollback |
| BE-KNOW | backend/knowledge-base.md | source versioning, ingestion/index lifecycle and retrieval grounding |

### Entry format

Defined in [ENTRY-FORMAT.md](ENTRY-FORMAT.md) and enforced by `scripts/validate.mjs`.

## 5. Agent procedure (summary)

| Phase | Agent does | Output in the app |
|---|---|---|
| 0 Detect | Resume existing coverage; identify stack and test runner | — |
| 1 Discover | Restate goal/users/domain/workflow and consequential unknowns | Owner-checked Frame |
| 2 Context | Separate data, rights, runtime, build host, services, delivery and cost | Context record |
| 3 Cast | Use capability and runtime indexes as retrieval aids; allow uncatalogued needs | Cast + gap list |
| 4 Walk through | Complete one owner-approved contract per screen covering visual, states, data, interactions, associated elements, responsiveness, accessibility, navigation and risks | Screen walkthrough |
| 5 Cover | Required + true Conditional, Suggest, Approval, deliberate exclusions and uncatalogued work | Cover table |
| 6 Build | One confirmed slice at a time; tests first; don't weaken existing tests | Code and tests |
| 7 Gate and advise | Verify acceptance; report applied codes, unknowns and next options | Gate + NEXT-ITERATION.md |

Modes: **BUILD** (when the user asks to build) runs discovery through verification.
**ADVISE** (when defining an idea or asking "what am I missing") prepares context, coverage
and next options without code. The catalogue is not a substitute for project-specific domain
research or owner decisions.

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
   or evidence that the pattern generalizes across more than one project/context. One project
   can report a gap; it does not alone define a universal rule.
- Required list capped at 7 per entry; move extras to Conditional or Suggest.
- Every tie-break recorded in `DECISIONS.md`.
