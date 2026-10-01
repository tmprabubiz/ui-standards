# FE-ACCT · Accounts, settings and people

Load when the app has user accounts: sign up and in, recovery, profile and settings, first run, deleting data, and teams with roles.

## FE-ACCT-01 · Sign up

**Purpose:** Let a new person create an account quickly and safely with minimal friction.
**Triggers:** sign up, register, create account, join, new user, password rules, social sign-up, terms and conditions, email address
**Applies when:** the app has accounts that people create themselves.
**Composes:** FE-ACCT-02, FE-ACCT-03, FE-ACCT-05, FE-FORM-01, FE-FORM-02, BE-AUTH-01, BE-AUTH-03, BE-AUTH-04

**Required**
- R1 Ask only what is needed to start (email and password, or social sign-in); anything else is asked later (FE-ACCT-05).
- R2 The email field uses the email input kind and the username autocomplete purpose; the password field uses the new-password purpose so password managers offer to generate and save; pasting is allowed (WCAG 2.2 SC 3.3.8).
- R3 A show-or-hide toggle on the password field is a named button whose state is announced, hidden by default; the rules are stated before typing and match the server: a minimum length of 15 characters (8 when a second factor is always required), long passphrases (64 or more) accepted, no forced mix of symbols, and common or breached passwords refused (NIST SP 800-63B Rev. 4).
- R4 Errors follow FE-FORM-02; unless C1 applies, the "email already registered" case offers Sign in and Reset password links.
- R5 Terms and privacy are linked next to the submit button; the submit shows busy and blocks repeats (CORE F6).
- R6 After success the user lands on verify-email (FE-ACCT-03) or onboarding (FE-ACCT-05) with focus on the heading; an "Already have an account? Sign in" link is always present.

**Conditional**
- C1 IF the app holds sensitive or private data THEN the form does not reveal whether an email is registered: it says "Check your email" and mails existing users a sign-in link.
- C2 IF consent is legally required THEN terms and marketing consent are separate, unticked checkboxes with links; marketing is optional.
- C3 IF social sign-in is offered THEN buttons say "Continue with Google" and similar, work from the sign-in screen too, and an email clash is handled clearly (BE-AUTH-03).
- C4 IF the person arrives from an invitation THEN the email is prefilled and locked and the inviter is named (FE-ACCT-07).
- C5 IF bot protection is added THEN an accessible alternative exists and puzzles are never the only option (SC 3.3.8).

**Suggest**
- S1 Passkeys — lets people sign in without remembering a password.
- S2 A password strength hint in plain advice — helps people pick better passwords than rule lists do.
- S3 Social sign-in — fewer passwords for people to manage.

**Approval**
- A1 Collecting extra personal details at sign-up — more data to protect and lower completion.
- A2 Adding social sign-in providers — involves third-party accounts and terms.
- A3 Marketing email opt-in pre-selected — may break consent rules.

**Backend contract**
- The create endpoint validates input (CORE F10), stores the password hashed (CORE F13, BE-AUTH-01), sends a verification message (BE-AUTH-04), is rate limited (BE-OPS-04) and safe to repeat (BE-API-06).

**Acceptance**
- [ ] Given the password field, when a password manager is installed, then it offers to generate and save a password.
- [ ] Given the user selects Show password, when toggled, then the text is visible and the button name or state reflects it.
- [ ] Given a known breached password, when submitted, then the form rejects it with plain advice and keeps the email.
- [ ] Given sign-up succeeds, when the page changes, then focus is on the next screen's heading.

**Exceptions**
- Internal tools where an administrator creates all accounts have no public sign up; use FE-ACCT-07 invitations instead.

**Source:** NIST SP 800-63B (standard); WCAG 2.2 SC 3.3.8, 1.3.5 (standard); HTML autocomplete (standard); OWASP Authentication Cheat Sheet (standard)

## FE-ACCT-02 · Sign in and sign out

**Purpose:** Let returning users in quickly and safely, and let them leave just as clearly.
**Triggers:** sign in, log in, login, logout, sign out, session expired, remember me, two-step verification, password manager, forgot password
**Applies when:** the app has accounts.
**Composes:** FE-ACCT-01, FE-ACCT-03, FE-ACCT-04, FE-SHELL-02, BE-AUTH-01, BE-AUTH-02, BE-AUTH-03, BE-OPS-04

