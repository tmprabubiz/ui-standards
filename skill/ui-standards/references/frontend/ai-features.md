# FE-AI · AI-assisted features

Load only when the app presents AI-generated, transformed, classified or retrieved content to a person.

## FE-AI-01 · Review AI-generated or transformed content

**Purpose:** Keep the person in control when an app generates or changes content with AI.
**Triggers:** AI generation, rewrite, summarize, transcribe, voice clone, image generation, model output, assistant, confidence, review result
**Applies when:** a user sees, edits, exports or publishes machine-generated content.
**Composes:** FE-FEED-01, FE-FORM-05, FE-COST-01, BE-AI-01

**Required**
- R1 Show when content is generated or transformed, and identify the source item or prompt when safe.
- R2 Show generated content as a draft until the user chooses to accept, edit, retry or discard it; never publish or send it as the user's own action without confirmation.
- R3 Preserve the original input and make the change reversible where practical; label what changed.
- R4 Keep errors, uncertainty and missing source material visible; do not present a model's unsupported claim as verified fact.
- R5 Let users inspect the exact text, files or recording being sent to an external model when the data may be private or sensitive.
- R6 If the output could impersonate a real person, alter a person's voice or likeness, or affect a consequential decision, require an explicit rights/consent check and human review before export or use.

**Conditional**
- C1 IF the feature uses a paid or quota-limited model THEN apply FE-COST-01 before every billable run.
- C2 IF the feature answers from a knowledge collection THEN show source citations beside claims and provide a way to open the cited source.
- C3 IF the model can produce multiple candidates THEN show them as alternatives and let the user compare before choosing.

**Suggest**
- S1 Keep a version history of accepted outputs — makes it easier to recover a better draft.
- S2 Let the owner rate or flag a result — helps them find low-quality outputs later.

**Approval**
- A1 Automatically publish generated material or send it to another person — the owner loses the last review step.
- A2 Use a real person's voice, face or likeness without documented permission — can mislead people and violate rights.

**Backend contract**
- Identify generated records as generated; preserve source references and consent records where needed (BE-AI-01).

**Acceptance**
- [ ] Given generated content appears, when the user views it, then it is labelled as generated and is not published or sent automatically.
- [ ] Given the user edits generated content, when they save, then the original input and accepted version remain distinguishable.
- [ ] Given the feature uses a paid model, when it runs, then FE-COST-01's confirmation and duplicate-call protections apply.
- [ ] Given output could imitate a real person's voice or likeness, when it is exported, then required consent and review are recorded first.

**Exceptions**
- A background classifier that only updates internal metadata may use a review queue instead of blocking every item, if the owner approves that workflow.

**Source:** human oversight and transparency (convention); provider terms and applicable likeness/voice rights (jurisdiction-dependent); review-before-publish (proposal)
