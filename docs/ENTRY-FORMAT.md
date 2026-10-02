# Entry format

Every catalogue entry lives in a family file under `skill/ui-standards/references/frontend/`
or `.../backend/`. `scripts/validate.mjs` enforces this format.

## File layout

```md
# <Family title>

<One or two lines on what this family covers and when to load it.>

## FE-SEL-01 · Multi-select collection and bulk actions
...entry...

## FE-SEL-02 · ...
```

## Entry template

```md
## FE-SEL-01 · Multi-select collection and bulk actions

**Purpose:** Let users pick several items and act on them together.
**Triggers:** select multiple, checkboxes, select all, bulk delete, bulk edit, inbox, batch action
**Applies when:** users can perform a meaningful action on more than one item at once.
**Composes:** FE-COLL-01, FE-FEED-02, BE-API-05

**Required**
- R1 One selection control per item, with an accessible name naming the item.
- R2 Select-all control with three states: none, all, mixed (indeterminate).
- R3 Selected count is visible whenever at least one item is selected.

**Conditional**
- C1 IF results span pages THEN state the select-all scope ("this page" or "all 240 results").
- C2 IF the bulk action is destructive THEN apply FE-FEED-02 (confirm or undo).

**Suggest**
- S1 Shift-click range selection — saves time for power users with long lists.

**Approval**
- A1 Bulk delete with no recovery path.

**Backend contract**
- Bulk endpoint accepts a list of ids, returns per-item results (see BE-API-05).

**Acceptance**
- [ ] Given no items selected, when the list renders, then select-all is unchecked and bulk actions are hidden or disabled.
- [ ] Given some items selected, when the user looks at select-all, then it shows the mixed state.
- [ ] Given a bulk action fails for 2 of 10 items, when it completes, then the user sees which 2 failed.

**Exceptions**
- Do not add checkboxes when the only action is opening a single item.

**Source:** WAI-ARIA APG Checkbox (standard); Gmail, Outlook, Finder (convention)
```

## Rules (validator-enforced)

| Rule | Detail |
|---|---|
| Heading | `## <CODE> · <Title>` where CODE is `FE-<FAMILY>-NN` or `BE-<FAMILY>-NN` |
| Family | Must match the file's family (e.g. `FE-SEL` only in `frontend/selection.md`) |
| Unique | Each code appears as a heading exactly once across the catalogue |
| Fields | `**Purpose:**`, `**Triggers:**`, `**Applies when:**`, `**Composes:**`, `**Required**`, `**Conditional**`, `**Suggest**`, `**Approval**`, `**Acceptance**`, `**Source:**`; write `None.` when there are no composed entries |
| Contract | FE entries need `**Backend contract**`; BE entries need `**Frontend contract**`. Write `- None.` when there is none. |
| Budget | 1–7 Required items (`- R1` …) |
| Conditional form | Each item reads `- C<n> IF … THEN …` |
| Acceptance | ≥ 3 items, each `- [ ] Given …, when …, then …` |
| References | Every code in `**Composes:**` and in any `FE-…`/`BE-…` mention must exist |
| Index | `INDEX.md` must equal the output of `node scripts/build-index.mjs` |

## Writing rules

- Behaviour, not framework. Say "the dialog returns focus to the control that opened it",
  not "use Radix Dialog".
- Plain English. A non-technical owner should understand every Suggest and Approval line,
  because those lines are shown to them as questions.
- Each Suggest item ends with a short reason after a dash: what the user gains.
- Source labels: `(standard)` for WCAG, WAI-ARIA, HTML, HTTP RFCs, OWASP; `(convention)` for
  behaviour seen in 3+ mature products; `(proposal)` for this catalogue's own rule.
- Do not repeat CORE floors inside entries; reference them as `CORE F3` if needed.
