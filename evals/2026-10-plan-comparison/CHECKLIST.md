# Checklist — fixed before either plan was produced

30 conventions that users of a "field recordings library" app would expect and that AI
plans commonly omit. Written 2026-10-01 before running either arm.

| # | Convention |
|---|---|
| 1 | Lists show a loading state (not a blank area) |
| 2 | "Nothing yet" empty state is distinct from "no results for this search/filter" |
| 3 | Load or save errors show a plain message with retry, and keep user input |
| 4 | Only one audio preview plays at a time; starting another pauses the first |
| 5 | No audio autoplays |
| 6 | List and player are fully keyboard operable |
| 7 | Select-all has a mixed (indeterminate) state when some items are selected |
| 8 | A bulk action reports which items failed |
| 9 | Delete asks for confirmation or offers undo |
| 10 | Deleted items are recoverable for a period (bin / soft delete) |
| 11 | Upload shows progress |
| 12 | Upload can be cancelled or retried |
| 13 | Server validates file type by content, not only by extension |
| 14 | Maximum file size is stated to the user before upload |
| 15 | Files are private by default; access uses short-lived signed links |
| 16 | Every request checks permission on the specific record, not only sign-in |
| 17 | Sharing uses invitations with a role (view vs edit) and can be revoked |
| 18 | Search, filter and sort state is kept in the URL |
| 19 | Lists are paginated on the server |
| 20 | Password reset does not reveal whether an account exists |
| 21 | Sessions use secure cookie settings, and the user can sign out everywhere |
| 22 | Sign-in attempts are rate limited |
| 23 | All input is validated on the server |
| 24 | API errors use one consistent format that includes a request id |
| 25 | Audio processing (waveform, transcode) runs in the background with visible status |
| 26 | Location or other sensitive metadata in uploads is stripped or handled deliberately |
| 27 | The user can export their data and delete their account |
| 28 | Backups exist and restore is tested |
| 29 | Leaving a form with unsaved changes warns the user |
| 30 | Icon-only buttons have accessible names; inputs have visible labels |
