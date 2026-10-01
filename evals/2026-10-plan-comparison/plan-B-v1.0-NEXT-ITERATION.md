# Next iteration — Field Recordings Library

Things this app could do next. Nothing here has been built. Pick items and ask your
agent: "Build NEXT-ITERATION items 1, 3 and 4." Decisions are labelled D1–D20 (owner
decisions; unrelated to the CORE defaults D1–D7).

Effort: **S** small · **M** one feature slice · **L** several slices.

The owner was not available when this was planned, so every question is listed here instead
of being asked. Start with the decisions at the bottom: D1, D3, D5 and D7 change whether the
core story (upload big files, share with the editor) works at all.

## Safety and data (do these first)

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 1 | Sign in with a second step (authenticator app or passkey), or with a magic link | A stolen password alone could not open your library | M | BE-AUTH-01 S1, S3; FE-ACCT-01 S1; FE-ACCT-02 S1 |
| 2 | Scan every uploaded file for malware | Files you share with others are safer to open | M | BE-FILE-01 S1 |
| 3 | Email you when your password changes or a new device signs in | You notice a takeover at once | S | BE-AUTH-01 S4; BE-AUTH-02 S2 |
| 4 | Show where you are signed in, last used, and recent sign-ins, each with a Sign out button | Lets you cut off a lost phone | S | BE-AUTH-02 S1; FE-ACCT-04 S2 |
| 5 | Make reset pages work once and leave nothing in browser history | A shared computer cannot reuse a reset link | S | BE-AUTH-04 S2 |
| 6 | Automatic scan for accidentally exposed passwords or keys, plus a reminder to change long-lived keys | Catches a leak before anyone else does | S | BE-OPS-01 S1, S2 |
| 7 | Introduce the stricter browser security rules in trial mode first, with extra checks on outside files | Tighter protection without breaking pages | S | BE-OPS-05 S1, S2, S3 |
| 8 | Temporarily block addresses that keep misbehaving; a bot check only for suspicious visitors | Slows down persistent attackers | M | BE-OPS-04 S1, S2 |
| 9 | Keep a second copy of backups with another provider, and offer a one-click full download of everything | Survives losing one account or site | M | BE-DATA-05 S1, S2 |
| 10 | A weekly health note, and an alert if uploads quietly stop | You find out about silent breakage | S | BE-OPS-03 S1, S2 |
| 11 | Reminder before a deleted recording is removed for good | Avoids a surprise permanent loss | S | BE-DATA-03 S2 |
| 12 | A test that fails if any page or request lacks an access rule, and a plain page saying what each kind of access can do | Stops a forgotten check reaching the live app | S | BE-AUTH-05 S1, S2 |
| 13 | A "recent activity" page and alerts on risky events | Spot something unusual in your account | M | BE-DATA-04 S1, S2 |
| 14 | A page listing what the app stores about you; optional automatic deletion of inactive accounts | Builds trust and answers privacy requests | M | BE-OPS-06 S1, S2 |
| 15 | A page for processing problems with Retry or Discard; separate lanes for urgent and bulk work | You can fix a stuck recording without a developer | M | BE-JOB-01 S1, S2 |
| 16 | A page showing each scheduled clean-up, its last and next run, and a Run now button | You can see the app is healthy | S | BE-JOB-02 S1, S2 |
| 17 | Email you a reminder before an invitation to your editor expires | Fewer invitations lapse unnoticed (needs D5) | S | BE-AUTH-06 S3 |
| 18 | An event page for email delivery problems with Replay, and a daily check against the email provider | Recover from email outages without a developer (needs D5) | M | BE-JOB-06 S1, S2 |
| 19 | Show how much storage you have used | No surprise when the limit is reached | S | BE-FILE-01 S2 |

