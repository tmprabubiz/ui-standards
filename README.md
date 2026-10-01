# ui-standards

[![validate](https://github.com/tmprabubiz/ui-standards/actions/workflows/validate.yml/badge.svg)](https://github.com/tmprabubiz/ui-standards/actions/workflows/validate.yml)
[![release](https://img.shields.io/github/v/release/tmprabubiz/ui-standards)](https://github.com/tmprabubiz/ui-standards/releases)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-6f42c1)](https://agentskills.io)

**A standard-parts catalogue for AI-built apps.** It gives your coding agent a list of
conventional behaviours, so you don't have to ask for them one by one. It covers the front
end and the back end. Anything optional it asks you about first, and it keeps a plain-English
list of what to build next.

Works with **Claude Code** and **Codex**, and with any agent that reads
[Agent Skills](https://agentskills.io) or `AGENTS.md` (GitHub Copilot, Cursor and others).

---

## Why

AI coding tools build the happy path. They often leave out things users expect:
a select-all box with a "some selected" state, undo after delete, a "no results" message,
a password reset that doesn't reveal who has an account, files kept private by default.
If you're not a developer, you only notice once the app is in use.

`ui-standards` turns those conventions into **77 numbered parts** across 13 families. For
each one, your agent knows:

| Level | What the agent does |
|---|---|
| **Required** | Builds it, every time |
| **Conditional** | Builds it when the condition is true (e.g. "if the list has several pages") |
| **Suggest** | Asks you, or adds it to `NEXT-ITERATION.md` |
| **Approval** | Never builds it without your explicit yes (costs, legal, permanent loss) |

There is also an always-on **CORE**: 16 safety, data and accessibility floors, plus a
5-state rule (loading, empty, error, no-permission, partial) for every screen.

## Does it work?

Same app idea, same model, planned with and without the skill, graded blind by a different
model against 30 conventions fixed in advance:

| | Without | With (entries applied) |
|---|---|---|
| Run 1 | 21 / 30 | **28 / 30** |
| Run 2 | 20 / 30 | **27 / 30** |

The gains come from the catalogue entries the agent loads during the build; the coverage
sheet's own text is not more complete. Method, limitations and every score:
[evals/2026-10-plan-comparison](evals/2026-10-plan-comparison/README.md).
See a real output: [examples/field-recordings](examples/field-recordings/).

## What it covers

| Front end | Back end |
|---|---|
| App shell, navigation, routing, responsive, theme, languages, error pages | API contract, errors, validation, pagination, bulk actions, retries, concurrent edits, versioning |
| Toasts, confirm and undo, dialogs, progress, notification centre | Passwords, sessions, social sign-in, reset tokens, roles, sharing, API keys |
| Form fields, validation, multi-step, file upload, autosave | Schema conventions, migrations, recovery bin, audit log, backups, demo data, search |
| Tables, lists, search, filters, pagination, detail views, dashboards | Upload limits, private storage, media processing, resumable uploads |
| Multi-select and bulk actions, single choice, pickers, reorder | Background jobs, schedules, email, notifications, webhooks in and out |
| Media lists, players, galleries, recording | Secrets, logging, health checks, rate limits, browser security, privacy export and erasure, environments |
| Sign up and sign in, reset, profile, onboarding, delete account, team members | |

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
| "Use ui-standards to plan my app: a library of my field recordings with previews and tags." | **ADVISE** mode: a few multiple-choice questions, a coverage sheet, a next-iteration list. No code. |
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
