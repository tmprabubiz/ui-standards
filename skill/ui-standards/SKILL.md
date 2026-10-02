---
name: ui-standards
description: Context-first planning and standards for building any kind of app, in any domain, stack, runtime or development environment. Use when an owner describes an app idea, feature, workflow, service, AI/media capability, cloud resource, build or deployment constraint, asks what is missing, or wants a next-iteration plan. Discovers the actual need before matching reusable patterns; never forces an unfamiliar app into a fixed category.
license: MIT
compatibility: Any agent that reads Agent Skills (Claude Code, Codex, Copilot, Cursor). No runtime dependencies.
metadata: { version: "1.4.0", repository: "https://github.com/tmprabubiz/ui-standards" }
---

# App-Building Standards

A context-first guide for an owner and coding agent building any kind of app. The catalogue
contains reusable parts, but it is not a closed list of app types or product domains. It
started with UI conventions; it also covers local/hosted services, AI/media workflows,
build environments, cloud resources and deployment when a project needs them.

The owner is usually non-technical. Speak plainly, offer choices with a recommended
default, and never make them rediscover conventions.

## Pick a mode

| The user… | Mode | Phases |
|---|---|---|
| asks to build, add or change a feature | **BUILD** | 0–8 |
| is describing an idea, planning, or asks "what am I missing" | **ADVISE** | 0–6, 8 (no code) |

If unclear, use ADVISE first, then offer to build.

## Procedure

0. **Detect.** If `docs/ui-standards/COVERAGE.md` exists in the app, read it and continue
   from it. Note the existing stack, data and machine constraints without prescribing replacements.
1. **Discover.** Read [CORE-CARD.md](references/CORE-CARD.md). Ask what the app should help
   someone accomplish, who will use it, what makes the domain different, and what must not
   go wrong. Let the owner describe it freely; examples in this catalogue are prompts, not
   a taxonomy or required choices.
2. **Frame.** Restate the app in 3–6 plain lines: goal, people, important workflows and data,
   runtime targets, data location, external services, and build/deployment constraints.
   Ask only consequential gaps, at most 5 per round. Use [ADVISOR.md](references/ADVISOR.md)
   as a question aid, not a fixed survey. Pair unfamiliar terms with their plain meaning
   from [GLOSSARY.md](references/GLOSSARY.md).
3. **Route and research.** Read [PROFILES.md](references/PROFILES.md) and
   [CAPABILITIES.md](references/CAPABILITIES.md). Profiles describe runtime/build contexts,
   not product domains. If the owner's computer has constraints (for example no local
   virtualization/Docker/GPU) or they mention remote deployment, load
   [BUILD-ENVIRONMENTS.md](references/BUILD-ENVIRONMENTS.md). If no profile or entry fits,
   do not force a match: clarify the need, research authoritative domain constraints where
   useful, and record an uncatalogued requirement.
4. **Cast.** Use generated indexes as retrieval aids, then select only entries relevant to
   the owner's workflows and capabilities. Follow each selected entry's `Composes` links
   transitively, adding each code once; include conditional links only when their condition
   is true, and record why any dependency is excluded. For hybrid apps, use client rules for
   local slices and service rules only for networked slices. Skip unrelated families.
5. **Cover and walkthrough.** Fill [templates/COVERAGE.md](references/templates/COVERAGE.md)
   at `docs/ui-standards/COVERAGE.md`. Before code, complete one block per screen in
   `docs/ui-standards/SLICE-WALKTHROUGH.md`: Visual, States, Data, Interactions, Associated
   elements, Responsive, Accessibility, Navigation, first-run differences and risks. Name
   loading, empty, no-results, error, unavailable/not-allowed and partial states; use
   “N/A” only with a reason. Get the owner's approval for each screen before building it.
   Slices follow [SLICES.md](references/SLICES.md).
6. **Build** (BUILD mode only). Work one confirmed slice at a time. Read existing tests,
   write/update the acceptance test first, then implement. Never remove or weaken a failing
   test to make a change pass. Use the project's existing stack and libraries.
7. **Gate** (BUILD mode only). Check every Acceptance item. Tick only what was verified.
8. **Advise.** Report a short **bill of conventions** (codes applied, exclusions). Write or
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
