# Next iteration — Field Recordings Organiser

Things this app could do next. Nothing here has been built. Pick items and ask your
agent: "Build NEXT-ITERATION items 1, 3 and 4."

Effort: **S** small · **M** one feature slice · **L** several slices.

## Safety and data (do these first)

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 1 | Keep a second copy of backups with another provider | Your recordings survive the loss of one account or site | M | BE-DATA-05 S1 |
| 2 | Choose what goes into "Download my data" (details only, or details plus audio files) | Audio files are huge; a small download is quicker when you only need the list | M | FE-ACCT-06 S2 |
| 3 | A generated test that checks every endpoint refuses people who should not see a recording | Catches a forgotten permission check before your editor or anyone else could see the wrong file | S | BE-AUTH-05 S2 |
| 4 | Automatic scan for passwords or keys accidentally saved into the code | Stops a leak before it becomes public | S | BE-OPS-01 S1 |
| 5 | A "Recent activity" page showing sign-ins, shares and deletions | You can spot anything unusual on your account | M | BE-DATA-04 S1, FE-ACCT-04 S2 |
| 6 | Email you when your account is used from a new device | You find out quickly if someone else gets in (needs the email provider decision) | S | BE-AUTH-02 S2, BE-AUTH-01 S4 |
| 7 | Plain-words password strength hint | Helps you pick a safe password without silly rules | S | FE-ACCT-01 S2, BE-AUTH-01 S2 |
| 8 | Sign in with a passkey instead of a password | Nothing to remember or steal | M | FE-ACCT-01 S1, FE-ACCT-02 S1, BE-AUTH-01 S3 |
| 9 | A warning in the bin before items are permanently removed | No surprise loss of a recording you still want | S | BE-DATA-03 S2 |
| 10 | A page listing failed background jobs (uploads that did not process) with Retry | You can rescue a stuck recording without a developer | M | BE-JOB-01 S1 |
| 11 | Separate job lines for urgent and heavy work | A password email is never stuck behind a long audio conversion | S | BE-JOB-01 S2 |
| 12 | A one-page "how to release and roll back" guide | Anyone can recover the app, not just the person who built it | S | BE-OPS-07 S2 |

## Things users will notice every day

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 13 | A Download button for the original file, shown to you as the owner | Get your full-quality file back out whenever you need it | S | FE-MEDIA-02 S3 |
| 14 | Playback speed control | Skim through long recordings faster, or slow down speech | S | FE-MEDIA-02 S1, FE-MEDIA-01 S3 |
| 15 | A mini player that stays visible while you browse | Keep listening while you tag or search | M | FE-MEDIA-01 S1 |
| 16 | A waveform picture for each recording in the list | See loud events and silences without playing | M | BE-FILE-03 S2 |
| 17 | Storage used shown in settings | See how much space your recordings take before you hit a limit | S | BE-FILE-01 S2 |
| 18 | Previous and Next buttons on a recording that keep your filters | Review a whole filtered set in order | S | FE-COLL-06 S1 |
| 19 | Saved views of your favourite filter and sort combinations | One click to "Interviews, newest first" | M | FE-COLL-04 S1, BE-API-04 S2 |
| 20 | Counts beside each tag in the filter | See what a tag will return before you click | S | FE-COLL-04 S2 |
| 21 | Recent searches | Repeat a search without retyping | S | FE-COLL-03 S1 |
| 22 | Press "/" to jump to search | Faster for keyboard users | S | FE-COLL-03 S3 |
| 23 | Recently used tags offered first | Tagging a batch of similar recordings takes fewer keystrokes | S | FE-SEL-03 S1 |
| 24 | Shift-click to select a range of recordings | Select 30 in a row in two clicks | S | FE-SEL-01 S1 |
| 25 | An in-app notification centre (bell) | See what happened while you were away; not built because you did not ask for notifications | M | FE-FEED-05 (not cast) |

## Convenience and polish

| # | What | Why you may want it | Effort | Code |
|---|---|---|---|---|
| 26 | A keyboard shortcut help sheet opened with "?" | Learn the shortcuts without guessing | S | FE-SHELL-01 S3 |
| 27 | A bottom navigation bar on phones | Main screens within thumb reach | S | FE-SHELL-03 S1 |
| 28 | A theme picker (system, light, dark) | Override your device setting | S | FE-SHELL-04 S1 |
| 29 | A "Report a problem" button that includes the reference id | You can tell the developer exactly what went wrong | S | FE-SHELL-06 S1 |
| 30 | A "Back to top" button on long lists | Saves effort on a phone | S | FE-COLL-05 S1 |
| 31 | A visible Help link | A way out when you get stuck | S | FE-ACCT-05 S4 |
| 32 | A three-step welcome tour | Explains the main areas in under a minute | S | FE-ACCT-05 S2 |
| 33 | Sample recordings to try before uploading your own (needs decision 17) | Try tagging and sharing with nothing at stake | S | FE-ACCT-05 S3 |
| 34 | A short release note for every deploy | Everyone knows what changed and when | S | BE-OPS-07 S1 |
| 35 | A preview page for each email the app sends | Check the wording before people see it | S | BE-JOB-03 S2 |
| 36 | A richer demo data set covering empty, full and broken states | Every screen state can be checked quickly | S | BE-DATA-06 S1 |
| 37 | Use the open "tus" resumable upload protocol | Reuses well-tested code for big uploads | S | BE-FILE-04 S1 |
| 38 | A machine-readable description of the API with a test page | Fewer integration mistakes; handy for coding agents | S | BE-API-01 S1 |
| 39 | A "can retry" flag on every error | The screen offers Try again only when it can help | S | BE-API-02 S2 |
| 40 | Share one validation schema between screens and server | Limits can never drift apart | S | BE-API-03 S2 |
| 41 | A short plain-English description of every stored field | You and future developers know why each field exists | S | BE-DATA-01 S1 |

