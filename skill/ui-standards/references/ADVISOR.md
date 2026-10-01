# ADVISOR — questions for defining an app

Use in Phase 1 (missing facts) and Phase 6 (next iteration). Ask at most 5 per round, as
multiple choice, with the recommended default marked. Skip any question the owner has
already answered or that does not change the build.

**The owner's brief always wins.** Infer answers from what they described before using a
default. A default is the safe choice only when the brief says nothing. Examples: a
library of recordings implies hundreds of items (Q6) and acting on many at once (Q7);
"share with my editor" implies Q9 sharing.

Format each question as:

```
<Question in plain words>
  a) <option> (recommended — <why, in 8 words or fewer>)
  b) <option>
  c) Not sure — use the recommendation
```

## Round 1 · Shape of the app (ask first)

| # | Question | Options (recommended first) | Activates |
|---|---|---|---|
| Q1 | Do people need their own account? | Yes, email + password / Yes, sign in with Google or Apple / No accounts | FE-ACCT-01, FE-ACCT-02, FE-ACCT-03, BE-AUTH-01, BE-AUTH-02, BE-AUTH-03, BE-AUTH-04 |
| Q2 | Are there different kinds of users with different powers? | Just one kind / Owner + members / Admin + staff + customers | BE-AUTH-05, FE-ACCT-07 |
| Q3 | Where will it be used? | Web on phone and computer / Phone app / Desktop only | FE-SHELL-01, FE-SHELL-03 |
| Q4 | What are the main things the app keeps? (e.g. projects, recordings, orders) | free text | BE-DATA-01, BE-API-01, FE-COLL-01, FE-COLL-02, FE-COLL-06 |
| Q5 | Will people upload files, photos, audio or video? | No / Images / Audio or video / Any document | FE-FORM-04, BE-FILE-01, BE-FILE-02, BE-FILE-03, FE-MEDIA-01 |

## Round 2 · Behaviour

| # | Question | Options | Activates |
|---|---|---|---|
| Q6 | How many items might one person have in a list? | Under 50 / Hundreds / Thousands+ | FE-COLL-05, BE-API-04; Thousands+ adds FE-COLL-03, BE-DATA-07 |
| Q7 | Should people be able to act on many items at once (delete, move, tag)? | No / Yes | FE-SEL-01, BE-API-05 |
| Q8 | Should the app tell people when something happens? | No / In the app / By email too / Phone push too | FE-FEED-05, BE-JOB-04, BE-JOB-03 |
| Q9 | Can people share or work on the same thing together? | No / Share read-only links / Edit together | BE-AUTH-06, BE-API-07 |
| Q10 | When something is deleted, should it be recoverable? | Yes, a bin for 30 days / Undo only / No, gone | FE-FEED-02, BE-DATA-03 (CORE F16) |

## Round 3 · Business and risk

| # | Question | Options | Activates |
|---|---|---|---|
| Q11 | Does the app take payments? | No / One-off / Subscriptions | Approval-only: no entry yet; never built without explicit yes (see GAPS) |
| Q12 | Does it hold personal or sensitive data (health, money, children, location)? | No / Some personal data / Sensitive data | BE-OPS-06, FE-ACCT-06, BE-DATA-04 |
| Q13 | Which languages and regions? | One language / Several languages / Right-to-left too | FE-SHELL-05 |
| Q14 | Do you need to see what people do in the app (usage, errors)? | Errors only / Errors + basic usage / Detailed analytics | BE-OPS-02, BE-OPS-03; analytics is Approval-only |
| Q15 | Will other systems connect to it? | No / Send data out (webhooks) / Receive data in (API keys) | BE-JOB-05, BE-JOB-06, BE-AUTH-07 |

## Turning answers into the build

- Each answer maps to codes in the "Activates" column. Add them to the Cast.
- "Not sure" → recommended option; note it in the Frame as an assumption.
- If an answer turns on an Approval item (payments, analytics, permanent delete,
  data export), confirm it explicitly before building.

## Next-iteration advice

When writing NEXT-ITERATION.md, for each item give:

- **What:** one plain line ("Let people undo a delete for 10 seconds").
- **Why you may want it:** one plain line of benefit.
- **Effort:** S (under an hour of agent work), M (a slice), L (several slices).
- **Code:** the entry and item id, e.g. `FE-FEED-02 S1`, so the next session can build it directly.

Order by: safety gaps first, then items users will notice daily, then convenience.
