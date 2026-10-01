# BE-API · API contract

How the server talks to screens: resource shape, errors, validation, lists, retries and change handling. Load for any app that has a server API, and always with the screen entry that calls it.

## BE-API-01 · Resource API contract

**Purpose:** Give every screen one predictable way to read and change things, so screens and server never disagree about names, codes or shapes.
**Triggers:** api, endpoint, REST, route, JSON, status code, create, read, update, delete, resource, response format, OpenAPI
**Applies when:** the app has a server that screens or other programs call over HTTP.
**Composes:** BE-API-02, BE-API-03, BE-API-04, FE-SHELL-06, FE-ACCT-02

**Required**
- R1 Resources are plural nouns in the path (`/recordings`, `/recordings/{id}`); verbs only for actions that are not create/read/update/delete (`/recordings/{id}/publish`).
- R2 Methods keep their RFC 9110 meaning: GET and HEAD never change data; PUT and DELETE are repeatable with the same result; POST creates or triggers an action.
- R3 Status codes are exact: 200 read or update, 201 create with a `Location` header, 204 no body, 400 malformed, 401 not signed in, 403 signed in but not allowed, 404 not found, 409 conflict, 422 valid format but rejected by a rule, 5xx only for server faults.
- R4 One JSON shape everywhere: a single record is an object, a list is `{ "data": [...], "page": {...} }`; one naming style for fields; ids are strings; timestamps are ISO 8601 in UTC with `Z` (CORE D1).
- R5 Responses use an explicit allow-list of fields per resource; password hashes, internal flags and other users' private fields are never serialised.
- R6 Every endpoint names its permission rule and enforces it on the specific record (CORE F11); a record the caller may not see returns 404, not 403, unless its existence is already public.

**Conditional**
- C1 IF an action takes longer than a few seconds THEN return 202 with a status resource the screen can poll (see BE-JOB-01).
- C2 IF a resource is owned by another resource THEN nest at most one level (`/projects/{id}/tasks`) and make the child reachable by its own id.
- C3 IF the API is used by programs other than the app's own screens THEN publish an OpenAPI description kept in the repository.

**Suggest**
- S1 Machine-readable API description generated from the code — saves integration mistakes and gives a free interactive test page.
- S2 Partial updates with PATCH — avoids a screen overwriting fields it never showed.
- S3 Field selection (`?fields=`) for heavy resources — makes list screens load faster on mobile.

**Approval**
- A1 Opening any endpoint to the public internet without sign-in.
- A2 Letting other companies' programs call the API (extra security and support work).

**Frontend contract**
- Screens read the `data` envelope and ignore unknown fields so the server can add fields safely.
- 401 sends the user to sign-in and returns them afterwards (FE-ACCT-02); 403 shows the no-permission state; 404 shows the not-found page (FE-SHELL-06).
- Screens never build business rules from status text; they branch on status code and error code (BE-API-02).

**Acceptance**
- [ ] Given a signed-in user, when they POST a valid new record, then the response is 201 with a `Location` header and the record in the shared shape.
- [ ] Given a user who does not own record X, when they GET it, then the response is 404 and contains no data from X.
- [ ] Given any resource response, when its fields are listed, then none is outside that resource's allow-list and no timestamp lacks a UTC designator.
- [ ] Given a GET request, when it is repeated 10 times, then stored data is unchanged.

**Exceptions**
- A tiny single-user app with no separate client may use server-rendered forms instead of a JSON API; R6 and the permission checks still apply.

**Source:** RFC 9110 HTTP Semantics (standard); OWASP API Security Top 10 on object-level and property-level authorization (standard); JSON envelope and 404-for-forbidden (convention)

## BE-API-02 · Error format

**Purpose:** Make every failure tell the screen exactly what went wrong in a form it can show, without leaking internals.
**Triggers:** error response, problem details, error code, validation error, 400, 500, failed request, error message, request id, field error
**Applies when:** the app has any server endpoint that can fail.
**Composes:** BE-API-01, BE-API-03, BE-OPS-02, FE-FORM-02, FE-FEED-01

**Required**
- R1 All errors use the RFC 9457 problem details shape with media type `application/problem+json`: `type`, `title`, `status`, `detail`, `instance`.
- R2 Each error adds a stable machine `code` (e.g. `recording_not_found`) that never changes meaning once released; screens branch on `code`, not on text.
- R3 `detail` is a safe human sentence; stack traces, SQL, file paths and server names stay in logs only (CORE F14).
- R4 Every error carries the request id, in the body as `request_id` and in a response header, matching the log line (CORE D7).
- R5 Validation failures return 422 (or 400 for unparseable input) with an `errors` list: `{ "field": "email", "code": "invalid_email", "message": "..." }` per field, using the field names the screen uses.
- R6 Unexpected faults return 500 with the generic code `internal_error`; never echo the raw exception.

