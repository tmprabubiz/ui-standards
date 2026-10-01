# Plan comparison — with and without ui-standards

**Question:** when an AI agent plans an app for a non-technical owner, does ui-standards
reduce the conventions it leaves out?

## Method

1. Wrote a 30-item [checklist](CHECKLIST.md) of conventions users expect in a field-recordings
   app **before** producing either plan.
2. Same prompt, same model (Claude Sonnet 5.5), fresh context each time:
   - **A — without:** "plan the whole app, front end and back end" → [plan-A.md](plan-A.md)
   - **B — with:** the same request, following the skill in ADVISE mode, taking the
     recommended answer for each question.
3. A different model (GPT-5.5) graded both plans blind against the checklist. Items that are
   only suggested, deferred or awaiting approval score 0.
   - **B-strict** counts only what the coverage sheet says in its own words.
   - **B-resolved** also counts the Required items of the catalogue entries the sheet cites
     for that slice, which is what the building agent loads during the build.
4. The first run (v1.0) exposed contradictions in the catalogue. They were fixed (v1.1, see
   CHANGELOG) and B was run again once. Both runs are published; neither was re-run to get
   a better score.

## Results

| Run | A — without | B-strict | B-resolved |
|---|---|---|---|
| v1.0 | 21 / 30 | 22 / 30 | **28 / 30** |
| v1.1 | 20 / 30 | 16 / 30 | **27 / 30** |

Per-item scores and evidence: [RESULTS-v1.0.md](RESULTS-v1.0.md), [RESULTS-v1.1.md](RESULTS-v1.1.md).
Plans: v1.0 [coverage](plan-B-v1.0-COVERAGE.md) · [next iteration](plan-B-v1.0-NEXT-ITERATION.md);
v1.1 in [examples/field-recordings](../../examples/field-recordings/).

Items the plan without the skill left out in both runs: error message with retry that keeps
input, no autoplay, select-all mixed state, per-item bulk failures, stating the file size
limit, search state in the URL, unsaved-changes warning, accessible names on icon buttons.

## What this shows

- **Applied in full, the catalogue covers 27–28 of 30 conventions, against 20–21 without it.**
- **The coverage sheet's own text is not more complete** (22 vs 21, then 16 vs 20). It
  cites entry codes instead of restating them, so the improvement only appears when the
  building agent loads those entries, as the skill tells it to.
- What the plan without the skill missed is mostly small interaction detail. What the plan
  with the skill missed comes from what it chose to leave out of scope (sharing roles,
  metadata handling, account export in v1.1). The skill records those choices in "Not cast"
  and the next-iteration list instead of dropping them silently.
- Running the skill found 9 real contradictions in the catalogue; they are fixed in 1.1.0.

## Limitations

- One app, one prompt, one planning model, two runs. Grading varies by about one point
  (A scored 21 and then 20 for the same file).
- The checklist was written by the catalogue's author, so its items overlap catalogue
  entries. B-resolved favours the catalogue by construction; read it as "does the catalogue
  reach the agent", not as independent proof.
- This compares plans, not built apps. A build comparison is the next evaluation.

Contributions welcome: run the same method with another app idea, model or grader, and open
a pull request with your results.
