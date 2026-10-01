# Research coverage and app-planning evaluation

Version under test: ui-standards 1.3.0 · Test plan frozen before running app-planning probes.

This evaluates two different claims:

1. **Research traceability:** recurring behavior needs from the 19 ignored research reports
   map to a catalogue entry at the appropriate default level.
2. **Open-ended planning:** the skill preserves different owners' intent across unlike
   product ideas and machine/deployment constraints, without forcing them into a preset.

This is not a claim that every domain is implemented, or that the generated applications
work. App probes run in ADVISE mode and measure planning/routing only.

## Source normalization

Corpus: all 19 Markdown files in the local `Research/` folder. Two pairs are substantially
redundant (001D/001E and 001Q/001R), so count those as one independent position each. Do not
publish or modify raw research files. Matrix rows are deduplicated behavior requirements,
not a count of mentions.

Source IDs: `001`=Mistral, `001A`=original user query, `001B`=Opus, `001C`–`001F`=Astra/DeepSeek,
`001G`=Gemini, `001H`=Meta, `001I`=Inception Mercury, `001J`=Qwen, `001K`=GLM,
`001L`/`001P`=Fable, `001M`=Kimi, `001N`=Minimax, `001O`=Muse, `001Q`/`001R`=Bohrium/Cursor Grok.

## Research-derived checks

Coverage status is judged against current entry rules, not whether a related family merely
exists:

- **Required**: explicitly required when the pattern applies.
- **Conditional**: required when a documented condition applies.
- **Suggest**: present but deliberately not built by default.
- **Partial/Open**: missing detail or no complete entry; must be surfaced as a gap.

| ID | Observable behavior need | Current catalogue route | Expected status | Research sources |
|---|---|---|---|---|
| R01 | Select-all exposes none/all/mixed and mixed is conveyed programmatically | FE-SEL-01 R2 | Required | 001, 001A–001R (convergent) |
| R02 | Selection scope is explicit across pages/all results; filter changes have defined effects | FE-SEL-01 R4, C1–C3 | Required/Conditional | 001, 001B, 001D/E, 001G–001R |
| R03 | Selected count, clear action and bulk toolbar appear only when useful | FE-SEL-01 R3 | Required | 001, 001B, 001D/E, 001G–001R |
| R04 | Bulk operations report per-item partial failures and preserve failed items for retry | FE-SEL-01 R6; BE-API-05 | Required | 001B, 001D/E, 001G–001R |
| R05 | Row actions name and remain associated with their record; row-open and select do not conflict | FE-COLL-01 R1/R6; FE-SEL-01 R5 | Required | 001, 001B, 001D/E, 001G–001R |
| R06 | Tables expose real headers and accessible sort direction | FE-COLL-01 R1/R3; FE-COLL-04 R4 | Required | 001, 001B, 001D/E, 001F–001R |
| R07 | Long table content has a deliberate overflow/truncation strategy without losing identity | FE-COLL-01 R2/R4 | Required | 001, 001B, 001D/E, 001F–001R |
| R08 | Narrow tables preserve critical information via scroll or a deliberate transformation | FE-COLL-01 C3; FE-SHELL-03 | Conditional | 001, 001B, 001D/E, 001F–001R |
| R09 | Long collections paginate/load incrementally without skipped/duplicated records or lost position | FE-COLL-05 R1–R6 | Required | 001, 001B, 001C, 001F–001R |
| R10 | Search is debounced where live, stale results are suppressed, query and no-results state are clear | FE-COLL-03 R1–R6 | Required | 001, 001B, 001D/E, 001G–001R |
| R11 | Loading, empty, filtered-empty, error, unavailable and partial states are distinct | CORE-CARD; CORE F4; collection entries | Required | 001, 001B, 001C–001R |
| R12 | Keyboard operation, visible focus and named controls are baseline; overlays return focus | CORE-CARD; FE-FEED-03; FE-FORM-01 | Required | 001, 001B, 001C–001R |
| R13 | Destructive actions confirm or offer undo and name the affected object/count | FE-FEED-02 R1–R7 | Required | 001, 001B, 001C–001R |
| R14 | Forms have persistent labels, understandable validation, error summary and retained input | FE-FORM-01/02/05 | Required | 001, 001B, 001C–001R |
| R15 | Uploads state type/size/count and provide per-file progress, cancel, retry and partial result | FE-FORM-04; BE-FILE-01/04 | Required | 001B, 001D/E, 001G–001R |
| R16 | Starting another preview stops/pauses the current one; controls reflect actual media state; no surprise autoplay | FE-MEDIA-01 R1–R6 | Required | 001, 001A–001R (convergent) |
| R17 | Media seeking exposes duration/position and keyboard control; captions/transcripts are handled where relevant | FE-MEDIA-01/02 | Required/Conditional | 001, 001B, 001C, 001G–001R |
| R18 | Dialogs have correct semantics, Escape/close behavior, focus containment and focus return | FE-FEED-03 R1–R6 | Required | 001, 001B, 001C–001R |
| R19 | Navigation/current location/back/deep-link behavior is predictable for the runtime | FE-SHELL-01/02 | Required | 001, 001B, 001C–001R |
| R20 | Date, time, number and language presentation follows locale; RTL is handled when supported | CORE D1; FE-SHELL-05 | Required/Conditional | 001, 001B, 001D/E, 001H–001R |
| R21 | Reordering has a keyboard/non-drag path and announces the changed position | FE-SEL-04 R1/R4 | Required | 001, 001B, 001C, 001D/E, 001G–001R |
| R22 | Charts have labels/units and a non-visual or tabular alternative | FE-COLL-07 R4 | Required | 001D/E, 001H, 001K, 001N, 001Q/R |
| R23 | Saved views, density, columns and preferences are presented as optional, not silently added | FE-COLL-01/04/07 Suggest; FE-ACCT-04 | Suggest | 001B, 001D/E, 001H, 001J, 001K, 001N–001R |
| R24 | Collaboration/concurrency handles permissions and conflicting edits; presence/live co-editing is explicit if needed | BE-AUTH-05/06; BE-API-07 | Partial; presence gap must be named | 001D/E, 001H, 001J, 001K, 001N, 001Q/R |
| R25 | Offline operation and sync conflict handling are not assumed; applicable needs are raised as gaps | FE-FORM-05; BE-API-07; GAPS.md | Partial/Open; must be surfaced | 001H, 001J, 001K, 001N, 001Q/R |
| R26 | Theme/dark mode and reduced motion do not break contrast or operation | FE-SHELL-04; CORE F3/F7 | Required/Conditional | 001B, 001C, 001D/E, 001H, 001K, 001N, 001Q/R |
| R27 | User-provided media/recording permissions and consent are explicit | FE-MEDIA-04; FE-AI-01; BE-AI-01 | Required/Conditional | 001D/E, 001H, 001J, 001K, 001M–001R |