## Needs your decision (approval items)

Nothing here is built. Where the app needs the behaviour to work at all, it ships behind a
named setting that stays off (or a stub) until you say yes.

| # | What | Risk or cost to consider | Code |
|---|---|---|---|
| 1 | Let your sound editor download the original files, not just play previews | The editor's real job needs the originals, but copies of your raw material then live outside your control, and permission or copyright questions can arise. Until you decide, the editor hears previews only. | FE-MEDIA-02 A1 |
| 2 | Choose and pay for an email provider and set up the sending domain | Sign-up emails, password reset and editor invitations cannot be sent without it; costs money and needs changes to your domain records. Until then the app uses a stub and the owner copies the invitation link to pass on. | BE-JOB-03 A2, BE-JOB-03 A3, FE-ACCT-03 A2, BE-AUTH-06 A1, BE-OPS-01 A1 |
| 3 | Allow share links that open without signing in | Easier for the editor, but anyone who gets the link can hear the recording. Until you decide, the editor must have an account. | BE-AUTH-06 A2, FE-FORM-04 A2, BE-FILE-02 A1, BE-API-01 A1 |
| 4 | Choose hosting, file storage and backup providers, their region and paid plans (including paid monitoring) | Costs money, and where your recordings and your editor's and subjects' data are stored has privacy-law consequences | BE-OPS-07 A1, BE-OPS-07 A2, BE-FILE-02 A2, BE-FILE-02 A3, BE-DATA-05 A1, BE-DATA-05 A3, BE-OPS-03 A1, BE-OPS-06 A3 |
| 5 | Switch on the automatic purge of the bin after 30 days, and on account erasure after the 14-day grace period | Both permanently destroy data. They are built but off, so nothing is ever deleted for good until you say yes. | BE-JOB-02 A1, BE-OPS-06 A1 |
| 6 | Raise the 2 GB limit per audio file | Long multi-channel recordings can exceed 2 GB; larger limits cost more storage and bandwidth | BE-FILE-01 A1, BE-FILE-04 A1 |
| 7 | Deploy to production and point your live domain at it | Real users and real data from that moment | BE-OPS-07 A3 |
| 8 | Require a verified email before anyone can use the app | Stronger identity but locks out people whose email has problems. Currently unverified users can use the app but cannot share. | FE-ACCT-03 A1 |
| 9 | Add two-step verification | Safer accounts, but you need a plan for locked-out people | FE-ACCT-04 A1, FE-ACCT-02 A2 |
| 10 | Add Google or Apple sign-in | Third-party accounts and terms apply | FE-ACCT-01 A2, FE-ACCT-02 A1 |
| 11 | Let "Select all" in the library cover results you cannot see on screen | One action could reach hundreds of recordings you never looked at | FE-SEL-01 A2 |
| 12 | Play the next recording automatically when one ends | Can surprise people and use data | FE-MEDIA-01 A1 |
| 13 | Decide what the app keeps after you delete your account (minimal audit marker) | It must be disclosed to you and may touch legal duties | FE-ACCT-06 A2, BE-OPS-06 A2 |
| 14 | Send crash and error reports to an outside monitoring or logging service | Data leaves your system and the service may cost money | FE-SHELL-06 A1, BE-API-02 A1, BE-OPS-02 A1 |
| 15 | Record the address and device used for each sign-in in the audit log | More personal data to protect, though it helps spot break-ins | BE-DATA-04 A1 |
| 16 | Add an outside bot check to sign-up | Privacy and cost; a hidden-field trap is used instead for now | BE-OPS-04 A1 |
| 17 | Create sample recordings inside new accounts | They may be mistaken for real material | FE-ACCT-05 A1 |
| 18 | Send "your upload is ready" emails or phone messages (with "email me when it's done") | Needs permission, an email or push provider, and unsubscribe handling | FE-FEED-04 A1, FE-FEED-04 S2 |

## Catalogue gaps

Conventional behaviour you expected that no catalogue entry covered. Send these to the
ui-standards repository `GAPS.md`.

| Date | What was missing | Where |
|---|---|---|
| 2026-10-01 | Tag management: rename, merge and delete tags (FE-SEL-03 only covers choosing and creating) | FE-SEL-03 |
| 2026-10-01 | Metadata privacy for shared audio (field recorders write location and device details into files); BE-FILE-03 R2 covers images only | BE-FILE-03 |
| 2026-10-01 | Access levels for shared media: preview-only versus original download, and how a read-only guest differs from a member | BE-AUTH-06, FE-MEDIA-02 |
