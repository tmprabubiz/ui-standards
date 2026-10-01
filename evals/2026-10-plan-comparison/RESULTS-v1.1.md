# Plan comparison results v1.1

| # | Convention | A | B-strict | B-resolved | Evidence |
|---|---|---:|---:|---:|---|
| 1 | Lists show a loading state (not a blank area) | 1 | 1 | 1 | A: "skeleton loaders"; B: "loading (skeleton rows)"; R: CORE F4 Loading, FE-COLL-02 R3 |
| 2 | "Nothing yet" empty state is distinct from "no results for this search/filter" | 1 | 1 | 1 | A: "first-time... no results"; B: "empty... vs no results"; R: CORE F4 Empty, FE-COLL-03 R5 |
| 3 | Load or save errors show a plain message with retry, and keep user input | 0 | 0 | 1 | A: absent; B: "error with Retry" misses kept input; R: CORE F4 Error |
| 4 | Only one audio preview plays at a time; starting another pauses the first | 1 | 1 | 1 | A: "Only one recording plays"; B: "one at a time"; R: FE-MEDIA-01 R1 |
| 5 | No audio autoplays | 0 | 0 | 1 | A: absent; B: absent; R: FE-MEDIA-01 R1, CORE F7 |
| 6 | List and player are fully keyboard operable | 1 | 0 | 1 | A: "Full keyboard operation"; B: absent; R: CORE F1, FE-MEDIA-02 R1 |
| 7 | Select-all has a mixed (indeterminate) state when some items are selected | 0 | 0 | 1 | A: absent; B: absent; R: FE-SEL-01 R2 |
| 8 | A bulk action reports which items failed | 0 | 1 | 1 | A: absent; B: "seeing exactly which ones failed"; R: FE-SEL-01 R6, BE-API-05 R2 |
| 9 | Delete asks for confirmation or offers undo | 1 | 1 | 1 | A: "delete (with confirmation)"; B: "confirm dialog, undo message"; R: FE-FEED-02 R1 |
| 10 | Deleted items are recoverable for a period (bin / soft delete) | 1 | 1 | 1 | A: "stay 30 days"; B: "30 days and restores"; R: BE-DATA-03 R5 |
| 11 | Upload shows progress | 1 | 1 | 1 | A: "progress bar"; B: "progress, cancel, retry"; R: FE-FORM-04 R3 |
| 12 | Upload can be cancelled or retried | 1 | 1 | 1 | A: "pause/resume/cancel/retry"; B: "progress, cancel, retry"; R: FE-FORM-04 R3 |
| 13 | Server validates file type by content, not only by extension | 1 | 0 | 1 | A: "detect by content"; B: absent; R: BE-FILE-01 R2 |
| 14 | Maximum file size is stated to the user before upload | 0 | 0 | 1 | A: absent; B: absent; R: FE-FORM-04 R2 |
| 15 | Files are private by default; access uses short-lived signed links | 1 | 1 | 1 | A: "Bucket is private"; B: "files are private"; R: BE-FILE-02 R1-R2 |
| 16 | Every request checks permission on the specific record, not only sign-in | 1 | 1 | 1 | A: "Authorization is checked on every request"; B: "object-level check"; R: CORE F11 |
| 17 | Sharing uses invitations with a role (view vs edit) and can be revoked | 0 | 0 | 0 | A: "view only"; B: "view-only share"; R: not resolved; edit role absent |
| 18 | Search, filter and sort state is kept in the URL | 0 | 0 | 1 | A: absent; B: absent; R: FE-COLL-04 R2, FE-COLL-03 R2 |
| 19 | Lists are paginated on the server | 1 | 1 | 1 | A: "cursor paging"; B: "cursor&page_size"; R: BE-API-04 R1 |
| 20 | Password reset does not reveal whether an account exists | 1 | 1 | 1 | A: "avoid revealing which emails"; B: "without revealing which emails"; R: FE-ACCT-03 R1 |
| 21 | Sessions use secure cookie settings, and the user can sign out everywhere | 1 | 0 | 1 | A: "HttpOnly, Secure, SameSite=Lax"; B: absent; R: BE-AUTH-02 R1, R5 |
| 22 | Sign-in attempts are rate limited | 1 | 1 | 1 | A: "Login rate limiting"; B: "public and rate limited"; R: BE-OPS-04 R2 |
| 23 | All input is validated on the server | 1 | 1 | 1 | A: "All inputs validated"; B: "validation... for all later endpoints"; R: CORE F10 |
| 24 | API errors use one consistent format that includes a request id | 1 | 1 | 1 | A: "request_id"; B: "stable code and request id"; R: BE-API-02 R1, R4 |
| 25 | Audio processing (waveform, transcode) runs in the background with visible status | 1 | 1 | 1 | A: "enqueues the processing job"; B: "Processing status"; R: BE-FILE-03 R1, C3 |
| 26 | Location or other sensitive metadata in uploads is stripped or handled deliberately | 0 | 0 | 0 | A: stores embedded metadata; B: Q12 handles voices, not metadata; R: BE-FILE-03 R2 image-only/excluded |
| 27 | The user can export their data and delete their account | 1 | 0 | 0 | A: "delete account"; B: "erasure ships switched off"; R: approval/off, not counted |
| 28 | Backups exist and restore is tested | 1 | 0 | 1 | A: "restore tested quarterly"; B: "restore runbook"; R: BE-DATA-05 R4 |
| 29 | Leaving a form with unsaved changes warns the user | 0 | 0 | 1 | A: absent; B: absent; R: FE-FORM-05 R1, CORE F8 |
| 30 | Icon-only buttons have accessible names; inputs have visible labels | 0 | 0 | 1 | A: "ARIA roles" insufficient; B: absent; R: CORE F2, FE-FORM-01 R1 |

## Totals

- Plan A: 20 / 30
- Plan B strict: 16 / 30
- Plan B resolved: 27 / 30

## Grader notes

- I treated catalogue item ids in `COVERAGE.md` as insufficient for B-strict unless the needed behaviour was also written in the coverage text itself.
- I did not count Plan B item 27 because `COVERAGE.md` says account erasure ships switched off until approved.
- I did not count item 17 for either plan because both plans make the editor view-only and do not commit to view/edit sharing roles.
- I did not count item 26 for Plan B resolved because the built media-metadata stripping requirement is image-specific and this audio app excludes photos.
- Generic error, accessibility or validation language did not satisfy a checklist item when a required subpart was missing.
