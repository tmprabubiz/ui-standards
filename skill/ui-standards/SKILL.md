---
name: ui-standards
description: Standard-parts catalogue for app front ends and back ends. Use when planning, defining, building or extending any app screen, feature, slice, API, data model or account flow, or when the user asks "what am I missing", "what else should this app have" or "plan the next iteration". Builds conventional behaviour by default, asks before optional features, and writes a coverage sheet and next-iteration list. Not for visual styling (colours, fonts).
license: MIT
compatibility: Any agent that reads Agent Skills (Claude Code, Codex, Copilot, Cursor). No runtime dependencies.
metadata:
   version: "1.2.0"
  repository: "https://github.com/tmprabubiz/ui-standards"
---

# UI Standards

A catalogue of standard app parts. Each part lists what to **build by default**, what to
**ask about**, and what **needs approval**, for the front end and the back end together.

The owner is usually non-technical. Speak plainly, offer choices with a recommended
default, and never make them rediscover conventions.

## Pick a mode

| The user… | Mode | Phases |
|---|---|---|
| asks to build, add or change a feature | **BUILD** | 0–6 |
| is describing an idea, planning, or asks "what am I missing" | **ADVISE** | 0–3, 6 (no code) |

If unclear, use ADVISE first, then offer to build.

## Procedure

0. **Detect.** If `docs/ui-standards/COVERAGE.md` exists in the app, read it and continue
   from it. Note the stack and any component library already in use.
1. **Target first.** Read [CORE-CARD.md](references/CORE-CARD.md) and
   [PROFILES.md](references/PROFILES.md). Ask which kind of app this is before asking about
   accounts or web features. Use the owner's stated target and workflow; never default a
   desktop or local-first app to web.
2. **Frame.** Restate the app in 3–6 plain lines: target, who uses it, screens, data location,
   and outside services. Ask only relevant questions from [ADVISOR.md](references/ADVISOR.md),
   at most 5 per round. Pair unfamiliar terms with their plain meaning from
   [GLOSSARY.md](references/GLOSSARY.md).
3. **Cast.** Load the chosen profile index (`references/indexes/<profile>.md`) and match
   trigger words. For hybrid apps, use the desktop index for local slices and the web index
   only for networked slices. Load only matched family files. Do not load accounts, APIs or
   hosted services unless a slice needs them. Compose entries; do not invent behaviour already defined.
4. **Cover and walkthrough.** Fill [templates/COVERAGE.md](references/templates/COVERAGE.md)
   at `docs/ui-standards/COVERAGE.md`. Before code, show the owner one line per screen or
   slice: what they do, what they see, and what is saved if it fails. Use
   [templates/SLICE-WALKTHROUGH.md](references/templates/SLICE-WALKTHROUGH.md); wait for
   confirmation of each slice. Slices follow [SLICES.md](references/SLICES.md).
5. **Build** (BUILD mode only). Work one confirmed slice at a time. Read existing tests,
   write/update the acceptance test first, then implement. Never remove or weaken a failing
   test to make a change pass. Use the project's existing stack and libraries.
6. **Gate** (BUILD mode only). Check every Acceptance item. Tick only what was verified.
6. **Advise.** Report a short **bill of conventions** (codes applied, exclusions). Write or
   update `docs/ui-standards/NEXT-ITERATION.md` from
   [templates/NEXT-ITERATION.md](references/templates/NEXT-ITERATION.md) with the Suggest and
   Approval items not built, in plain English, each with benefit and effort (S/M/L).

Full detail: [PROCESS.md](references/PROCESS.md). Test examples: load only the relevant
language file in `references/tests/` when useful.

## Precedence

1. Explicit user instruction
2. CORE floors (security, data safety, accessibility)
3. The specific entry
4. CORE defaults
5. Suggestions

A user may decline anything except a floor. Overriding a floor needs a written exception
in COVERAGE.md with the reason.

Approval gates a **choice**, not a Required behaviour. When a Required item depends on an
Approval item (e.g. reset emails need an email provider), build the Required behaviour
behind a named setting or stub and list the choice under "Needs your decision".

## Rules that hold for the whole task

- Never add a Suggest item silently; ask, or list it in NEXT-ITERATION.md.
- Never build an Approval item without an explicit yes in this conversation.
- Never mark a slice done while a Required item or floor is unmet and unexcepted.
- Ask only questions whose answer changes what gets built.
- Keep the catalogue's behaviour, but follow the project's own look, naming and stack.