**Required**
- R1 Email or username uses the username autocomplete purpose and the password uses current-password; both appear on one screen so password managers work; show-or-hide toggle and paste are allowed; Enter submits.
- R2 A failed attempt says "Email or password is incorrect" without revealing which; the email stays filled; focus goes to the error; after repeated failures the message states the wait time in plain words.
- R3 "Forgot password?" sits beside the password field, with a "Create account" link nearby.
- R4 After success the user returns to the address they wanted (FE-SHELL-02) or home; focus goes to the main heading; when a session expires mid-work, sign-in returns to the same place and unsaved input is kept (CORE F8).
- R5 Sign out is in the account menu, takes one action, ends the session on the server (BE-AUTH-02), shows a signed-out confirmation, and protected screens are not shown from browser history or cache afterwards.
- R6 Provider errors from social sign-in map to plain messages.

**Conditional**
- C1 IF two-step verification is on THEN the second step asks for a code using the one-time-code autocomplete purpose, numeric keyboard, paste allowed, resend with a wait, and a recovery option.
- C2 IF users can be signed in on several devices THEN settings list sessions with Sign out everywhere (FE-ACCT-04).
- C3 IF the account is unverified THEN the message says so and offers resend (FE-ACCT-03).
- C4 IF "Keep me signed in" exists THEN it is unticked by default and explains it is for private devices.

**Suggest**
- S1 Passkeys or magic links — fewer forgotten passwords and support requests.
- S2 Remember the email on this device — saves typing for returning users.

**Approval**
- A1 Adding social sign-in or company single sign-on — third-party accounts and terms apply.
- A2 Requiring two-step verification for everyone — adds support load and lock-out cases.

**Backend contract**
- Sign-in issues a session or token (BE-AUTH-02) and returns the same generic failure for unknown email and wrong password (BE-AUTH-01); attempts are rate limited (BE-OPS-04); sign out revokes the session server-side; social sign-in per BE-AUTH-03.

**Acceptance**
- [ ] Given wrong credentials, when submitted, then a generic error appears and the email field keeps its value.
- [ ] Given a protected address opened while signed out, when sign-in succeeds, then the user lands on that address.
- [ ] Given the user signs out, when they press Back, then no protected data is shown.
- [ ] Given a session expires while editing, when the user signs in again, then they return to the edit with entries intact.

**Exceptions**
- Apps that rely only on a company sign-in provider may replace the form with a single provider button.

**Source:** OWASP Authentication and Session Management Cheat Sheets (standard); NIST SP 800-63B (standard); HTML autocomplete (standard); WCAG 2.2 SC 3.3.8 (standard)

## FE-ACCT-03 · Password reset and email verification

**Purpose:** Let people recover access and prove their email without leaking which accounts exist.
**Triggers:** forgot password, reset password, reset link, verify email, confirmation email, resend email, change email, verification code
**Applies when:** accounts use passwords, or any account has an email address that must be verified.
**Composes:** FE-ACCT-01, FE-ACCT-02, FE-ACCT-04, BE-AUTH-04, BE-JOB-03, BE-OPS-04

**Required**
- R1 Forgot password asks for the email only and always answers the same way ("If an account exists, we've sent a reset link"), with Resend after a short wait.
- R2 The reset link opens a page with new-password fields (new-password purpose), the same rules and toggle as FE-ACCT-01; an expired or used link says so and offers a new link; the token is never shown on the page.
- R3 On success the page confirms "Password changed", signs the user in or sends them to sign in, ends other sessions, and an email notifies the account owner of the change.
- R4 After sign-up, "Check your inbox" shows the address, Resend with a visible wait, and Change email; the verified state is visible in the profile; the verification link works even when opened on another device and continues to where the user was heading.
- R5 What an unverified user can do is explicit and consistent, and a persistent banner (not a toast) shows until verified.
- R6 Emails have a clear subject, one primary button plus the plain link, the expiry time, and a line saying "If you didn't request this, ignore this email".

**Conditional**
- C1 IF the user changes their email in settings THEN the new address is verified before it replaces the old one and the old address is notified (FE-ACCT-04).
- C2 IF the account only uses social sign-in THEN a reset request explains how to sign in instead.
- C3 IF a code is used instead of a link THEN the code field uses the one-time-code purpose, allows paste and limits attempts.

**Suggest**
- S1 An "Open your email" shortcut button — saves a step on the next screen.
- S2 Sign the user in automatically after reset — avoids a second form.

**Approval**
- A1 Requiring a verified email before any access — it can lock out people with email problems.
- A2 Sending emails from the app — needs an email provider and attention to deliverability and cost (BE-JOB-03).

