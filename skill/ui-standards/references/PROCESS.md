# PROCESS — phases in detail

## Phase 0 · Detect

- Look for `docs/ui-standards/COVERAGE.md` and `NEXT-ITERATION.md` in the app. If present,
  resume: unchecked items are the open work.
- Identify the stack (framework, language, database, auth provider, component library).
  If none exists yet and the user is in ADVISE mode, recommend one in Phase 1 rather than
  assuming.

## Phase 1 · Frame

Write a Frame block in plain English:

```
App: <one line>
People: <who uses it; roles if more than one>
Screens: <main screens, 3–10>
Data: <main things the app stores>
Outside services: <payments, email, maps, AI, none>
Platforms: <web / mobile / desktop>
```

Missing facts that change the build → ask from ADVISOR.md. Facts that do not change the
build → assume the recommended default and state it.

## Phase 2 · Cast

1. Split the app into **slices**: one user goal end to end (screen + API + data). See SLICES.md.
2. For each slice, scan INDEX.md trigger words against the slice description.
3. Add entries that the matched entries list in **Composes**.
4. Always add the account and shell families when the app has more than one screen or any
   sign-in.
5. Load only the family files that contain the cast codes.

Recognition guard: match on what the user is trying to do, not on a stray word. "Select a
plan" in pricing is a single choice, not multi-select.

## Phase 3 · Cover

Fill COVERAGE.md. For each slice and each code:

- **Build:** every Required item, plus each Conditional item whose IF is true.
- **Ask:** Suggest items. Group them; ask at most 5 per round. Unanswered → NEXT-ITERATION.md.
- **Blocked:** Approval items, unless the user has said yes in this conversation.
- **Excluded:** anything skipped, with a reason in one line.

Show the owner a short summary before building: slices, what will be built, questions.

## Phase 4 · Build

- One slice at a time: data → API → screen → states.
- Back end first enough that the screen calls a real contract, even if stubbed.
- Prefer the project's existing component library. If none, use an accessible headless
  library suited to the stack:

| Stack | Typical accessible base |
|---|---|
| React / Next.js | Radix UI or React Aria (shadcn/ui builds on Radix) |
| Vue / Nuxt | Reka UI |
| Svelte | Bits UI / Melt UI |
| Angular | Angular CDK / Angular Material |
| Flutter, SwiftUI, Jetpack Compose | Platform-native widgets with semantics labels |

Libraries supply keyboard and ARIA behaviour; entries still decide **what** to build.

## Phase 5 · Gate

- Walk every Acceptance item for each built code. Mark `[x]` only when verified by a test,
  a run, or reading the code path end to end; mark how (`test`, `run`, `read`).
- If a test runner exists, write tests for Acceptance items; prefer end-to-end tests for
  screens and request tests for APIs.
- A slice is done when all Required items, true Conditionals and floors are ticked or
  excepted.

## Phase 6 · Advise

End every build or advise session with:

```
Bill of conventions
Applied: CORE, FE-COLL-01, FE-SEL-01, BE-API-02, …
Excepted: F7 (owner wants autoplay on the hero video, muted) …
Asked and declined: FE-SEL-01 S1 …
Next iteration: 6 items → docs/ui-standards/NEXT-ITERATION.md
```

NEXT-ITERATION.md lists items in priority order with plain benefit and effort, so the
owner can pick the next round without technical knowledge.

## Iterating

On a later request, start at Phase 0. New slices get new rows; changed slices are re-gated.
If the owner reports something conventional that was missing and no entry covered it, add a
line to the app's NEXT-ITERATION.md under "Catalogue gaps" so it can be fed back to the
ui-standards repo `GAPS.md`.
