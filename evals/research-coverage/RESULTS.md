# Research coverage and app-planning results

Test plan: [TEST-PLAN.md](TEST-PLAN.md). Raw inputs remain in the ignored local `Research/`
folder; this report contains a deduplicated traceability summary, not copied research text.

## 1. Research traceability

The 19 reports repeatedly converge on a small interaction core; several are near-duplicates
(001D/001E and 001Q/001R). The matrix has 27 observable needs. Status is based on the current
catalogue entry's Required/Conditional/Suggest/Approval level, not the mere presence of a
related family.

| Outcome | Count | Meaning |
|---|---:|---|
| Required or applicable Conditional rules | 24 / 27 | Entries state a default behavior and acceptance checks. |
| Suggest-only behaviors | 1 / 27 | Saved views, density and column personalization are opt-in, not silently added. |
| Partial / open coverage | 2 / 27 | Realtime presence/collaborative editing and offline queue/sync conflict are not fully specified. |
| Supplemental research need | 1 | Shift-range selection exists as FE-SEL-01 Suggest, not a default. |

**Covered patterns:** tri-state selection and scope, bulk toolbar and partial failures, row-action identity, table semantics/sorting/overflow/responsive behavior, paging, live search, lifecycle states, keyboard/focus/names, destructive confirmation/undo, form errors and retained input, upload progress/retry, exclusive media playback/seeking, dialog focus, navigation/back behavior, locale/RTL, accessible charts, reorder alternatives, themes/reduced motion and recording consent.

**Additional corpus items checked outside the 27-row scorecard:** shift-range selection is
FE-SEL-01 Suggest-only; success/error announcements and long-task progress route to
FE-FEED-01/04/05; source/result provenance routes to FE-AI-01 and FE-KNOW-01/BE-KNOW-02;
cross-component dependencies use `Composes` links. These are traceable, but not every
optional enhancement is a default behavior.

**Partial or still open:**

- **Collaboration:** roles, sharing and concurrent-edit conflict handling exist; live presence, cursors and collaborative merge behavior need a separate pattern if a project requires them.
- **Offline/sync:** local-first storage and offline-aware forms exist; durable queued sync and conflict resolution remain open.
- **Platform-specific mobile:** shared responsive/touch patterns exist, but permission timing, app-store review and native lifecycle rules need platform-specific research.
- **Domain-specific obligations:** voice/likeness rights, regulated advice, creator-platform disclosure and document-to-Markdown conventions must be researched for each project. The generic skill must not invent these rules.

### Cross-cutting structure checks

| Check | Result |
|---|---|
| Four rule levels; acceptance criteria; trigger indexes; precedence/composition | Present; repository validator passes structure and references. |
| Source labels and gap-driven growth | Present in entry format, GAPS and DECISIONS; factual currency still needs human/source review. |
| Pre-build coverage and owner-confirmed walkthrough | Present in templates and skill flow. |
| Semantic contradictions and standards accuracy | Not fully machine-validated; requires ongoing independent review. |

This is a traceability audit against the research corpus, **not** a claim that every behavior is
implemented or that each acceptance item has been exercised in a running app.

Two targeted regression checks failed before catalogue fixes and passed after:

- **R01:** FE-SEL-01 described a mixed state but did not require assistive technology to
  receive it. The entry now requires `aria-checked="mixed"` or a platform equivalent.
- **R23:** FE-COLL-01 had column visibility both Conditional and Suggest. The auto-Conditional
  rule was removed; personalization remains Suggest-only. The corresponding checks passed.

## 2. Cross-domain ADVISE probes

Six fresh-context Claude Opus 5.5 sessions read the skill and returned a text-only equivalent
of the planning artifacts. No code, network calls, provider accounts or infrastructure were
used. The P4 working title is omitted here because it is not needed to show the test class.

Scoring used the eight checks frozen in TEST-PLAN.md. A point is awarded only for explicit
evidence. The threshold is 7/8 with uncatalogued needs (check 7) mandatory.

| Probe | Initial score | Regression/final score | Result |
|---|---:|---:|---|
| Voice transformation / creator media | 8/8 | — | Pass |
| Private knowledge library with citations | 8/8 | — | Pass |
| Video/image to Markdown conversion | 8/8 | — | Pass |
| Undefined creative product idea | 7/8 | — | Pass; correctly deferred walkthrough because no workflow/slice exists yet |
| Remote image build + cloud GPU VM | 7/8 | 8/8 | Pass after regression fix |
| Local desktop tool with paid inference | 8/8 | — | Pass |

The cloud probe found a real composition miss: it noticed BE-DEPLOY-01's `Composes` reference
but left BE-OPS-07 out of the cast. SKILL.md and PROCESS.md now require transitive `Composes`
resolution, each code once, with false conditionals and exclusions recorded. A fresh probe on
the same brief included BE-OPS-07 and passed. This is a behavioral regression test of planning,
not a code build.

The undefined creative idea did **not** receive a fabricated app category or premature slice.
Its walkthrough was explicitly deferred until the owner supplies a workflow; this is the one
scorecard point withheld because no slice could yet be confirmed.

## 3. Limits and next validation

- The research matrix verifies traceability, not runtime behavior.
- The probes test planning and routing, not generated code quality. Their outputs were not
  independently blind-graded; this is a structured smoke test, not a benchmark.
- No real provider API, cloud account, GPU resource or private source upload was used.
- Next stronger test: run one owner-approved vertical slice in a real app, with tests-first,
  then verify the built UI and its observable acceptance checks. Cloud provisioning remains
  approval-gated and should not be part of an unapproved test.