**Conditional**
- C1 IF the cause is rate limiting THEN return 429 with `Retry-After` (see BE-OPS-04).
- C2 IF sign-in fails THEN the error is identical for unknown account and wrong password (see BE-AUTH-01).
- C3 IF the app supports several languages THEN `code` and `field` stay language-neutral and the screen supplies the translated text.

**Suggest**
- S1 A public list of error codes with plain-language meanings — helps support and future developers fix problems faster.
- S2 A `retryable` flag on each error — lets the screen offer "Try again" only when it can help.

**Approval**
- A1 Sending error details to an outside error-tracking service (data leaves your system and may be a paid service).

**Frontend contract**
- Field errors map onto the matching form fields (FE-FORM-02); non-field errors appear as a message (FE-FEED-01).
- The screen shows the `request_id` in error details so the owner can quote it to support.
- Unknown `code` values fall back to a generic message using `status`.

**Acceptance**
- [ ] Given a request with two invalid fields, when it is sent, then the response is 422 `application/problem+json` with two entries in `errors`, each naming its field.
- [ ] Given a server fault, when the response is read, then it contains `internal_error`, a `request_id`, and no stack trace or SQL text.
- [ ] Given an error response, when its `request_id` is searched in server logs, then exactly the matching request is found.
- [ ] Given a missing record, when it is requested, then the 404 body has a stable `code` and the same shape as every other error.

**Exceptions**
- Authentication challenge responses may add the `WWW-Authenticate` header required by RFC 9110; the body still follows this entry.

**Source:** RFC 9457 Problem Details for HTTP APIs (standard); OWASP Error Handling Cheat Sheet (standard); stable `code` field and `errors` list (convention)

## BE-API-03 · Input validation

**Purpose:** Refuse bad or hostile input at the door so the stored data stays clean and the app stays safe.
**Triggers:** validation, schema, sanitise, required field, max length, unknown fields, mass assignment, trim, normalise, bad input, injection
**Applies when:** an endpoint accepts a body, query string, path parameter or header from outside.
**Composes:** BE-API-02, FE-FORM-02, FE-FORM-01

**Required**
- R1 Each endpoint validates body, query and path against a declared schema (type, required, format, min and max) before any other work (CORE F10).
- R2 Every string, list and number has a maximum; request bodies have a maximum size that is enforced before parsing (default 1 MB unless a file endpoint says otherwise).
- R3 Unknown fields are rejected with a field error, or ignored by an explicit allow-list; client input can never set `id`, `owner_id`, `role`, `created_at` or other server-controlled fields (mass assignment).
- R4 Values are normalised once on the server: trimmed, Unicode normalised (NFC), emails lower-cased, enums matched exactly.
- R5 Validation covers rules between fields and against stored data (end after start, unique name per owner), not only formats.
- R6 Validation rules shared with the screen are documented once so both sides agree on limits (FE-FORM-02).

**Conditional**
- C1 IF a field accepts rich text or HTML THEN sanitise it with an allow-list sanitiser on the server before storing or rendering.
- C2 IF a field is a URL THEN allow only `https` (and `http` where required) and reject private-network addresses when the server will fetch it.
- C3 IF a field is free text shown to other users THEN store it as text and encode on output.

**Suggest**
- S1 Reject unknown query parameters too — catches client typos before they become silent bugs.
- S2 Share the validation schema between server and screen — keeps the two from drifting apart.

**Approval**
- A1 Accepting rich HTML or scripts from users (needs a security review).

**Frontend contract**
- Screens show the server's field messages next to the matching fields and keep what the user typed (CORE F8).
- Screen limits (max length) match the server limits; the server limit wins.

**Acceptance**
- [ ] Given a body with an unknown field `role`, when it is posted to create a user profile, then the response is 422 naming `role` and nothing is stored.
- [ ] Given a 5 MB body to a JSON endpoint with a 1 MB limit, when it is sent, then it is refused with 413 before parsing.
- [ ] Given an email `  Ann@Example.COM `, when it is saved, then it is stored as `ann@example.com`.
- [ ] Given a name 10 000 characters long, when it is posted, then the response is 422 with `max_length` for that field.