### Cross-cutting catalogue checks

| ID | Requirement | Route | Expected |
|---|---|---|---|
| X01 | Required / Conditional / Suggest / Approval separation | ENTRY-FORMAT.md + validator | Present and validator-enforced |
| X02 | Testable Given/When/Then criteria per entry | Family entries + validator | At least 3 each |
| X03 | Trigger-based retrieval plus overlap/composition | INDEX, CAPABILITIES, `Composes`, precedence | Present; index explicitly non-exhaustive |
| X04 | Evidence labels distinguish standards, conventions and proposals | ENTRY-FORMAT + each entry Source | Present; do not call original proposal a standard |
| X05 | Pre-build coverage sheet and owner-confirmed slice walkthrough | templates/COVERAGE.md, SLICE-WALKTHROUGH.md | Present |
| X06 | Anti-bloat/gap-driven growth; context-specific priorities | GAPS.md, CAPABILITIES.md, CORE-CARD.md | Present |
| X07 | Repeated codes/standards citation validity and cross-entry conflicts | Validator + manual audit | Must be checked; syntax checks alone are insufficient |

## App-planning probes

Run each as a fresh ADVISE-mode session. The owner is unavailable; the agent should ask only
questions that change the plan, record explicit assumptions, avoid code, and preserve novel
needs as uncatalogued rather than forcing a false match.

| ID | Brief | Must not miss |
|---|---|---|
| P1 | “I want to build a voice-changing app for creators. It takes my recording, offers different voices, and exports the result.” | Consent/rights, source preservation, preview/review, export, paid provider/cost uncertainty; do not assume cloning rights or a web account. |
| P2 | “Build a private knowledge library where I add PDFs and recordings, search them, and ask questions with citations.” | Source rights/privacy, ingestion status, citations to source location/version, no unsupported answers, delete/index lifecycle, cost/provider unknowns. |
| P3 | “Turn explainer videos and images into a clean Markdown document.” | Input formats, OCR/transcription, extraction review, output/structure choices, per-file progress/failure, local vs external processing and cost. |
| P4 | “I have a creative app idea; it should help people make something new, but I have not settled the workflow.” | Ask open questions about users, goal and successful outcome; do not force a product category or preselect AI/social/cloud features. |
| P5 | “My PC cannot run Docker or virtualization. I need to build a container image, then use a cloud GPU VM; I may want an AWS or Google Cloud dashboard.” | Separate build host, remote builder, image registry, runtime, cloud account, budget/quota/region, credential safety, VM stop vs delete, provider console vs in-app dashboard; no paid provisioning without approval. |
| P6 | “I want a desktop tool that processes local media with a paid model API; it is one user and files stay here.” | No auth/hosted API by default; local storage/file safety; provider key handling caveat; cost confirmation, duplicate-call recovery, progress/stop, output and consent. |

## Frozen app-probe scorecard

Score each probe 1 only when the plan explicitly handles the observable condition; otherwise 0.

1. Preserves the owner's goal and does not relabel it as a fixed app genre.
2. Separates runtime, data location, build host and delivery target where relevant.
3. Casts only applicable patterns and identifies important exclusions.
4. Asks/records consequential unknowns about cost, rights, privacy, data loss or exposure.
5. Makes Required/Conditional work distinct from Suggest/Approval work.
6. Includes an owner-readable per-slice walkthrough before code.
7. Records uncatalogued needs instead of silently omitting or inventing standards.
8. Gives a next step that does not require unsupported local infrastructure.

Threshold: each probe must score at least 7/8, and item 7 is mandatory. An applicable
Approval item cannot be counted as planned execution without explicit owner approval. Do not
change this threshold after seeing outputs.
