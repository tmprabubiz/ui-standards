# PROCESS — context to verified slices

The process is reusable across app domains. It does not assume a website, account system,
backend, UI framework, cloud provider or finite set of app categories.

## Phase 0 · Resume and inspect

- Read the app's `docs/ui-standards/COVERAGE.md` and `NEXT-ITERATION.md` if present.
- Inspect the existing project instructions, stack, tests, data and any user changes before
  proposing replacements.
- Identify host constraints that matter (OS, memory, local virtualization/container support,
  local GPU, network access). Do not assume tools are installed or the machine can run them.

## Phase 1 · Discover the idea

Restate, in the owner's language:

```
Goal: <what someone will accomplish>
People: <who uses it and their real context>
Workflow: <the most important actions from start to finish>
Inputs and outputs: <what comes in, changes, and leaves>
Important constraints: <what must not happen; privacy, rights, cost, safety, reliability>
Unknowns: <only decisions that change the design>
```

Do not ask the owner to choose an app category from a fixed list. They describe the app;
the agent derives a working model and checks it back with them.

## Phase 2 · Understand context and domain

- Separate user-facing needs from technical choices.
- Identify domain-specific rules, rights, terminology, data meaning and failure costs.
- Ask at most five consequential questions per round. Use free-text when choices would
  distort the idea; provide plain multiple-choice answers only when they make a decision easier.
- If a domain rule is unknown, mark it unknown. Research authoritative sources where useful;
  distinguish a sourced requirement from common practice and a new proposal.
- Never use one example app or benchmark as evidence that every domain is covered.

## Phase 3 · Runtime, build and delivery environment

These are independent axes. Ask only what affects the app or its cost/security:

1. **Runtime:** where people use it (browser, installed computer, phone/tablet, terminal,
   embedded, multiple surfaces, or another form).
2. **Data and services:** local, hosted or mixed; what outside services receive data or charge.
3. **Build host:** what the owner's computer can actually run. If it lacks virtualization,
   Docker support, RAM or a GPU, use `BUILD-ENVIRONMENTS.md` to compare hosted CI/cloud build,
   a remote VM, or a non-container path.
4. **Delivery:** where the finished app runs and who can operate/stop it. The cloud provider's
   console and a custom dashboard inside the product are different workflows; ask which is meant.
5. **Cost boundary:** budget, owner approvals, shutdown/retention and what persists after stopping.

Cloud provisioning, uploading source to a remote builder, publishing a public artifact,
opening network access and starting paid GPU/VM resources are explicit-approval actions.
Never infer permission from the app idea.

## Phase 4 · Make slices

Split the idea into end-to-end goals, not screens for their own sake. A slice can be a UI
journey, a local file operation, a service integration, a cloud build, a data pipeline or a
combination. See `SLICES.md`. Keep local and hosted responsibilities distinct.

## Phase 5 · Retrieve and compose patterns

1. Load `CORE-CARD.md`.
2. Use `PROFILES.md` to choose retrieval views for runtime/build environment. A profile is
   only a context-saving aid, not a product-domain classification.
3. Search the general `INDEX.md` and `CAPABILITIES.md` by user goal, inputs, outputs and risks.
   Trigger phrases are hints; the index is not exhaustive.
4. Read only relevant family files. Do not add a family just because an app shares one word.
5. Follow every selected entry's `Composes` links transitively, recording each code once.
  Include a conditional composition only when its condition is true; otherwise record it
  as not applicable. Do not leave a dependency unexplained.
6. If nothing fits, use the gap process in `CAPABILITIES.md`; specify the novel behaviour as
   an uncatalogued requirement and acceptance check. Do not silently omit it.

## Phase 6 · Walk through and cover

- Fill `templates/COVERAGE.md` and `templates/SLICE-WALKTHROUGH.md` in the app.
- Before code, show one line per screen/slice: what the owner does, what they see, and what
  is preserved if it fails. Confirm each slice before building it.
- Mark Required, true Conditional, Suggest, Approval, explicit exclusions and uncatalogued
  needs. Never add a Suggest or Approval item silently.

## Phase 7 · Build

- Build one confirmed slice at a time, in the order that proves the riskiest assumptions early.
- Inspect existing tests; add/update behavior tests before implementation. Never remove or
  weaken a failing test to get a pass.
- Use the project's current stack and test tools; do not add dependencies or cloud services
  without consent.
- For local-only apps, use local operations and persistence; do not invent a hosted API.
- For remote builds, follow `BUILD-ENVIRONMENTS.md` and `BE-DEPLOY-*`; no local Docker daemon
  is required when a suitable remote builder is used.

## Phase 8 · Verify and advise

- Verify acceptance items with tests, a running journey, or an explicit code-path check.
- For cloud resources, verify status, actual/estimated cost and stop/delete behavior.
- Report the standards applied, assumptions, exclusions, unresolved risks and uncatalogued
  needs in plain language.
- Write unbuilt options to `NEXT-ITERATION.md`, including benefit, effort and any approval needed.

## Later iterations

Resume from the app coverage sheet. New slices are added; changed slices are re-gated. A
project-specific improvement belongs only in that project's code. A generally reusable
missing behavior may be proposed in this repository's `GAPS.md` after it has evidence beyond
one project.
