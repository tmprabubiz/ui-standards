# SLICES — linking screen, API and data

A **slice** is one user goal delivered end to end. Build and verify one slice at a time so
the screen, local operation or network API, and persisted data agree. A desktop app may have
no API or hosted back end.

## Slice contract

Write one block per slice in COVERAGE.md:

```
Slice S3 · Delete recordings in bulk
Goal: The owner removes several recordings at once and can undo.
Screen: Recordings list (FE-COLL-01, FE-SEL-01, FE-FEED-02)
Visual: Selected recordings are clearly distinguished; destructive actions are visually separated.
Interactions: Select, clear, delete, cancel and undo; show feedback after each action.
Associated elements: Confirmation or undo notice, selection controls, and per-item failure details.
Responsive: Keep selection and primary actions usable when the window narrows or text is enlarged.
Accessibility: Keyboard path, accessible names, visible focus, and focus return after dialogs.
Navigation: Entry point, destinations, and return-to-list behavior.
Operation/API: POST /recordings/bulk-delete {ids[]} → per-item results (BE-API-05), or local delete operation (BE-LOCAL-02)
Data: recordings.deleted_at (soft delete, BE-DATA-03) or local recovery record; purge job only if configured
Permissions: per-record check for shared/hosted data (CORE F11); local ownership for single-user files
States: default, loading, empty, no results, error (input retained), unavailable/not allowed, partial (some failed), disabled (nothing selected)
First run: What changes on the first launch compared with later use?
Risk/approval: Bulk deletion and any action without recovery require explicit approval.
Checks: FE-SEL-01 acceptance 1–3; BE-API-05 acceptance 1–3
```

## Rules

1. Every screen action that changes data names its local operation or endpoint; every
   operation/endpoint names the screen or job that calls it.
2. Every network endpoint names its permission rule (CORE F11); local operations name their
   filesystem/data boundary.
3. Every field shown on screen exists in data or is derived; every stored field has a reason.
4. Error codes returned by the API are mapped to plain messages on the screen (F14).
5. The partial state is designed whenever an API acts on more than one item.

## Standard slices most apps need

Check these against the app before building features. Each is either in the Cast or
listed as an exclusion with a reason.

| Slice | Usually needs |
|---|---|
| First launch / landing | FE-SHELL; FE-ACCT onboarding only if accounts are used; FE-DESK for installed desktop |
| Sign up, sign in, sign out, reset password | FE-ACCT, BE-AUTH (only when accounts exist) |
| Main list of the core thing | FE-COLL; BE-API + BE-DATA for hosted data, BE-LOCAL for local data |
| Create / edit the core thing | FE-FORM; BE-API for hosted data, BE-LOCAL for local data |
| Delete and recover | FE-FEED; BE-DATA for hosted data, BE-LOCAL for local data |
| Profile and settings | FE-ACCT for accounts; local preferences may use FE-DESK only |
| Delete my account and data | FE-ACCT, BE-OPS privacy (only if accounts or hosted personal data exist) |
| Errors and recovery | FE-FEED; FE-SHELL for web routes; FE-DESK-05 for desktop diagnostics |
| Admin view (if roles exist) | FE-COLL, BE-AUTH roles |