**Backend contract**
- Tokens are single-use, expiring and stored hashed (BE-AUTH-04); emails go through a queue with retries (BE-JOB-03); requests are rate limited per email and per address (BE-OPS-04); a reset ends other sessions (BE-AUTH-02).

**Acceptance**
- [ ] Given an unknown email, when the user requests a reset, then the same message as for a known email appears.
- [ ] Given an expired reset link, when opened, then a message offers to send a new link.
- [ ] Given a password is reset, when it succeeds, then other sessions are ended and an email notifies the owner.
- [ ] Given Resend was just pressed, when the user tries again immediately, then a visible wait prevents repeats.

**Exceptions**
- Apps with no passwords and no email verification need only the sign-in link flow.

**Source:** OWASP Forgot Password Cheat Sheet (standard); NIST SP 800-63B (standard); WCAG 2.2 SC 3.3.8 (standard)

## FE-ACCT-04 · Profile and settings

**Purpose:** Give users one organised place to manage who they are, how they sign in and how the app behaves for them.
**Triggers:** profile, settings, preferences, account page, change password, change email, avatar, display name, sessions, two-step, API keys
**Applies when:** users have accounts or any personal preferences.
**Composes:** FE-ACCT-03, FE-ACCT-06, FE-FORM-04, FE-FORM-05, FE-SHELL-04, FE-SHELL-05, BE-AUTH-01, BE-AUTH-02, BE-API-07

**Required**
- R1 Settings are grouped into sections (Profile, Security, Notifications, Appearance, Data), each setting has a plain description, and sections have their own addresses (FE-SHELL-02).
- R2 Each section uses one save model: instant-apply switches confirm each change, and form sections have Save and Cancel with the unsaved guard (FE-FORM-05); the two are never mixed in one section.
- R3 Profile covers display name, optional avatar (upload per FE-FORM-04 with an initials fallback), email (changed with verification, FE-ACCT-03), and language and time zone with detected defaults (FE-SHELL-05, CORE D1).
- R4 Changing password asks for the current password, shows success, and offers to sign out other devices; where sessions exist, they are listed with a Sign out control for each.
- R5 Sensitive changes (email, password, deleting the account) require recent sign-in; otherwise the user re-enters their password first.
- R6 A setting that fails to save shows an error and reverts the displayed value to the real one (CORE F4).

**Conditional**
- C1 IF notifications exist THEN preferences are per type and channel (FE-FEED-05) and security messages cannot be switched off.
- C2 IF two-step verification is available THEN turning it on or off works from here, and recovery codes are shown once with a way to save them.
- C3 IF integrations or API keys exist THEN they are listed with created and last-used dates and revoked with confirmation (BE-AUTH-07, FE-FEED-02).
- C4 IF roles exist THEN the user's own role shows read-only with a plain explanation.

**Suggest**
- S1 A theme preference — lets people match their taste or device (FE-SHELL-04).
- S2 A list of recent sign-ins — helps people spot strangers using their account.

**Approval**
- A1 Two-step verification — needs recovery handling for locked-out people.
- A2 A public profile visible to other users — raises privacy questions.

**Backend contract**
- Profile and settings reads and updates affect only the caller's own record (CORE F11, BE-API-01); email change uses a verification token (BE-AUTH-04); password change rechecks the current password and ends other sessions (BE-AUTH-01, BE-AUTH-02); saves use version checks (BE-API-07).

**Acceptance**
- [ ] Given the user changes their password, when they enter a wrong current password, then the change is refused with a clear message.
- [ ] Given a switch setting is toggled and the save fails, when the error appears, then the switch returns to its saved position.
- [ ] Given a form section has unsaved edits, when the user switches section, then the unsaved-changes prompt appears.
- [ ] Given an old session, when the user starts an email change, then they are asked to re-enter their password first.

**Exceptions**
- Apps with no personal preferences may offer only account and security sections.

**Source:** NIST SP 800-63B and OWASP ASVS 4 authentication and session requirements (standard); WCAG 2.2 SC 3.3.7 (standard); Apple HIG Settings and Material 3 settings guidance (convention)

## FE-ACCT-05 · Onboarding and first run

**Purpose:** Get a new user to their first useful result quickly and explain the app without forcing a tour.
**Triggers:** onboarding, welcome, first run, getting started, tour, setup checklist, empty state, sample data, tutorial, new user
**Applies when:** new users must set something up or learn the app before it is useful.
**Composes:** FE-ACCT-07, FE-FORM-03, FE-FEED-03, FE-FEED-05, FE-MEDIA-04, BE-DATA-06

