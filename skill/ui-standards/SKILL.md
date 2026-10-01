---
name: ui-standards
description: Standard-parts catalogue for app front ends and back ends. Use when planning, defining, building or extending any app screen, feature, slice, API, data model or account flow, or when the user asks "what am I missing", "what else should this app have" or "plan the next iteration". Builds conventional behaviour by default, asks before optional features, and writes a coverage sheet and next-iteration list. Not for visual styling (colours, fonts).
license: MIT
compatibility: Any agent that reads Agent Skills (Claude Code, Codex, Copilot, Cursor). No runtime dependencies.
metadata:
  version: "1.0.0"
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
1. **Frame.** Restate the app or feature in 3–6 plain lines: who uses it, the main screens,
   what data it keeps. If key facts are missing, ask questions from
   [ADVISOR.md](references/ADVISOR.md) — at most 5 per round, multiple choice, with a
   recommended default.
2. **Cast.** Load [CORE.md](references/CORE.md) and [INDEX.md](references/INDEX.md). Match the
   request to entry codes using the trigger words. Load **only** the family files those codes
   live in. Compose entries; do not invent behaviour an entry already defines.
3. **Cover.** Fill [templates/COVERAGE.md](references/templates/COVERAGE.md) into the app at
   `docs/ui-standards/COVERAGE.md`: per slice, the codes used, Required + Conditional items
   that will be built, Suggest items to ask about, Approval items blocked, and exclusions with
   a reason. Slices follow [SLICES.md](references/SLICES.md).
4. **Build** (BUILD mode only). Implement one slice at a time, front end and back end
   together. Use the project's existing libraries first.
5. **Gate** (BUILD mode only). Check every Acceptance item for the slice. Where a test runner
   exists, turn them into tests. Tick the coverage sheet only for what was verified.
6. **Advise.** Report a short **bill of conventions** (codes applied, exclusions). Write or
   update `docs/ui-standards/NEXT-ITERATION.md` from
   [templates/NEXT-ITERATION.md](references/templates/NEXT-ITERATION.md) with the Suggest and
   Approval items not built, in plain English, each with benefit and effort (S/M/L).

Full detail: [PROCESS.md](references/PROCESS.md).

## Precedence

1. Explicit user instruction
2. CORE floors (security, data safety, accessibility)
3. The specific entry
4. CORE defaults
5. Suggestions

A user may decline anything except a floor. Overriding a floor needs a written exception
in COVERAGE.md with the reason.

## Rules that hold for the whole task

- Never add a Suggest item silently; ask, or list it in NEXT-ITERATION.md.
- Never build an Approval item without an explicit yes in this conversation.
- Never mark a slice done while a Required item or floor is unmet and unexcepted.
- Ask only questions whose answer changes what gets built.
- Keep the catalogue's behaviour, but follow the project's own look, naming and stack.
