# BE-DATA · Data and storage

How data is shaped, changed, kept safe and found again: schema, migrations, recovery, audit, backups, demo data, search. Load for any app that stores data.

## BE-DATA-01 · Schema conventions

**Purpose:** Give every table the same sound foundation so data stays correct, separable per owner, and fast.
**Triggers:** database, schema, table, column, primary key, foreign key, timestamps, index, constraint, tenant, owner column, data model, unique
**Applies when:** the app stores records in a database.
**Composes:** BE-DATA-02, BE-DATA-03, BE-AUTH-05, BE-API-04

**Required**
- R1 Every table has a stable primary key that is not a meaningful value, and ids exposed to clients are not guessable sequences (use random or time-ordered unique ids).
- R2 Every table has `created_at` and `updated_at`, stored in UTC with time zone semantics (CORE D1, CORE D2); `updated_at` changes on every write.
- R3 Every table holding user data has a non-null owner or tenant column that is part of access checks and of the relevant indexes (CORE F11).
- R4 Rules live in the database as well as the code: `NOT NULL`, `UNIQUE`, `CHECK`, and foreign keys with a stated delete behaviour (restrict, cascade or set null chosen deliberately).
- R5 Every foreign key column, and every column used to filter or sort a list, has an index; queries are checked on realistic data volume.
- R6 Money is stored as integer minor units plus a currency code, never as floating point; durations and quantities state their unit in the column name.
- R7 Names are consistent: one case style, singular or plural table names chosen once, no reserved words, no abbreviations the owner could not read.

**Conditional**
- C1 IF users can delete records THEN add `deleted_at` per BE-DATA-03 and make uniqueness rules ignore deleted rows.
- C2 IF several organisations share the database THEN enforce tenant isolation in a central place (query scope or database row-level security), not by remembering in each query.
- C3 IF a value is an enumeration THEN store it as a constrained text or lookup, not a magic number.

**Suggest**
- S1 A short data dictionary describing each table and field — lets the owner and future developers know why each field exists.
- S2 A diagram of the tables generated from the schema — makes the model easy to discuss.