**Exceptions**
- Webhook receivers (see BE-JOB-06) validate the signature first, then the payload against the provider's documented schema, tolerating extra fields.

**Source:** OWASP ASVS 4.0.3 V5 Validation, Sanitization and Encoding (standard); OWASP Input Validation and Mass Assignment Cheat Sheets (standard); server-set fields rule (convention)

## BE-API-04 · Pagination, filtering and sorting

**Purpose:** Let lists of any size load quickly and predictably, with only the fields the screen may filter or sort by.
**Triggers:** pagination, page size, cursor, offset, next page, total count, filter, sort order, order by, infinite scroll, list endpoint
**Applies when:** an endpoint returns a list that could exceed 50 items (CORE D3).
**Composes:** BE-API-01, BE-DATA-01, BE-DATA-07, FE-COLL-05, FE-COLL-04

**Required**
- R1 Every list endpoint is paginated with a server default page size (e.g. 25) and a hard maximum (e.g. 100); requests above the maximum are clamped or rejected, never honoured.
- R2 The response returns what the screen needs to continue: `next_cursor` (or `next_page`), `has_more`, and the page size actually used.
- R3 Sorting always ends with a unique tiebreaker (the id), so the same item never appears on two pages or is skipped.
- R4 Sort and filter fields come from an allow-list per endpoint; anything else is a 422 naming the allowed fields (never passed into a query).
- R5 Lists are filtered by the caller's permissions before paging, so counts and pages never reveal records the caller cannot see (CORE F11).
- R6 Filters, sort and page parameters are plain query parameters, so any list state is a shareable URL.

**Conditional**
- C1 IF the data changes while people page through it, or can be large THEN use cursor (keyset) pagination; use offset pagination only for small, stable sets or when users must jump to page N.
- C2 IF the screen shows a total THEN return `total` as a separate, optional, possibly approximate value, and compute it only on request on large tables.
- C3 IF a filter column is not indexed on a large table THEN add the index (BE-DATA-01) or refuse that filter.

**Suggest**
- S1 Return the total only when `?include_total=true` — keeps big lists fast.
- S2 Saved filters per user — saves people from rebuilding the same view each visit.

