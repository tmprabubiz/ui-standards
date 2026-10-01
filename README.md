# ui-standards

[![validate](https://github.com/tmprabubiz/ui-standards/actions/workflows/validate.yml/badge.svg)](https://github.com/tmprabubiz/ui-standards/actions/workflows/validate.yml)
[![release](https://img.shields.io/github/v/release/tmprabubiz/ui-standards)](https://github.com/tmprabubiz/ui-standards/releases)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-6f42c1)](https://agentskills.io)

**Context-first guidance for building any kind of app with an AI coding agent.** Describe
your goal, users, unusual needs and constraints in your own words. The agent checks what
applies, uses known patterns where they fit, asks about consequential unknowns, and records
anything the catalogue does not cover. It does not force your idea into a preset app category.

Works with **Claude Code** and **Codex**, and with any agent that reads
[Agent Skills](https://agentskills.io) or `AGENTS.md` (GitHub Copilot, Cursor and others).

---

## Why

AI coding tools build the happy path. They often leave out things users expect:
a select-all box with a "some selected" state, undo after delete, a "no results" message,
a password reset that doesn't reveal who has an account, files kept private by default.
If you're not a developer, you only notice once the app is in use.

The catalogue currently contains **97 reusable behavior patterns** across 24 families,
plus context discovery, runtime/build profiles, cloud build guidance, test-first workflow
and owner-readable coverage templates. These patterns are examples from which the agent
composes only what your project needs; they are not an exhaustive list of app types. Each
entry classifies its guidance as:

| Level | What the agent does |
|---|---|
| **Required** | Builds it, every time |
| **Conditional** | Builds it when the condition is true (e.g. "if the list has several pages") |
| **Suggest** | Asks you, or adds it to `NEXT-ITERATION.md` |
| **Approval** | Never builds it without your explicit yes (costs, legal, permanent loss) |

There is also a compact, owner-readable **CORE card** loaded first. The full 16-floor
security/accessibility baseline loads only for profiles and slices where it applies, so a
single-user local desktop tool is not burdened with accounts or hosted APIs.

## One bounded case study (not general proof)

Same app idea, same model, planned with and without the skill, graded blind by a different
model against 30 conventions fixed in advance:

| | Without | With (entries applied) |
|---|---|---|
| Run 1 | 21 / 30 | **28 / 30** |
| Run 2 | 20 / 30 | **27 / 30** |

This is one field-recordings **planning** comparison, not evidence for every domain or a
built-app outcome. The gains in that case came from the catalogue entries the agent loaded;
the coverage sheet's own text was not more complete. Method, limitations and every score:
[evals/2026-10-plan-comparison](evals/2026-10-plan-comparison/README.md).
Those runs evaluated v1.1, not the later desktop/cloud additions. The
[field-recordings output](examples/field-recordings/) is illustrative only, not the canonical
project shape.

## Research and planning checks

The 19 local research reports were deduplicated into 27 observable UI behavior checks.
Traceability review found 24 with Required/Conditional coverage, one intentionally mixed
with Suggest behavior, and two partial/open areas: live collaboration and offline sync.
Six fresh-context planning probes across unlike app and build scenarios scored 7–8/8 against
a frozen checklist. One probe exposed a missing transitive `Composes` instruction; that was
fixed and the same scenario rerun.

These are **catalogue traceability and ADVISE-planning checks**, not tests of built apps or
proof for every domain. No cloud infrastructure or paid model calls were used. Detailed
method, coverage rows, probe scores and remaining gaps:
[evals/research-coverage](evals/research-coverage/RESULTS.md).

## What it covers

| Front end | Back end |
|---|---|
| App shell, navigation, routing, responsive, theme, languages, error pages | API contract, errors, validation, pagination, bulk actions, retries, concurrent edits, versioning |
| Toasts, confirm and undo, dialogs, progress, notification centre | Passwords, sessions, social sign-in, reset tokens, roles, sharing, API keys |
| Form fields, validation, multi-step, file upload, autosave | Schema conventions, migrations, recovery bin, audit log, backups, demo data, search |
| Tables, lists, search, filters, pagination, detail views, dashboards | Upload limits, private storage, media processing, resumable uploads |
| Multi-select and bulk actions, single choice, pickers, reorder | Background jobs, schedules, email, notifications, webhooks in and out |
| Media lists, players, galleries, recording | Secrets, logging, health checks, rate limits, browser security, privacy export and erasure, environments |
| Desktop windows, local file pickers, stoppable tasks, keyboard shortcuts, copyable errors | Local persistence, safe file operations, durable task ledger |
| AI-generated content, source-grounded knowledge answers, cloud resource controls | Model integrations, cloud accounts/compute, remote builds, deployment/rollback |
| Sign up and sign in, reset, profile, onboarding, delete account, team members | |

Examples above are capability patterns, not a complete domain checklist. An unfamiliar app
can combine them, use different patterns, or add uncatalogued behavior.

Paid or quota-limited calls have a separate
confirm-and-ledger contract: estimate, a second cost-labelled action, duplicate prevention,
dry run where available, and recovery after an unknown result.

Full list: [skill/ui-standards/references/INDEX.md](skill/ui-standards/references/INDEX.md)

## Install

You need `git`. Clone once:

```bash
git clone https://github.com/tmprabubiz/ui-standards.git
```

**Into one app** (recommended). This copies the skill and adds a short pointer to your
agent files:

```powershell
# Windows PowerShell
./ui-standards/install/install.ps1 -Target "D:\Apps\my-app"
./ui-standards/install/install.ps1 -Target "D:\Apps\my-app" -Tools claude,codex,copilot,cursor
```

```bash
# macOS / Linux
./ui-standards/install/install.sh ~/apps/my-app
./ui-standards/install/install.sh ~/apps/my-app claude,codex,copilot,cursor
```

**For every project on your computer:**

```powershell
./ui-standards/install/install.ps1 -Global
```

| Tool | What gets installed |
|---|---|
| Codex, Copilot, Cursor (via AGENTS.md) | `.agents/skills/ui-standards/` + a block in `AGENTS.md` |
| Claude Code | `.claude/skills/ui-standards/` + a block in `CLAUDE.md` |
| Copilot | a block in `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/ui-standards.mdc` |

The installer is safe to run again: it replaces its own block and leaves the rest of your
files alone. To update, `git pull` in the ui-standards folder and run the installer again.

## Use

Ask your agent in plain words:

| You say | What happens |
|---|---|
| "I want to build an app that helps [person] do [goal]. The unusual part is [context]." | Starts with your goal and context, then asks only consequential questions and produces a coverage sheet and next-iteration list. No code in ADVISE mode. |
| "My computer can't run Docker or virtualization; I need to deploy a GPU service." | Separately assesses build machine, remote builder, cloud runtime, account, data, quota and cost constraints before proposing a path. |
| "Build the recordings list screen." | **BUILD** mode: maps your request to parts, builds the required ones front end and back end, checks them, and reports which conventions it applied. |
| "What is this app missing?" | Reviews the app against the catalogue and updates `NEXT-ITERATION.md`. |
| "Build next-iteration items 1, 3 and 4." | Builds exactly those. |

Your agent keeps two files in your app:

- `docs/ui-standards/COVERAGE.md`: what was planned, built, asked, excluded and verified.
- `docs/ui-standards/NEXT-ITERATION.md`: what you could add next, each with benefit and effort.

## How it stays small

Only a 6-line pointer is always loaded. The skill loads when app work starts, and only the
families your request matches are read. See [docs/BLUEPRINT.md](docs/BLUEPRINT.md).

## Contributing

- Found a convention your agent missed? Add it to [GAPS.md](GAPS.md) or open an issue.
- Entry format: [docs/ENTRY-FORMAT.md](docs/ENTRY-FORMAT.md). Check before committing:

```bash
node scripts/build-index.mjs
node scripts/validate.mjs
```

## License

[MIT](LICENSE)