## Things users will notice every day

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 20 | A Download button for your own original recordings | You can always get the full-quality file back out | S | FE-MEDIA-02 S3 |
| 21 | Playback speed | Faster review of long interviews and ambiences | S | FE-MEDIA-01 S3; FE-MEDIA-02 S1 |
| 22 | A mini player that keeps playing while you browse | Listen to one recording while looking at others | M | FE-MEDIA-01 S1 |
| 23 | A waveform picture on each recording | Spot loud events and silence at a glance | M | BE-FILE-03 S2 |
| 24 | Saved views of search, filters and sort | One click to "ambiences from March" | M | FE-COLL-04 S1; BE-API-04 S2 |
| 25 | A count beside each filter option | See what a filter will return before applying it | S | FE-COLL-04 S2 |
| 26 | Recent searches, suggestions while typing, and a "/" key to jump to search | Faster finding on a long list | M | FE-COLL-03 S1, S2, S3 |
| 27 | "Did you mean…" when a search finds nothing | Fewer dead ends from spelling slips | M | BE-DATA-07 S2 |
| 28 | Recently used tags first; suggest existing tags while typing | Keeps tags consistent, no near-duplicates | S | FE-SEL-03 S1, S2 |
| 29 | Switch between list and grid; a compact view | Choose scanning or browsing | S | FE-COLL-02 S1, S2 |
| 30 | A Back to top button; choose page size | Less scrolling on a long library | S | FE-COLL-05 S1, S2 |
| 31 | Previous and Next recording; history of changes; print or export one recording's details | Quick review and a record of edits | M | FE-COLL-06 S1, S2, S3 |
| 32 | Version history for notes, and undo/redo in long text | Go back to an earlier wording | M | FE-FORM-05 S1, S2 |
| 33 | Time remaining on uploads | Decide whether to wait | S | FE-FEED-04 S1 |
| 34 | "Email me when it's done" for uploads and processing | Leave without watching the screen (needs D5) | M | FE-FEED-04 S2 |
| 35 | Resumable upload through an open standard protocol; uploads that continue in the background on a phone | Big files survive weak connections and locked screens | M | BE-FILE-04 S1, S2 |
| 36 | Setup checklist, a three-step tour, sample recordings, and a Help link | New people get started faster (sample data needs the approval in FE-ACCT-05 A1) | M | FE-ACCT-05 S1, S2, S3, S4 |
| 37 | "Don't ask again" for low-risk deletes that can be undone | Fewer repeated prompts | S | FE-FEED-02 S2 |
| 38 | Block identical repeat submissions within a few seconds | No accidental double records from impatient clicking | S | BE-API-06 S1 |
| 39 | Return the total result count only when asked | Keeps big lists fast | S | BE-API-04 S1 |
| 40 | Different expiry for listening and downloading, and download counts per file | Limits how long a leaked link works | S | BE-FILE-02 S1, S2 |
| 41 | A "Report a problem" button with the reference number; similar-page suggestions on the not-found page | You and support find the cause quickly | S | FE-SHELL-06 S1, S2 |

## Convenience and polish

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 42 | Collapsible sidebar, quick-jump to any screen, and a keyboard-shortcut sheet opened with "?" | Faster for frequent users | M | FE-SHELL-01 S1, S2, S3 |
| 43 | Reopen the screen you last visited; readable names in addresses | Shared links look recognisable | S | FE-SHELL-02 S1, S2 |
| 44 | A bottom navigation bar on phones | Main actions within thumb reach | S | FE-SHELL-03 S1 |
| 45 | A theme picker (light, dark, device) and a larger-text option | Matches your taste and eyesight | S | FE-SHELL-04 S1, S2; FE-ACCT-04 S1 |
| 46 | Phone Back button closes dialogs; swipe down to dismiss sheets | Feels natural on a phone | S | FE-FEED-03 S1, S2 |
| 47 | Sign in with Google or Apple (needs you to register the app with them) | One less password | M | FE-ACCT-01 S3 |
| 48 | Plain-words password advice | Better passwords without silly rules | S | FE-ACCT-01 S2; BE-AUTH-01 S2 |
| 49 | "Open your email" button, sign in automatically after a reset, remember your email on this device | Fewer steps for returning users | S | FE-ACCT-03 S1, S2; FE-ACCT-02 S2 |
| 50 | Example text in fields; trim stray spaces; silently fix common slips | Fewer rejected forms | S | FE-FORM-01 S1, S2; FE-FORM-02 S1 |
| 51 | Pause an account instead of deleting; choose what goes into the data download; an optional "why are you leaving" question | Gentler exits and smaller downloads | M | FE-ACCT-06 S1, S2, S3 |
| 52 | A generated, interactive description of the API; partial updates; pick-your-fields on heavy lists | Saves mistakes for future developers | M | BE-API-01 S1, S2, S3 |
| 53 | A public list of error codes in plain language, and a "can retry" flag on each | Faster support and cleaner retry buttons | S | BE-API-02 S1, S2 |
| 54 | Reject unknown search options; share one set of input rules between screen and server | Screen and server cannot drift apart | S | BE-API-03 S1, S2 |
| 55 | A data dictionary and a table diagram | Anyone can see why each field exists | S | BE-DATA-01 S1, S2 |
| 56 | Run database changes automatically on each release, with a dry-run preview | Nobody forgets a step | S | BE-DATA-02 S1, S2 |
| 57 | A trace view per request and automatic grouping of repeated errors | Find slow or failing steps sooner | M | BE-OPS-02 S1, S2 |
| 58 | Release notes per deploy; a one-page "how to deploy and roll back"; a preview site per change | Nobody depends on one person's memory | M | BE-OPS-07 S1, S2, S3 |
| 59 | Email template previews and a reply-to address someone reads | Check wording; people can answer | S | BE-JOB-03 S2, S3 |

## Needs your decision (approval items)

Nothing here is built. Each needs an explicit yes.