**Approval**
- A1 Exports or lists that return every record at once (can overload the server and expose many people's data).

**Frontend contract**
- Screens send the cursor or page value from the previous response unchanged and treat it as opaque.
- Screens reset to the first page when a filter or sort changes (FE-COLL-04, FE-COLL-05).
- Screens show the empty state differently for "nothing yet" and "no results for these filters" (CORE F4).

**Acceptance**
- [ ] Given 120 records and no page size, when the list is requested, then the default number is returned with `has_more` true.
- [ ] Given `page_size=10000`, when requested, then at most the maximum is returned (or a 422 explains the limit).
- [ ] Given `sort=password_hash`, when requested, then the response is 422 listing the allowed sort fields.
- [ ] Given records inserted while paging with a cursor, when all pages are read, then no record appears twice or is skipped.

**Exceptions**
- Short fixed lists (under 50 items, such as a country picker) may return everything unpaginated.

**Source:** OWASP API Security Top 10 on unrestricted resource consumption (standard); keyset pagination, opaque cursors, max page size (convention)

## BE-API-05 · Bulk operations with per-item results

**Purpose:** Let people act on many items at once and see exactly which ones worked and which did not.
**Triggers:** bulk, batch, mass action, select all, delete many, move many, import, multi-item, partial failure, per-item result
**Applies when:** one request changes more than one record, such as bulk delete, bulk edit or import.
**Composes:** BE-API-02, BE-API-06, BE-DATA-03, FE-SEL-01, FE-FEED-02

**Required**
- R1 One bulk endpoint accepts a list of ids (or ids plus changes), with a maximum count (e.g. 100) enforced with a 422 above it.
- R2 The response contains one result per input item in the same order: `{ "id", "ok", "error"? }`, where `error` uses the BE-API-02 shape; the overall request is 200 when it was processed, or 202 with a job id when it runs in the background.
- R3 Each item is permission-checked and validated on its own (CORE F10, CORE F11); one failing item never blocks or silently drops the rest.
- R4 Duplicate ids in one request are processed once and reported once.
- R5 The default policy is partial success (each item independent); all-or-nothing is used only when the endpoint says so and then returns one clear failure.
- R6 Destructive bulk actions follow the recovery rules in BE-DATA-03 so they can be undone.

**Conditional**
- C1 IF the batch is too large to finish within a normal request THEN accept it (202) and run it as a job with progress (see BE-JOB-01).
- C2 IF the action sends messages or charges money THEN require an idempotency key (see BE-API-06).
- C3 IF a CSV or file import is the source THEN report row numbers in the per-item errors.

**Suggest**
- S1 A "dry run" mode that reports what would happen — lets people check a big change before it happens.
- S2 A downloadable list of failed items — makes fixing a large import straightforward.

**Approval**
- A1 Bulk permanent delete with no recovery bin.
- A2 Bulk actions that send emails or messages to many people.

**Frontend contract**
- Screens show a summary ("8 done, 2 failed") and list the failed items with reasons (CORE F4 Partial state).
- Failed ids stay selected so the user can retry only those (FE-SEL-01).
- After a destructive bulk action the screen offers undo for the succeeded ids (FE-FEED-02).

**Acceptance**
- [ ] Given 10 ids where 2 belong to another user, when bulk-deleted, then 8 results are ok and 2 are not, with a permission error each, and the 2 records are untouched.
- [ ] Given 101 ids with a maximum of 100, when sent, then the response is 422 and nothing changes.
- [ ] Given the same id twice, when sent, then it is changed once and appears once in the results.
- [ ] Given a bulk soft delete, when the ids are restored, then all succeeded records return.

**Exceptions**
- Single-record endpoints need no bulk variant; do not add one unless a screen selects several items.

**Source:** RFC 9110 status semantics for 200, 202 and 422 (standard); per-item result envelope (convention); partial-success default (proposal)

## BE-API-06 · Idempotency and safe retries

**Purpose:** Make sure a double click, a slow network or an automatic retry never creates a second order, charge or message.
**Triggers:** idempotency key, duplicate submit, retry, double charge, payment, create order, safe retry, timeout, resubmit
**Applies when:** a POST (or other non-repeatable request) creates something or has an external effect, especially payment-like actions, or when clients may retry.
**Composes:** BE-API-01, BE-API-02, BE-JOB-01, FE-FEED-04

**Required**
- R1 Create and payment-like POST endpoints accept an `Idempotency-Key` header (a client-generated unique value) and require it where a duplicate would cost money or send messages.
- R2 The server stores the key with the caller, a fingerprint of the request, and the final response; a repeat with the same key and same request returns the stored response without redoing the work.
- R3 The same key with a different request body returns 422 with code `idempotency_key_reused`.
- R4 A repeat that arrives while the first is still running returns 409 with `Retry-After`, never a second execution.
- R5 Keys are scoped per caller and expire after a stated period (default 24 hours); expiry is documented.
- R6 PUT, DELETE and GET stay naturally repeatable (RFC 9110); deleting an already-deleted record returns the same success.

**Conditional**
- C1 IF the server calls an outside provider for the action THEN pass a derived idempotency key to that provider so a retry cannot double-act there either.
- C2 IF the action is processed by a background job THEN the job handler is itself idempotent (see BE-JOB-01).
- C3 IF no key is sent on an endpoint where it is optional THEN behave as a normal request and document the duplicate risk.

**Suggest**
- S1 Also block identical repeats within a few seconds on non-payment creates — stops accidental double records from impatient clicking.

**Approval**
- A1 Taking payments or any action that moves money (always use a payment provider; never store card numbers).

**Frontend contract**
- The screen generates one key per user intent (when the form opens or the button is first pressed) and reuses it on every retry of that attempt; a new intent gets a new key.
- The screen disables the control while busy (CORE F6) and on a timeout retries with the same key.

**Acceptance**
- [ ] Given two identical POSTs with the same key, when both complete, then one record exists and both responses are identical.
- [ ] Given the same key with a different body, when sent, then the response is 422 `idempotency_key_reused` and nothing new is created.
- [ ] Given a first request still running, when a second with the same key arrives, then it returns 409 and the work runs once.
- [ ] Given a DELETE on an already-deleted record, when repeated, then it returns the same success result.

**Exceptions**
- Not needed for harmless idempotent updates (a PUT that sets the same value) or read-only endpoints.

**Source:** RFC 9110 on idempotent methods (standard); Idempotency-Key header as used by payment APIs and the IETF httpapi working-group draft (convention)

## BE-API-07 · Concurrent edits

**Purpose:** Stop two people (or two tabs) silently overwriting each other's changes.
**Triggers:** concurrent edit, conflict, overwrite, lost update, ETag, If-Match, version, optimistic locking, 409, 412, stale data
**Applies when:** the same record can be edited by more than one person, device or tab.
**Composes:** BE-API-01, BE-API-02, FE-FORM-05, FE-FEED-01

**Required**
- R1 Every editable resource exposes a version (an `ETag` header and/or a `version` field) that changes with every write.
- R2 Update requests (PUT, PATCH, DELETE) send that version back in `If-Match` or the body; the server compares it before writing.
- R3 A stale version is rejected with 412 Precondition Failed (header form) or 409 Conflict (body form), code `edit_conflict`, and the response includes the current version.
- R4 The compare and the write happen atomically (one conditional update), so two simultaneous writes cannot both win.
- R5 Endpoints where the version is mandatory return 428 Precondition Required when it is missing.
- R6 Resolution is never silent: the server never merges or overwrites without the caller seeing the conflict.

**Conditional**
- C1 IF changes are to different fields of the same record THEN PATCH with per-field merging is allowed, provided the version check still applies to fields both sides touched.
- C2 IF live co-editing of text is a requirement THEN use a dedicated collaboration approach (outside this entry) and say so in the coverage sheet.

**Suggest**
- S1 Return who last changed the record and when in the conflict response — helps people decide whose version to keep.
- S2 Soft "being edited by Ann" hints — reduces conflicts before they happen.

**Approval**
- A1 Choosing "last write wins" for data people care about (it can silently lose their work).

**Frontend contract**
- Screens hold the version from the last load and send it with each save (FE-FORM-05 autosave included).
- On a conflict the screen keeps the user's unsaved input and offers "Reload theirs", "Keep mine" or a comparison (FE-FEED-01, CORE F8).

**Acceptance**
- [ ] Given two clients holding version 3, when both save, then one succeeds with version 4 and the other gets `edit_conflict` with the current version.
- [ ] Given an update without a version on an endpoint that requires it, when sent, then the response is 428.
- [ ] Given a conflict, when the loser's input is inspected on screen, then it is still present.
- [ ] Given a successful save, when the response is read, then it contains the new version.

**Exceptions**
- Append-only data (comments, log entries) and single-user personal data need no version check.

**Source:** RFC 9110 on ETag, If-Match and 412; RFC 6585 on 428 (standard); optimistic concurrency (convention)

## BE-API-08 · Versioning and deprecation

**Purpose:** Let the API change over time without breaking screens, mobile apps already installed, or outside programs.
**Triggers:** api version, v1, breaking change, deprecation, sunset, backward compatible, mobile app update, changelog
**Applies when:** an API is used by clients the owner cannot update instantly (installed mobile apps, other companies' programs), or will change after release.
**Composes:** BE-API-01, BE-API-02

**Required**
- R1 The API carries an explicit version (a path prefix such as `/v1`, or a header), chosen once for the whole app.
- R2 Within a version only compatible changes are made: add optional fields, add endpoints, add enum values the clients tolerate; removing, renaming or re-typing a field is a new version.
- R3 Clients are told to ignore unknown fields and unknown enum values; this is stated in the API description.
- R4 A retired endpoint or version is announced first with `Deprecation` and `Sunset` response headers and a changelog entry, with a stated end date.
- R5 Retired versions answer 410 Gone with a problem-details body pointing to the replacement.
- R6 Every release records which API version it changes in a changelog.

**Conditional**
- C1 IF an installed mobile app uses the API THEN keep each version available until its usage is below an agreed threshold, and expose a minimum supported app version the app can check.
- C2 IF only the app's own web screens use the API and they deploy together with it THEN a single version is enough and R4 applies only to outside callers.

**Suggest**
- S1 Log usage per API version — shows when an old version is safe to retire.
- S2 A compatibility test run against the previous version's contract — catches accidental breaking changes before release.

**Approval**
- A1 Removing or breaking an API version outside programs depend on.
- A2 Forcing users to update the mobile app.

**Frontend contract**
- Screens send their version (path or header) and handle 410 and a "please update" message (FE-SHELL-06).
- The app checks the minimum supported version at start where installed apps exist.

**Acceptance**
- [ ] Given a client on `v1`, when a new optional field is added to a response, then the client's existing flows still pass.
- [ ] Given a deprecated endpoint, when it is called, then the response has `Deprecation` and `Sunset` headers and still works until the date.
- [ ] Given a retired version, when it is called, then the response is 410 with a pointer to the replacement.

**Exceptions**
- A prototype or single-owner internal tool with no outside clients may skip R1 until its first outside client appears.

**Source:** RFC 9110 on 410; RFC 8594 Sunset header and RFC 9745 Deprecation header (standard); additive-only change policy (convention)
