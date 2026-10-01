# Contributing

Thanks for helping make AI-built apps more complete. Two kinds of contribution matter most.

## 1. Report a missing convention (no coding needed)

Your agent built something and left out behaviour you expected, such as an undo,
a confirmation, an empty state or a privacy rule. Open a
[Missing convention](../../issues/new?template=missing-convention.yml) issue. Each report
becomes evidence in [GAPS.md](GAPS.md) for a new entry.

## 2. Add or improve an entry

1. Pick an open issue labelled `good first issue` or `new entry`, or a row in `GAPS.md`.
2. Follow [docs/ENTRY-FORMAT.md](docs/ENTRY-FORMAT.md). Each entry must have:
   - 1–7 Required items
   - Conditional items written as `IF … THEN …`
   - at least 3 acceptance checks written as "Given …, when …, then …"
   - a Source line labelled (standard), (convention) or (proposal)
3. Write in plain English. Suggest and Approval lines are shown to non-technical owners
   as questions.
4. Run the checks:

   ```bash
   node scripts/build-index.mjs
   node scripts/validate.mjs
   ```

5. Open a pull request. Say which standard or which 3+ mature products back the behaviour.

## 3. Run an evaluation

Repeat [evals/2026-10-plan-comparison](evals/2026-10-plan-comparison/README.md) with a
different app idea, planning model or grader, and add your results under `evals/`.
Results that don't favour the catalogue are just as welcome.

## Ground rules

- Describe behaviour, not frameworks or brands.
- Record tie-breaks in [DECISIONS.md](DECISIONS.md).
- Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
