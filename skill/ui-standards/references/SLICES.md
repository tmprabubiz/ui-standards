# SLICES — linking screen, API and data

A **slice** is one user goal delivered end to end. Build and verify one slice at a time so
the front end never calls an API that does not exist and the back end never stores data
no screen uses.

## Slice contract

Write one block per slice in COVERAGE.md:

```
Slice S3 · Delete recordings in bulk
Goal: The owner removes several recordings at once and can undo.
Screen: Recordings list (FE-COLL-01, FE-SEL-01, FE-FEED-02)
API: POST /recordings/bulk-delete {ids[]} → {results[{id, ok, error?}]} (BE-API-05)
Data: recordings.deleted_at (soft delete, BE-DATA-03); purge job after 30 days (BE-JOB-01)
Permissions: owner of each recording only (F11)
States: loading, empty, error, partial (some failed), disabled (nothing selected)
Checks: FE-SEL-01 acceptance 1–3; BE-API-05 acceptance 1–3
```

## Rules

1. Every screen action that changes data names its endpoint; every endpoint names the screen
   or job that calls it.
2. Every endpoint names its permission rule (F11).
3. Every field shown on screen exists in data or is derived; every stored field has a reason.
4. Error codes returned by the API are mapped to plain messages on the screen (F14).
5. The partial state is designed whenever an API acts on more than one item.

## Standard slices most apps need

Check these against the app before building features. Each is either in the Cast or
listed as an exclusion with a reason.

| Slice | Usually needs |
|---|---|
| First visit / landing | FE-SHELL, FE-ACCT onboarding |
| Sign up, sign in, sign out, reset password | FE-ACCT, BE-AUTH |
| Main list of the core thing | FE-COLL, BE-API pagination, BE-DATA |
| Create / edit the core thing | FE-FORM, BE-API validation |
| Delete and recover | FE-FEED confirm/undo, BE-DATA soft delete |
| Profile and settings | FE-ACCT, BE-AUTH |
| Delete my account and data | FE-ACCT, BE-OPS privacy (Approval if data is shared) |
| Errors and not-found pages | FE-SHELL, CORE F4 |
| Admin view (if roles exist) | FE-COLL, BE-AUTH roles |