**Required**
- R1 The first run reaches the first useful result in the fewest steps; only questions that change what the user sees are asked, and each can be skipped except essential ones ("Skip for now").
- R2 Empty screens double as onboarding: each says what the screen is for and offers one primary action to create the first item (CORE F4); sample data appears only when clearly labelled and removable in one action.
- R3 A welcome or tour is optional, can be dismissed by Escape or Skip, is keyboard accessible, never blocks the app, appears once, and can be reopened from Help; it does not cover the control it describes and follows dialog focus rules (FE-FEED-03).
- R4 Multi-step setup uses FE-FORM-03; a setup checklist shows done and not done and stays until finished or dismissed.
- R5 A returning user never sees onboarding again; completion is stored on the account, not just the device.

**Conditional**
- C1 IF the person was invited into an existing workspace THEN skip workspace creation and show who invited them and what they can do (FE-ACCT-07).
- C2 IF the app needs permissions (notifications, microphone) THEN ask in context at first use, not at launch (FE-MEDIA-04, FE-FEED-05).
- C3 IF roles differ THEN first-run content is tailored to the role.
- C4 IF data can be imported THEN offer import during setup with a Skip choice.

**Suggest**
- S1 A setup checklist on the home screen — keeps new users oriented.
- S2 A three-step tour — explains the main areas in under a minute.
- S3 Sample data — lets people try the app before adding their own.
- S4 A visible Help link or contact — gives stuck people a way out.

**Approval**
- A1 Creating sample data in the user's account — it may be mistaken for real data.
- A2 Measuring onboarding steps with analytics — involves tracking users and privacy disclosure.

**Backend contract**
- Onboarding progress is stored on the user (BE-API-01); sample data comes from a labelled seed (BE-DATA-06) that can be removed in one action.

**Acceptance**
- [ ] Given a new user with no data, when the main screen loads, then it explains itself and offers a first action.
- [ ] Given a tour is running, when the user presses Escape, then it closes and does not reappear next visit.
- [ ] Given the user finished onboarding on one device, when they sign in on another, then onboarding does not show.
- [ ] Given sample data exists, when the user looks at it, then it is labelled and a single action removes it.

**Exceptions**
- Simple single-purpose apps need only good empty states.

**Source:** Apple HIG Onboarding and NN/g onboarding and empty-state guidance (convention); WAI-ARIA APG Dialog pattern (standard)

## FE-ACCT-06 · Delete account and export my data

**Purpose:** Give users control of their data: download it, and delete their account with clear consequences.
**Triggers:** delete account, close account, download my data, export data, GDPR, right to erasure, data portability, privacy, remove my data
**Applies when:** the app stores personal data about its users.
**Composes:** FE-ACCT-04, FE-FEED-02, FE-FEED-04, BE-OPS-06, BE-DATA-03, BE-DATA-04, BE-JOB-01, BE-FILE-02

**Required**
- R1 "Download my data" and "Delete my account" are plainly named and sit in Settings under Data or Privacy (FE-ACCT-04).
- R2 Export gives the user's own data in a common readable format with their files, shows status (preparing, ready), delivers by an expiring, access-checked link, and needs recent sign-in.
- R3 The delete screen says exactly what is deleted, what is kept (legal, shared content) and when, whether a grace period allows recovery, and offers export first.
- R4 Deletion needs strong confirmation (FE-FEED-02): re-enter the password or sign in again, and type the email or a confirmation word; the button reads "Delete my account permanently" and Cancel has initial focus.
- R5 After the request the user is signed out everywhere and sees confirmation on screen and by email; with a grace period it says how to cancel; the retention of backups is stated.
- R6 An owner of a shared workspace must hand over ownership or delete the workspace first; the screen explains this instead of failing silently.

**Conditional**
- C1 IF a grace period exists THEN signing in shows "Scheduled for deletion on <date>" with a Restore button.
- C2 IF content is shared with others THEN say what happens to it (removed, anonymised, or handed over).
- C3 IF a paid plan exists THEN billing status is shown and cancelled first.
- C4 IF the export is large THEN it runs as a background job with progress and an email when ready (FE-FEED-04).

**Suggest**
- S1 Pause or deactivate instead of delete — keeps data for people who want a break.
- S2 Choose what to include in the export — gives smaller, relevant downloads.
- S3 An optional "why are you leaving" question — helps the owner improve the app.