**Approval**
- A1 Storing sensitive personal data (health, government ids, children's data, precise location).
- A2 Storing card numbers or bank details (never; use a payment provider and keep only its reference).

**Frontend contract**
- Screens use the ids and timestamps from the API as opaque values and format times in the user's zone (CORE D1).
- Screens do not depend on database ordering; sorting is requested explicitly (BE-API-04).

**Acceptance**
- [ ] Given the schema, when all tables are listed, then each has a primary key, `created_at` and `updated_at`.
- [ ] Given a table of user data, when its definition is read, then it has a non-null owner or tenant column and an index on it.
- [ ] Given a row referencing a missing parent, when it is inserted, then the database refuses it.
- [ ] Given two records with the same value in a unique field, when the second is inserted, then it is refused with a conflict the API reports as 409.

**Exceptions**
- Pure lookup tables (country codes) may omit the owner column; read-only reference data needs no `updated_at` writes.

**Source:** OWASP ASVS 4.0.3 V4 and V8 Data Protection (standard); OWASP Insecure Direct Object Reference Prevention Cheat Sheet (standard); integer money and index-on-foreign-key (convention)

## BE-DATA-02 · Migrations

**Purpose:** Change the database safely over time, the same way on every machine, without losing data.
**Triggers:** migration, schema change, alter table, add column, drop column, rollback, database version, deploy database, seed schema
**Applies when:** the database structure changes after first release, or the app runs in more than one environment.
**Composes:** BE-DATA-01, BE-DATA-05, BE-OPS-07

**Required**
- R1 Every schema change is a numbered migration file stored in the repository; no change is made by hand in any environment.
- R2 An applied migration is never edited; fixes are new migrations.
- R3 Migrations run in order, once per environment, with the applied list recorded in the database.
- R4 Each migration is either reversible (has a down step) or declared forward-only with a written fix-forward plan.
- R5 Destructive steps (drop column or table, narrowing a type) are separate migrations, run only after the code that used the data has been deployed, and only after a verified backup (BE-DATA-05).
- R6 A fresh database built only from migrations matches the schema the app expects; this is checked automatically.

**Conditional**
- C1 IF existing rows must be reshaped THEN write a data migration that is repeatable, runs in batches on big tables, and is tested on a copy of realistic data.
- C2 IF the app must stay up during deploy THEN use expand-then-contract steps: add new, write both, switch reads, remove old.
- C3 IF a new non-null column is added THEN supply a default or backfill in the same migration.

**Suggest**
- S1 Run migrations automatically as a deploy step with a stop on failure — nobody forgets to run them.
- S2 A dry-run preview showing the changes — lets the owner see what will happen before it does.

**Approval**
- A1 Any migration that deletes or irreversibly rewrites production data.
- A2 Running a migration that locks the app during business hours.

**Frontend contract**
- None.

**Acceptance**
- [ ] Given an empty database, when all migrations run, then the schema equals the one the app starts against.
- [ ] Given an already-applied migration, when the migration runner is run again, then nothing is re-applied.
- [ ] Given an applied migration file, when its content differs from the recorded checksum, then the run stops with an error.
- [ ] Given a destructive migration, when production is targeted, then it runs only with a recorded backup reference.

**Exceptions**
- A throwaway prototype with disposable data may recreate the database instead of migrating, until real data exists.

**Source:** expand-and-contract schema evolution and versioned migrations (convention); OWASP ASVS 4.0.3 V1.14 Configuration (standard); verified-backup-before-destructive-change (proposal)

## BE-DATA-03 · Soft delete and recovery bin

**Purpose:** Make deleting reversible so a mistake never costs someone their work, and let data really disappear on a known schedule.
**Triggers:** delete, soft delete, trash, recycle bin, restore, undo delete, deleted_at, purge, permanent delete, archive, recover
**Applies when:** users can delete records that matter to them.
**Composes:** BE-API-01, BE-JOB-02, BE-DATA-04, BE-OPS-06, FE-FEED-02, FE-COLL-01

**Required**
- R1 Deleting sets `deleted_at` (and who deleted it) instead of removing the row (CORE F16).
- R2 All normal queries, lists, counts, searches and exports exclude deleted rows by default; this is done in one central place, not remembered per query.
- R3 A restore endpoint clears `deleted_at`; restoring to a place that no longer exists (deleted parent) says so and offers a fix.
- R4 Deleting a parent deletes or hides its children together, and restoring the parent brings them back with it.
- R5 Deleted items stay recoverable for a stated period (default 30 days), after which a scheduled job permanently removes them and their files (BE-JOB-02, BE-FILE-02).
- R6 Uniqueness rules ignore deleted rows (e.g. unique name among non-deleted), so a name can be reused.
- R7 A permanent delete is an explicit, separate action by the owner, restricted by permission, and written to the audit log.

**Conditional**
- C1 IF the data is personal data a user asked to erase THEN follow BE-OPS-06 for purge timing instead of the default period.
- C2 IF records are legally required to be kept THEN archive instead of delete and say so in the coverage sheet.

**Suggest**
- S1 A "Recently deleted" view with restore and empty-bin — gives people a safety net they can find.
- S2 A reminder before the purge date — avoids surprise permanent loss.

**Approval**
- A1 Permanent delete with no recovery period.
- A2 Shortening the recovery period below 7 days.
- A3 Purging data covered by a legal retention duty.

**Frontend contract**
- Delete actions use confirm-or-undo (FE-FEED-02) and call the soft-delete endpoint.
- A "Recently deleted" list shows deleted items with restore and, for permitted users, permanent delete (FE-COLL-01).

**Acceptance**
- [ ] Given a record is deleted, when lists, search and counts are read, then it does not appear.
- [ ] Given a deleted record within the recovery period, when it is restored, then it reappears with its children.
- [ ] Given a deleted record past the recovery period, when the purge job runs, then the row and its stored files are removed.
- [ ] Given a deleted record named "Q1", when a new record named "Q1" is created, then it succeeds.

**Exceptions**
- Throwaway data (expired tokens, caches, logs) may be hard deleted directly; recovery matters for user-created content.

**Source:** soft delete with `deleted_at` and trash retention (convention); GDPR Art. 17 timing interplay (standard); central default scope rule (proposal)

## BE-DATA-04 · Audit log

**Purpose:** Keep a trustworthy record of who did important things and when, so problems can be understood and misuse noticed.
**Triggers:** audit log, activity log, history, who changed, change log, accountability, admin actions, security events, compliance
**Applies when:** the app has more than one user, any administrator action, sensitive data, or money.
**Composes:** BE-AUTH-05, BE-OPS-02, BE-DATA-03, FE-COLL-01

**Required**
- R1 Important actions write an audit entry: sign-in and failures, password or email change, role or permission change, share and invite, key creation, export, delete and restore, settings changes.
- R2 Each entry holds actor, action, target type and id, time (UTC) and request id; it records what changed without secrets, passwords or whole documents. Source address and device details are added only when A1 is approved.
- R3 The audit log is append-only for the app: no edit or delete endpoint exists, and database write permission for the app is limited accordingly.
- R4 Audit entries are written in the same step as the action, so an action without a record cannot happen.
- R5 Only permitted roles can read audit entries, and only for their own organisation (CORE F11); the log is searchable by actor, action and date with paging (BE-API-04).
- R6 Entries are kept for a stated period (default 12 months) and then removed by a scheduled job.

**Conditional**
- C1 IF an actor acts on behalf of another user THEN record both identities.
- C2 IF personal data is erased (BE-OPS-06) THEN replace the actor details in older entries with a neutral marker, keeping the event.
- C3 IF the log is shown to end users THEN show a plain-language sentence per entry.

**Suggest**
- S1 A "recent activity" page for account owners — they can spot something unusual.
- S2 Alerts on rare high-risk events (role escalation, mass export) — early warning without watching.

**Approval**
- A1 Recording source addresses or device details (personal data with privacy impact).
- A2 Keeping the log longer than a year.
- A3 Sending audit data to an outside service.

**Frontend contract**
- An activity or audit screen lists entries as a filterable, paged table with the request id (FE-COLL-01).
- Screens never expose an edit or delete control for entries.

**Acceptance**
- [ ] Given a role change, when it is made, then an entry exists naming the actor, the target, the old and new role, and the request id.
- [ ] Given the API, when any request tries to modify or delete an audit entry, then no such endpoint exists.
- [ ] Given a member without audit permission, when they request the log, then the response is 403.
- [ ] Given a failed action that rolled back, when the log is read, then no entry claims it happened.

**Exceptions**
- A single-user hobby app may log only sign-in and delete events.

**Source:** OWASP ASVS 4.0.3 V7 Error Handling and Logging (standard); OWASP Logging Cheat Sheet (standard); append-only audit trail (convention)

## BE-DATA-05 · Backups and restore

**Purpose:** Make sure the owner's data survives mistakes, failures and attacks, and can be brought back when needed.
**Triggers:** backup, restore, disaster recovery, data loss, snapshot, recovery point, retention, export database, point-in-time
**Applies when:** the app holds data the owner would be harmed by losing.
**Composes:** BE-DATA-02, BE-OPS-03, BE-OPS-06, BE-OPS-07

**Required**
- R1 The database is backed up automatically on a schedule (at least daily), with a stated retention (default 30 days).
- R2 Uploaded files are protected too: versioning, replication or backups covering them (BE-FILE-02).
- R3 Backups are encrypted and stored separately from the live data, with access limited to named people and kept off the app's own credentials.
- R4 A restore has been rehearsed into a separate environment, with the time taken recorded; it is repeated on a schedule (at least quarterly) and after any major change.
- R5 A written runbook says how to restore, who may, how long it should take, and how much data loss is acceptable (the recovery point and recovery time goals).
- R6 A failed or missing backup raises an alert to the owner (BE-OPS-03).

**Conditional**
- C1 IF backups contain personal data THEN they are covered by the retention and erasure statements in BE-OPS-06.
- C2 IF the data changes continuously or losing a day is unacceptable THEN enable continuous or point-in-time backup.
- C3 IF a hosting provider manages backups THEN confirm in writing what they cover and for how long, and still rehearse a restore.

**Suggest**
- S1 A second copy in another provider or location — survives the loss of one account or site.
- S2 A downloadable full export for the owner — gives peace of mind and an exit route.

**Approval**
- A1 Storing backups in another region or country (data transfer rules and cost).
- A2 Restoring over the live data (irreversible; overwrites recent changes).
- A3 Paid backup storage or services.

**Frontend contract**
- None.

**Acceptance**
- [ ] Given the backup schedule, when the latest backup record is read, then it is no older than the schedule interval.
- [ ] Given the latest backup, when it is restored to a clean environment, then the app starts and the row counts match within the stated data-loss goal.
- [ ] Given a backup job that fails, when it fails, then an alert reaches the owner.
- [ ] Given the runbook, when someone who did not write it follows it, then the restore completes.

**Exceptions**
- Disposable demo or cache data needs no backup; say so in the coverage sheet.

**Source:** OWASP ASVS 4.0.3 V8 Data Protection (standard); 3-2-1 backup rule and tested restores (convention); recovery point and time goals (convention)

## BE-DATA-06 · Seed and demo data

**Purpose:** Give new developers, tests and demos realistic starting data without ever mixing it with real people's data.
**Triggers:** seed, demo data, sample data, fixtures, test data, dummy data, initial data, default roles, bootstrap, first admin
**Applies when:** the app needs reference data to work, or demo and test environments need example content.
**Composes:** BE-DATA-02, BE-OPS-07, BE-OPS-01

**Required**
- R1 Reference data the app needs in every environment (roles, categories, settings defaults) is created by migration or an idempotent seed that can be re-run safely.
- R2 Demo and sample data is clearly fake, uses reserved example domains for emails, and contains no real personal data.
- R3 Demo seeding refuses to run in production unless the owner explicitly confirms it.
- R4 No default passwords or test accounts exist in production; the first administrator is created by a one-time set-up step with a secret supplied at deploy time (CORE F12).
- R5 A single command resets a non-production environment to its known demo state.
- R6 Production data is never copied to development or testing unless it is anonymised first.

**Conditional**
- C1 IF the app has a try-it-out mode for visitors THEN keep demo data in a separate area with rate limits and no connection to real accounts.
- C2 IF screenshots or tutorials need data THEN use the demo seed, not live content.

**Suggest**
- S1 A rich demo data set covering empty, full and edge states — makes every screen state quick to review.
- S2 Seeded data marked with a "demo" label — nobody mistakes it for real.

**Approval**
- A1 Seeding or resetting data in production.
- A2 Copying real customer data into any other environment.

**Frontend contract**
- None.

**Acceptance**
- [ ] Given the seed run twice, when records are counted, then there are no duplicates.
- [ ] Given a production environment, when the demo seed is run without explicit confirmation, then it refuses.
- [ ] Given a production database, when accounts are listed, then none uses a documented default credential.
- [ ] Given demo users, when their emails are inspected, then all use reserved example domains.

**Exceptions**
- Apps with no reference data and no demo needs can skip this entry.

**Source:** OWASP ASVS 4.0.3 V14 Configuration (standard); reserved example domains in RFC 2606 (standard); idempotent seed scripts (convention)

## BE-DATA-07 · Text search

**Purpose:** Let people find what they are looking for quickly, in only the data they are allowed to see.
**Triggers:** search, find, full text, keyword, typeahead, autocomplete, search index, relevance, fuzzy, filter by text
**Applies when:** users search records by typing words.
**Composes:** BE-API-04, BE-AUTH-05, BE-API-03, FE-COLL-03

**Required**
- R1 Search queries are parameterised and validated; wildcard characters typed by the user are escaped (CORE F15, CORE F10).
- R2 Results are limited to records the caller may see, applied inside the search itself, not after paging (CORE F11, BE-AUTH-05).
- R3 Search uses an index for the searched fields so it stays fast as data grows; a plain scan of a large table is not accepted.
- R4 Matching ignores case and accents, handles several words (all words by default), and orders by relevance then a stable tie-breaker.
- R5 Results are paginated with a maximum page size and follow the list rules in BE-API-04; deleted records are excluded (BE-DATA-03).
- R6 An empty or very short query (default under 2 characters) is handled explicitly: return the default list or a clear 422, never the whole table.
- R7 Search is rate limited per user (BE-OPS-04), since it is expensive.

**Conditional**
- C1 IF typeahead is offered THEN return at most 10 results in a lighter response and cancel superseded requests on the client.
- C2 IF the index is separate from the main database THEN update it from a job and make deletes and permission changes reach it promptly (BE-JOB-01).
- C3 IF users misspell often THEN allow typo-tolerant matching.

**Suggest**
- S1 Highlight the matched words in results — people see why each result matched.
- S2 "Did you mean" suggestions for no-result searches — fewer dead ends.

**Approval**
- A1 Using an outside search service (cost, and your data is sent to a third party).
- A2 Searching inside uploaded files' contents (more private data indexed).

**Frontend contract**
- The search box sends the typed text after a short pause and shows loading, results, empty ("No results for ...") and error states (FE-COLL-03).
- The screen keeps the query in the address so a search can be shared and reloaded.

**Acceptance**
- [ ] Given the query `100%`, when searched, then it matches the literal text and does not act as a wildcard.
- [ ] Given a record owned by another user that matches, when searched, then it is not in the results or the count.
- [ ] Given a search for `cafe`, when a record contains `Café`, then it is found.
- [ ] Given a one-character query, when sent, then the response follows the stated rule and does not return the whole table.

**Exceptions**
- Short lists (under about 50 items) can be filtered on the client; the permission rule still applies on the server.

**Source:** OWASP ASVS 4.0.3 V5 Validation (standard); OWASP SQL Injection Prevention Cheat Sheet (standard); full-text index and relevance ordering (convention)
