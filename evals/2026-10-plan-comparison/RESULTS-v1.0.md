# Plan comparison results

| # | Convention | A | B-strict | B-resolved | Evidence |
|---|---|---:|---:|---:|---|
| 1 | Lists show a loading state (not a blank area) | 1 | 1 | 1 | A: "skeleton loaders"; B: "loading (skeleton rows)"; Resolved: CORE F4 |
| 2 | "Nothing yet" empty state is distinct from "no results for this search/filter" | 1 | 1 | 1 | A: "first-time... no results"; B: "empty vs no-results"; Resolved: CORE F4 |
| 3 | Load or save errors show a plain message with retry, and keep user input | 0 | 0 | 1 | A: no keep-input commitment; B: no keep-input text; Resolved: CORE F4; FE-FORM-02 R5 |
| 4 | Only one audio preview plays at a time; starting another pauses the first | 1 | 1 | 1 | A: "Only one recording plays"; B: "one at a time"; Resolved: FE-MEDIA-01 R1 |
| 5 | No audio autoplays | 0 | 0 | 1 | A: click-to-play only; B: not stated; Resolved: CORE F7; FE-MEDIA-01 R1 |
| 6 | List and player are fully keyboard operable | 1 | 1 | 1 | A: "Space bar toggles play"; B: "keyboard or touch"; Resolved: CORE F1; FE-MEDIA-02 R1 |
| 7 | Select-all has a mixed (indeterminate) state when some items are selected | 0 | 0 | 0 | A: no mixed state; B: "No bulk actions"; Resolved: FE-SEL-01 excluded |
| 8 | A bulk action reports which items failed | 0 | 0 | 0 | A: bulk failures absent; B: "No bulk actions"; Resolved: BE-API-05 excluded |
| 9 | Delete asks for confirmation or offers undo | 1 | 1 | 1 | A: "delete (with confirmation)"; B: "confirmation... Undo message"; Resolved: FE-FEED-02 R1 |
| 10 | Deleted items are recoverable for a period (bin / soft delete) | 1 | 1 | 1 | A: "Trash... 30 days"; B: "30 days"; Resolved: BE-DATA-03 R5 |
| 11 | Upload shows progress | 1 | 1 | 1 | A: "progress bar"; B: "progress per file"; Resolved: FE-FORM-04 R3 |
| 12 | Upload can be cancelled or retried | 1 | 1 | 1 | A: "cancel/retry per file"; B: "DELETE /uploads"; Resolved: FE-FEED-04 R5/R6 |
| 13 | Server validates file type by content, not only by extension | 1 | 1 | 1 | A: "detect by content"; B: "content sniffing"; Resolved: BE-FILE-01 R2 |
| 14 | Maximum file size is stated to the user before upload | 0 | 0 | 1 | A: rejected after choosing; B: limit only internal; Resolved: FE-FORM-04 R2 |
| 15 | Files are private by default; access uses short-lived signed links | 1 | 1 | 1 | A: "short-lived signed URLs"; B: "short-lived signed address"; Resolved: BE-FILE-02 R1/R2 |
| 16 | Every request checks permission on the specific record, not only sign-in | 1 | 1 | 1 | A: "against the resource owner"; B: "names its own rule"; Resolved: CORE F11 |
| 17 | Sharing uses invitations with a role (view vs edit) and can be revoked | 1 | 1 | 1 | A: "invited accounts for Collaborators"; B: "access: \"view\""; Resolved: BE-AUTH-06 R1/R4/R5 |
| 18 | Search, filter and sort state is kept in the URL | 0 | 1 | 1 | A: API query only; B: "shareable address"; Resolved: FE-COLL-03 R2; FE-COLL-04 R2 |
| 19 | Lists are paginated on the server | 1 | 1 | 1 | A: "cursor paging"; B: "cursor=&page_size"; Resolved: CORE D3; BE-API-04 R1 |
| 20 | Password reset does not reveal whether an account exists | 1 | 1 | 1 | A: "If that address is registered"; B: "always 202"; Resolved: BE-AUTH-04 R4 |
| 21 | Sessions use secure cookie settings, and the user can sign out everywhere | 1 | 0 | 1 | A: "HttpOnly, Secure, SameSite=Lax"; B: cookies, not secure flags; Resolved: BE-AUTH-02 R1/R5 |
| 22 | Sign-in attempts are rate limited | 1 | 1 | 1 | A: "Login rate limiting"; B: "rate limited"; Resolved: BE-OPS-04 R2 |
| 23 | All input is validated on the server | 1 | 1 | 1 | A: "All inputs validated"; B: "server validation"; Resolved: CORE F10 |
| 24 | API errors use one consistent format that includes a request id | 1 | 1 | 1 | A: "request_id"; B: "problem+json errors with request_id"; Resolved: BE-API-02 R1/R4 |
| 25 | Audio processing (waveform, transcode) runs in the background with visible status | 1 | 1 | 1 | A: "enqueues the processing job"; B: "processing status"; Resolved: BE-FILE-03 R1/C3 |
| 26 | Location or other sensitive metadata in uploads is stripped or handled deliberately | 0 | 1 | 1 | A: stores embedded metadata; B: "location tags removed"; Resolved: BE-FILE-03 R2; S3 contract |
| 27 | The user can export their data and delete their account | 1 | 1 | 1 | A: "Export metadata"; B: "delete my account"; Resolved: BE-OPS-06 R1/R4 |
| 28 | Backups exist and restore is tested | 1 | 1 | 1 | A: "restore tested quarterly"; B: "rehearsed restore"; Resolved: BE-DATA-05 R1/R4 |
| 29 | Leaving a form with unsaved changes warns the user | 0 | 0 | 1 | A: upload warning only; B: not stated; Resolved: CORE F8; FE-FORM-05 R1 |
| 30 | Icon-only buttons have accessible names; inputs have visible labels | 0 | 0 | 1 | A: WCAG generic only; B: not stated; Resolved: CORE F2; FE-FORM-01 R1 |

## Totals

- A: 21 / 30
- B-strict: 22 / 30
- B-resolved: 28 / 30

## Grader notes

- Item 17 was counted for A and B because both commit to invited sharing with an explicit viewer/collaborator access level and revocation. Neither plan commits to an edit-sharing role, but the checklist wording was read as requiring an explicit share access role, not necessarily both role variants.
- Items 7 and 8 remain zero for Plan B-resolved because COVERAGE.md explicitly excludes multi-select and bulk actions, even though the catalogue contains entries that would satisfy them if cast.
- Item 21 is zero for B-strict because COVERAGE.md says server-side cookies and sign-out endpoints, but does not state secure cookie attributes until BE-AUTH-02 is resolved.
- Item 26 is zero for A because it stores embedded metadata and coordinates, and does not commit to stripping or deliberate handling of upload metadata comparable to Plan B's location-tag removal.
- Generic accessibility or error-handling language was not counted for items requiring specific parts unless the plan or resolved catalogue named those parts.