| # | What | Risk or cost to consider | Code |
|---|---|---|---|
| D1 | Raise the upload size limit above 25 MB | WAV field recordings are often larger, so most will be refused until you decide; costs storage and bandwidth | BE-FILE-01 A1; BE-FILE-04 A1 |
| D2 | Accept zip, archive or other file types | They can carry harmful code | FE-FORM-04 A1; BE-FILE-01 A2 |
| D3 | Let your sound editor download audio, not just listen | Copies of your material leave the app; the editor cannot do much without it, so this is probably wanted | FE-MEDIA-02 A1 |
| D4 | Links anyone can open without signing in | Anyone who gets the link can hear the recording | BE-AUTH-06 A2; FE-FORM-04 A2; BE-FILE-02 A1 |
| D5 | Choose an email sending service | Cost, and email addresses are sent to it; account verification, password reset and sharing all need it before going live | BE-JOB-03 A2; FE-ACCT-03 A2; BE-OPS-01 A1; BE-JOB-06 A1; BE-OPS-06 A3 |
| D6 | Change your domain's DNS records so email is trusted | Mistakes can disturb other mail on the domain | BE-JOB-03 A3 |
| D7 | Let the app email an invitation to your editor on your behalf | Mail goes to someone outside the app; until then you copy and send the link yourself | BE-AUTH-06 A1 |
| D8 | Choose a hosting provider, plan and region | Cost, speed and privacy law depend on where it runs | BE-OPS-07 A1, A2 |
| D9 | Choose where files are stored (and any delivery network) and the region | Cost; files kept in another country raise legal questions | BE-FILE-02 A2, A3 |
| D10 | Go live: put the real app and domain on the internet | Real users and real data; hard to undo | BE-OPS-07 A3 |
| D11 | Paid or off-site backup storage, possibly in another region | Cost and data-transfer rules; strongly recommended for irreplaceable recordings | BE-DATA-05 A1, A3 |
| D12 | Allow restoring a backup over live data | Overwrites changes made since the backup | BE-DATA-05 A2 |
| D13 | Switch on the automatic permanent removal of deleted recordings after 30 days | The removal cannot be undone; until you say yes, deleted recordings stay in the bin and use storage | FE-FEED-02 A2; BE-JOB-02 A1 |
| D14 | Permanently erase an account's data after its 14-day grace period, and say what is kept | Irreversible; a minimal record must remain and be disclosed; until you decide, erasure stays switched off | BE-OPS-06 A1; FE-ACCT-06 A2 |
| D15 | Two-step verification (and requiring it) | People can be locked out and need a recovery route | FE-ACCT-04 A1; FE-ACCT-02 A2 |
| D16 | Store a precise location (coordinates or a map) per recording | Location can reveal where people live or where interviews took place | BE-DATA-01 A1 |
| D17 | Send errors and logs to an outside tracking service | Data leaves your system; may cost money | BE-API-02 A1; BE-OPS-02 A1; FE-SHELL-06 A1 |
| D18 | Record the network address of sign-ins in the activity log | The catalogue wants it for security, but it is personal data with privacy impact; until you decide, it is left out | BE-DATA-04 A1 |
| D19 | A paid uptime-monitoring and alert service | Cost; some checking is needed before going live | BE-OPS-03 A1 |
| D20 | Let search reach recordings that others shared with you | Search reaches other people's content | FE-COLL-03 A1 |

## Catalogue gaps

Conventional behaviour you expected that no catalogue entry covered. Send these to the
ui-standards repository `GAPS.md`.

| Date | What was missing | Where |
|---|---|---|
| 2026-10-01 | No Required item lets a user download their own original file; only a Suggest on the player (FE-MEDIA-02 S3) and the error-state fallback exist. An organiser of audio needs this by default. | FE-MEDIA-02, BE-FILE-02 |
| 2026-10-01 | Sharing one person's access to several recordings at once (or a named set of recordings) has no entry; bulk selection and bulk grants are not linked. | BE-AUTH-06, FE-SEL-01 |
| 2026-10-01 | Audio-specific handling: embedded tags (location, device), sample rate and bit depth display, and stripping those tags on shared copies. BE-FILE-03 R2 only names images. | BE-FILE-03 |
| 2026-10-01 | Managing tags (rename, merge, delete unused) has no entry. | FE-SEL-03 |
| 2026-10-01 | Required items depend on Approval-gated services: email verification and reset (FE-ACCT-03 R4, BE-AUTH-04) need email sending (BE-JOB-03 A2); BE-DATA-04 R2 requires source addresses but A1 gates recording them; BE-DATA-03 R5 requires a 30-day purge but FE-FEED-02 A2 gates it; the 25 MB default (BE-FILE-01 R1) conflicts with its A1 for audio. | FE-ACCT-03, BE-DATA-04, BE-DATA-03, BE-FILE-01 |
