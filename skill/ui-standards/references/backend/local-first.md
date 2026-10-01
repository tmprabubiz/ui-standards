# BE-LOCAL · Local-first persistence

Load for desktop or offline apps whose user data lives on the user's device rather than a hosted service.

## BE-LOCAL-01 · Local data persistence and recovery

**Purpose:** Keep a person's work safe on their device without inventing accounts or servers.
**Triggers:** local database, desktop storage, local-first, offline, one user, save locally, app data folder
**Applies when:** the app stores structured user data on one device.
**Composes:** BE-DATA-01, BE-DATA-02, BE-DATA-05

**Required**
- R1 Store app data in the operating system's per-user application-data location, not beside the executable or in a temporary folder.
- R2 Save changes transactionally; a crash during a save must leave either the previous complete data or the new complete data, not a partial write.
- R3 Create a recoverable backup before schema migrations and destructive maintenance; state where backups live and how long they remain.
- R4 Provide a user-visible export or backup action in a standard format where practical; never imply local data is backed up to the cloud.
- R5 Keep preferences separate from user-created project files so resetting preferences cannot delete the user's work.

**Conditional**
- C1 IF the app supports multiple OS accounts THEN keep their local data separated by OS account.
- C2 IF the data contains credentials or sensitive material THEN use the OS credential store or encryption at rest and explain the limitation.

**Suggest**
- S1 A visible "Open data folder" action — helps the owner find and back up local files.

**Approval**
- A1 Syncing local data to a cloud account — moves private files off the device.

**Frontend contract**
- Show the local save location and last-saved status; distinguish local backup from cloud sync.

**Acceptance**
- [ ] Given the app is installed, when it saves a new record, then the record is in the per-user data location and survives restart.
- [ ] Given a migration fails, when the app starts again, then the previous data remains available and the failure is explained.
- [ ] Given the owner exports a backup, when it completes, then the file can be found at the chosen location and is not described as cloud-backed.

**Exceptions**
- An app that stores no user data does not need a local database or export action.

**Source:** platform application-data guidance (convention); atomic persistence and migration backup (proposal)

## BE-LOCAL-02 · Safe local file handling

**Purpose:** Read and write only the files the owner selected, without path mistakes or accidental data loss.
**Triggers:** local files, path, folder, import, export, overwrite, file picker, filename, desktop storage
**Applies when:** the app reads or writes user-selected local files.
**Composes:** FE-DESK-02, BE-LOCAL-01

**Required**
- R1 Treat chosen paths as data, not trusted instructions; normalise paths and prevent traversal outside the selected destination where the workflow is restricted to a folder.
- R2 Write exports to a temporary file in the destination and atomically replace the final file when complete where the platform allows.
- R3 Never overwrite an existing user file without the UI's explicit confirmation (FE-DESK-02).
- R4 Preserve original input files; processing writes a separate output unless the owner explicitly chooses replacement.
- R5 Handle missing permissions, disk full and disconnected drives without deleting the last good copy.

**Conditional**
- C1 IF imported files may be untrusted THEN apply the upload/content checks in BE-FILE-01 where relevant.

**Suggest**
- S1 Remember the last used folder — saves repeated browsing.

**Approval**
- A1 Delete or modify source files as part of processing — the original may be impossible to recover.

**Frontend contract**
- Show selected source and destination before a batch operation; offer Browse again on path errors.

**Acceptance**
- [ ] Given an export is interrupted, when the destination is checked, then no incomplete file is presented as a finished export.
- [ ] Given a batch fails on one file, when the run completes, then other originals remain untouched and the failed item is named.
- [ ] Given a path is unavailable, when processing begins, then the app reports the problem and does not silently choose a different path.

**Exceptions**
- A pure in-memory tool does not need local file safety rules.

**Source:** filesystem permission and atomic replacement behaviour (convention); preserve-source default (proposal)

## BE-LOCAL-03 · Local task ledger

**Purpose:** Remember what a long task did, so a restart or retry does not quietly repeat paid or destructive work.
**Triggers:** local task history, paid call ledger, operation record, retry after restart, duplicate operation, task status
**Applies when:** the app has long-running, billable or restart-recoverable work.
**Composes:** FE-DESK-03, FE-COST-01

**Required**
- R1 Give every operation a stable id and persist intent before starting any external or destructive step.
- R2 Record pending, running, succeeded, failed, cancelled and outcome-unknown states with timestamps and safe error details.
- R3 A retry reuses the operation identity or first reconciles the provider result; it never silently creates a second billable operation.
- R4 Keep a local history of operation, input reference, status and known cost; never store API secrets in the ledger.

**Conditional**
- C1 IF work is resumable THEN persist a checkpoint and require the owner to resume or discard it after restart.
- C2 IF an operation spends money or credits THEN also apply BE-COST-01.

**Suggest**
- S1 Add a filter for failed and outcome-unknown operations — makes recovery work easier to find.

**Approval**
- A1 Keep sensitive input or full provider responses in task history — increases the data exposed if the device is shared.

**Frontend contract**
- Show status and cost in task history; offer Retry only after duplicate-charge safety is established.

**Acceptance**
- [ ] Given the app closes after dispatch, when it reopens, then the operation appears with its last known status.
- [ ] Given an operation's result is unknown, when Retry is considered, then provider status or idempotency is reconciled first.
- [ ] Given the task history is inspected, when secrets are searched, then no provider credential is present.

**Exceptions**
- A short, free, fully local task that cannot survive restart does not need a persistent ledger.

**Source:** idempotency (RFC 9333, standard); durable operation ledger (proposal)
