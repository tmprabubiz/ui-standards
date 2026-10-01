# Capability routing

This is a **non-exhaustive retrieval aid**, not a list the owner must choose from. A project
can combine several capabilities, and its domain may need patterns not catalogued here.
Listen to the brief, identify the actual operations, then load only the matching entries.

| If the app needs to… | Consider loading… |
|---|---|
| accept, edit, organize or export files/media | FE-FORM-04, FE-MEDIA-*, BE-FILE-* |
| generate, transform, classify or transcribe content with a model | FE-AI-01, FE-COST-01 when metered, BE-AI-01 |
| answer from an owner's documents or media | FE-KNOW-01, FE-AI-01, BE-KNOW-01/02 |
| run slow work or batch jobs | FE-FEED-04; FE-DESK-03 for desktop; BE-JOB-* or BE-LOCAL-03 |
| create a cloud VM/GPU, build an image remotely or deploy | BUILD-ENVIRONMENTS.md, FE-CLOUD-01 if an app dashboard controls resources, BE-CLOUD-*, BE-DEPLOY-* |
| store structured information and search it | FE-COLL-*, BE-DATA-*, BE-KNOW-* if extracted knowledge is indexed |
| share, collaborate, charge, schedule or notify | Match the specific workflow; do not assume the capability from the domain name |

The `*` and grouped codes mean “inspect relevant entries in that family”, not “load every
entry”. The INDEX trigger terms help discovery but are not exhaustive. Search by purpose,
inputs, outputs, risks and user action, not keyword alone.

## When no family fits

1. Write down the owner-visible need and what makes it different.
2. Ask only the missing decisions that change safety, workflow, cost or data handling.
3. Check authoritative domain/platform requirements where they exist; label sourced rules
   separately from conventions and new proposals.
4. Cover the need explicitly in the app's slice plan, even without a catalogue code.
5. Put the uncovered reusable behaviour in `docs/ui-standards/NEXT-ITERATION.md` under
   "Catalogue gaps". Do not claim the catalogue covers it until a reviewed entry exists.

App domains are effectively unbounded. The goal is not to pre-author a category for every
idea; it is to preserve owner intent, compose known patterns, and make unknowns visible.