**Approval**
- A1 Immediate permanent deletion with no grace period — mistakes cannot be undone.
- A2 Keeping any data after deletion (legal or analytics) — it must be disclosed to the user.

**Backend contract**
- Export is a background job collecting all of the user's data (BE-OPS-06, BE-JOB-01) with a single-use expiring link (BE-FILE-02); erasure removes data, files and copies held by others per policy (BE-OPS-06, BE-DATA-03) and records an audit entry without personal data (BE-DATA-04).

**Acceptance**
- [ ] Given the user requests an export, when it is ready, then an expiring download link is offered in the app and by email.
- [ ] Given the user opens Delete my account, when the screen shows, then it lists what is deleted and kept and offers export.
- [ ] Given the user confirms deletion, when it completes, then they are signed out on all devices and an email confirms.
- [ ] Given the user owns a shared workspace, when they try to delete, then they are told to transfer ownership first.

**Exceptions**
- Apps with no personal data beyond a sign-in still need account deletion, but export may be limited to profile details.

**Source:** GDPR Articles 15, 17 and 20 (standard); OWASP ASVS 4 (standard); Apple App Store Review Guideline 5.1.1(v) account deletion (convention)

## FE-ACCT-07 · Members, invitations and roles

**Purpose:** Let owners add people to a workspace, set what each can do, and remove them safely.
**Triggers:** invite, team members, add user, roles, permissions, admin, owner, workspace, share access, remove member, pending invitation
**Applies when:** more than one person uses the same workspace, project or data.
**Composes:** FE-ACCT-01, FE-ACCT-02, FE-COLL-01, FE-FEED-02, FE-SEL-02, BE-AUTH-04, BE-AUTH-05, BE-AUTH-06, BE-JOB-03, BE-DATA-04, BE-API-05

**Required**
- R1 A members screen lists each person with name, email, role, status (Active, Invited, Suspended) and joined date, as a table with search and filter (FE-COLL-01).
- R2 Invite takes one or more emails (pasting a list works), a role choice with plain descriptions of what each role can do (FE-SEL-02), and an optional message; the result is shown per address (sent, already a member, invalid).
- R3 Pending invitations show Resend and Revoke (confirmed) and an expiry; the email names the inviter and workspace and opens sign up or sign in with the email prefilled, joining on completion; an expired or revoked link explains and says who to ask.
- R4 Changing a role or removing a member needs confirmation naming the person and consequence (FE-FEED-02); the last owner cannot be removed or demoted, with an explanation; people can leave, with ownership handover for owners.
- R5 Controls match permissions: only permitted roles see invite and change controls, others see a read-only list, and the server enforces it (CORE F11); a role change takes effect on the person's next request.
- R6 What each role can do is visible in a "What can each role do?" table or help panel.

**Conditional**
- C1 IF a person belongs to several workspaces THEN the current one is shown and a switcher lives in the shell (FE-SHELL-01).
- C2 IF invitations are sent in bulk from a file THEN show a preview with per-row errors before sending (BE-API-05).
- C3 IF individual items can be shared THEN a share dialog offers people with an access level and an optional link with a warning (BE-AUTH-06).
- C4 IF invitations are limited to a company domain THEN the rule is stated before sending.

**Suggest**
- S1 An invite link with an expiry — handy for adding many people at once.
- S2 A record of who invited whom — helps owners audit access.
- S3 Custom roles — fits teams with unusual needs.

**Approval**
- A1 "Anyone with the link can join or view" access — anyone who gets the link gets in.
- A2 Custom roles and a permissions matrix — more complexity to build and to get wrong.
- A3 Auto-joining by email domain — people join without an explicit invitation.

**Backend contract**
- Invitations are single-use expiring tokens stored hashed (BE-AUTH-06, BE-AUTH-04) sent through BE-JOB-03; roles are checked on every request (BE-AUTH-05); the last-owner rule is enforced on the server; membership changes are audited (BE-DATA-04).

**Acceptance**
- [ ] Given an invite to three emails with one already a member, when sent, then the result lists two sent and one already a member.
- [ ] Given the only owner, when they try to demote themselves, then it is blocked with an explanation.
- [ ] Given a member without admin rights, when they open the members screen, then invite and role controls are absent.
- [ ] Given an expired invitation link, when opened, then the page says it expired and who to contact.

**Exceptions**
- Single-user apps need none of this; do not build roles for one user.

**Source:** OWASP ASVS 4 access-control requirements (standard); Slack, GitHub and Google Workspace invitation flows (convention)
