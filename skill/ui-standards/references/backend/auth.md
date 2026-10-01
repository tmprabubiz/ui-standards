# BE-AUTH · Authentication and access

Who is signed in and what they may touch: passwords, sessions, social sign-in, one-time tokens, roles, invitations and API keys. Load for any app with accounts or more than one user.

## BE-AUTH-01 · Password authentication

**Purpose:** Let people sign in with an email and password safely, so a stolen database or a guessing attack does not hand over their accounts.
**Triggers:** password, login, sign in, sign up, register, credentials, password policy, hashing, brute force, lockout, throttle, breached password
**Applies when:** users create an account with a password the app stores and checks.
**Composes:** BE-AUTH-02, BE-AUTH-04, BE-OPS-04, BE-API-02, FE-ACCT-01, FE-ACCT-02

**Required**
- R1 Passwords are hashed per CORE F13; the algorithm parameters follow the OWASP Password Storage Cheat Sheet, and a stored hash is upgraded on the user's next successful sign-in when parameters are raised.
- R2 Minimum length is 15 characters when the password is the only factor, or 8 when a second factor is always required; the maximum accepted is at least 64 (NIST SP 800-63B Rev. 4); longer input is never silently truncated (including the bcrypt input limit, which must be handled explicitly).
- R3 No composition rules ("one symbol, one capital") and no forced periodic changes; pasting and password managers are allowed; all printable characters and spaces are accepted.
- R4 Sign-in failures return one generic message and code for unknown email and wrong password, with equal response behaviour (no timing or wording difference that reveals which).
- R5 Repeated failures are throttled per account and per source address with increasing delay or temporary lock (see BE-OPS-04); a lock never reveals whether the account exists and unlocks on its own.
- R6 Passwords are never logged, returned, emailed or put in URLs; a password change requires the current password (or a valid reset token) and ends the user's other sessions (BE-AUTH-02).

**Conditional**
- C1 IF sign-up or password change happens THEN check the new password against a list of known-breached passwords and reject matches.
- C2 IF email is the account identifier THEN compare it case-insensitively and treat an already-registered email on sign-up as generically as sign-in does (see BE-AUTH-04 on enumeration).
- C3 IF the app holds sensitive or financial data THEN offer a second factor (authenticator app or passkey) and require it for administrators.

**Suggest**
- S1 Require a second factor for everyone so the minimum can drop to 8 — shorter passwords for users without losing safety.
- S2 A strength hint that explains in plain words why a password is weak — helps people choose better without silly rules.
- S3 Passkeys or authenticator-app codes as an optional second step — a stolen password alone then cannot open the account.
- S4 An email to the user after a password change or sign-in from a new device — they notice takeovers early.

**Approval**
- A1 Sending password data to an outside breached-password service in any form other than a privacy-preserving range lookup.
- A2 Letting an administrator set or see a user's password (never allowed to see; setting needs approval).

**Frontend contract**
- The form shows the length rule and the generic failure message; it never says "no such account" (FE-ACCT-02).
- Sign-up shows the breached-password rejection as a field message (FE-ACCT-01) and keeps the typed email.
- A throttled response shows a wait message from `Retry-After`, and the sign-in button is not disabled forever.

**Acceptance**
- [ ] Given an unknown email and a known email with a wrong password, when each signs in, then both get the same status, code and message.
- [ ] Given a 64-character password, when an account is created and then signed into, then both succeed; given a 7-character password, then sign-up is rejected.
- [ ] Given 10 wrong passwords in a row, when the next attempt is made, then it is throttled with 429 and `Retry-After`, and a correct password later succeeds after the delay.
- [ ] Given the database, when the password column and the logs are searched for the plain password, then it is not found and the stored value is a salted slow hash.

**Exceptions**
- Apps that use only social sign-in or one-time email links (BE-AUTH-03, BE-AUTH-04) have no password endpoints; the rest of this entry does not apply.

**Source:** OWASP ASVS 4.0.3 V2 Authentication (standard); OWASP Authentication and Password Storage Cheat Sheets (standard); NIST SP 800-63B Rev. 4 (standard); generic login error (standard)

## BE-AUTH-02 · Sessions and tokens

**Purpose:** Keep a user signed in safely, and let them (or the owner) end that access on demand.
**Triggers:** session, cookie, token, JWT, stay signed in, remember me, expiry, logout, sign out everywhere, session fixation, refresh token, device list
**Applies when:** the app keeps people signed in across requests.
**Composes:** BE-AUTH-01, BE-AUTH-03, BE-OPS-05, FE-ACCT-02, FE-ACCT-04

**Required**
- R1 Browser sessions use a random, unguessable server-issued session id (at least 128 bits) in a cookie marked `HttpOnly`, `Secure` and `SameSite` (Lax or Strict); tokens are never kept in script-readable storage.
- R2 A fresh session id is issued at every sign-in and privilege change; any pre-login id is discarded (no session fixation).
- R3 Sessions expire: an idle timeout (default 14 days for ordinary apps, shorter for sensitive ones) and an absolute lifetime (default 90 days); both are stored server-side and enforced there.
- R4 Sign-out invalidates the session on the server, not only in the browser.
- R5 "Sign out everywhere" and sign-out after a password change revoke all of the user's sessions at once; revoked sessions fail on the next request.
- R6 Programs and installed apps use short-lived access tokens with a rotating refresh token; a reused refresh token revokes that token family.

**Conditional**
- C1 IF the app uses signed self-contained tokens (such as JWT) THEN fix the allowed algorithm, verify signature, expiry, issuer and audience, keep lifetime to 15 minutes or less, and keep a way to revoke.
- C2 IF the user chose "keep me signed in" THEN only extend the idle timeout, never remove expiry.
- C3 IF a high-risk action runs (change email, delete account, view secrets) THEN require recent re-authentication.

**Suggest**
- S1 A "your devices" list with last-used time and a revoke button — lets people kick out a lost phone.
- S2 A notice when a new device signs in — they spot strangers early.

**Approval**
- A1 Long "remember me" lifetimes on apps holding financial or health data.
- A2 Using an outside identity or session service (cost; user data leaves the app).

**Frontend contract**
- Screens never read or store the token; they rely on the cookie and send requests with credentials (FE-ACCT-02).
- A 401 mid-use sends the user to sign-in with their place preserved (FE-SHELL-02, CORE F8).
- Settings shows active sessions and "Sign out everywhere" (FE-ACCT-04).

**Acceptance**
- [ ] Given a sign-in response, when its `Set-Cookie` is read, then the session cookie has `HttpOnly`, `Secure` and `SameSite`.
- [ ] Given a session id captured before sign-in, when the user signs in, then the old id no longer works and a new one is issued.
- [ ] Given two active sessions, when the user chooses sign out everywhere, then both get 401 on their next request.
- [ ] Given an idle session past its timeout, when it is used, then the response is 401 and no data is returned.

**Exceptions**
- A purely public app with no accounts has no sessions.

**Source:** OWASP ASVS 4.0.3 V3 Session Management (standard); OWASP Session Management and JWT Cheat Sheets (standard); refresh-token rotation (convention)

## BE-AUTH-03 · Social sign-in (OAuth/OIDC)

**Purpose:** Let people sign in with an account they already have, safely, without the app handling a new password.
**Triggers:** social login, sign in with Google, OAuth, OIDC, OpenID Connect, single sign-on, SSO, link account, identity provider, PKCE
**Applies when:** users may sign in through an outside identity provider.
**Composes:** BE-AUTH-02, BE-OPS-01, BE-API-02, FE-ACCT-01, FE-ACCT-02, FE-ACCT-04

**Required**
- R1 Use the authorization code flow with PKCE (RFC 7636), following the OAuth 2.0 Security Best Current Practice (RFC 9700) and OIDC Core; the implicit flow is never used.
- R2 A random `state` value is bound to the user's browser session and checked on return; for OIDC a `nonce` is checked against the ID token.
- R3 Redirect URIs are registered exactly and compared exactly; the app never redirects to a URL taken from request input.
- R4 The ID token is validated: signature against the provider's published keys, issuer, audience equals this app, expiry, and nonce.
- R5 Accounts are matched by the provider's stable subject id plus provider name, stored in a separate identities table, never by display name.
- R6 Linking to an existing account by email happens only when the provider states the email is verified; otherwise the user must first sign in to the existing account to confirm the link.
- R7 Client secrets live in configuration (CORE F12); only the scopes needed (`openid email profile`) are requested.

**Conditional**
- C1 IF the provider's email is unverified or missing THEN create no automatic link and ask the user for a verified email through BE-AUTH-04.
- C2 IF a user has only a social identity THEN block removing it unless another sign-in method exists.
- C3 IF the provider returns an error or the user cancels THEN return to sign-in with a plain message and no partial account.

**Suggest**
- S1 Let a signed-in user connect and disconnect providers in settings — handy when a work email changes.
- S2 Offer only one or two providers your users actually have — fewer buttons, less to maintain.

**Approval**
- A1 Registering the app with an identity provider (needs an owner account, may need a business review).
- A2 Requesting extra permissions such as contacts or calendars from the provider.
- A3 Sending user data to the provider beyond sign-in.

**Frontend contract**
- Sign-in and sign-up show provider buttons that start the flow with a full-page redirect (FE-ACCT-01, FE-ACCT-02).
- On return the screen lands where the user was going, or shows a clear failure message with a retry option.
- Settings lists connected providers with connect and disconnect actions (FE-ACCT-04).

**Acceptance**
- [ ] Given a callback with a `state` that does not match the session, when it is processed, then the sign-in is rejected and no session is created.
- [ ] Given a provider email that is unverified and equal to an existing account's email, when the user signs in, then the accounts are not linked automatically.
- [ ] Given the authorization request, when it is inspected, then it contains a PKCE `code_challenge` and the token request carries the matching verifier.
- [ ] Given an ID token for another app's audience, when it is submitted, then it is rejected.

**Exceptions**
- Internal tools restricted to one company's identity provider may skip C1 and C2 but keep R1 to R4.

**Source:** RFC 7636 PKCE, RFC 9700 OAuth 2.0 Security BCP, OpenID Connect Core 1.0 (standard); OAuth 2.1 (draft); OWASP OAuth 2.0 Cheat Sheet (standard); link-by-verified-email (convention)

## BE-AUTH-04 · Reset and verification tokens

**Purpose:** Make password-reset and email-verification links safe to send, so nobody can use or guess someone else's.
**Triggers:** reset password, forgot password, verify email, magic link, one-time token, confirmation link, expiry, enumeration, email change
**Applies when:** the app emails a link or code that proves control of an email address or resets access.
**Composes:** BE-AUTH-01, BE-AUTH-02, BE-JOB-03, BE-OPS-04, FE-ACCT-03

**Required**
- R1 Tokens are random with at least 128 bits of entropy from a secure generator; they are not derived from user data or time.
- R2 Only a hash of the token is stored, with the user, purpose and expiry; the plain token exists only in the email.
- R3 Tokens are single use and expire quickly: reset 30 to 60 minutes, email verification up to 24 hours; a used or expired token fails with the same message.
- R4 Requesting a reset returns the same response and similar timing whether or not the email exists; the email is sent in the background (BE-JOB-01 style) so timing does not leak.
- R5 A new request invalidates earlier unused tokens of the same purpose for that user; a successful reset ends the user's other sessions (BE-AUTH-02).
- R6 Token checks and requests are rate limited per address and per account (see BE-OPS-04).
- R7 Changing the sign-in email requires verifying the new address and notifying the old address; the change takes effect only after verification.

**Conditional**
- C1 IF the app sends a one-time sign-in link THEN apply this entry in full and bind the token to the same browser where possible.
- C2 IF an unverified account exists THEN restrict what it can do and do not treat the email as trusted (see BE-AUTH-03 R6).
- C3 IF the token appears in a URL THEN set `Referrer-Policy` to prevent leaking it and never log the full URL (BE-OPS-02).

**Suggest**
- S1 Send a notice to the user when their password is changed — they know at once if it was not them.
- S2 Let the reset page work only once per link without leaving the token in browser history — a shared computer cannot reuse it.

**Approval**
- A1 Switching to SMS codes (costs money and SIM-swap risk).
- A2 Choosing a long expiry for reset links (weaker security).

**Frontend contract**
- "Forgot password" always shows "If that address has an account, we have sent an email" (FE-ACCT-03).
- An expired or used link shows one message and a way to request a new one.
- The reset form submits the token once, then signs the user in or sends them to sign-in.

**Acceptance**
- [ ] Given a reset request for a non-existent email, when it is sent, then the response and wording equal those for a real email.
- [ ] Given a reset token already used, when it is used again, then it is rejected.
- [ ] Given the database, when the token table is read, then no plain token is present.
- [ ] Given two reset requests, when the older token is used, then it is rejected and the newer one works.

**Exceptions**
- Closed internal apps where an administrator sets passwords by hand need no self-service reset; they still need R3 for any invitation link (BE-AUTH-06).

**Source:** OWASP Forgot Password Cheat Sheet (standard); OWASP ASVS 4.0.3 V2.5 Credential Recovery (standard); NIST SP 800-63B on out-of-band codes (standard); hashed-at-rest tokens (convention)

## BE-AUTH-05 · Roles and permissions

**Purpose:** Make sure each person can do and see only what they are meant to, checked on the server every time.
**Triggers:** roles, permissions, admin, owner, editor, viewer, access control, authorization, forbidden, privilege, multi-tenant, team
**Applies when:** more than one user exists, or users differ in what they may do.
**Composes:** BE-API-01, BE-DATA-01, BE-DATA-04, FE-ACCT-07

**Required**
- R1 Authorisation runs on the server for every request; hiding a button is never the control (CORE F11).
- R2 The default is deny: an endpoint with no explicit rule refuses everyone but is caught by a test, not by users.
- R3 Each check names the actor, the action and the specific object (is this user allowed to edit this record?), not only the role.
- R4 Roles are a small fixed set defined in one place (e.g. owner, admin, member, viewer) with a written table of what each may do; the check reads the table.
- R5 Data from different owners or organisations is separated by an ownership or tenant column used in every query on tenant data (BE-DATA-01).
- R6 Role changes and failed permission checks take effect on the next request and are recorded (BE-DATA-04).
- R7 An organisation always keeps at least one owner; the last owner cannot be removed, demoted or leave without transferring.

**Conditional**
- C1 IF a record can be shared with specific people THEN store the grant explicitly (who, what level, by whom, when) and check it as part of the same rule (see BE-AUTH-06).
- C2 IF an administrator can act as another user THEN log the impersonation, show a banner, and block sensitive actions.
- C3 IF permissions are finer than roles THEN use named permissions assigned to roles, not scattered checks.

**Suggest**
- S1 A page showing what each role can do — removes guessing for whoever invites people.
- S2 A permission-matrix test generated from the role table — catches a forgotten check before release.

**Approval**
- A1 Giving a role the power to delete other users' data or see all data.
- A2 Adding an administrator or "super user" who bypasses ownership checks.

**Frontend contract**
- Screens hide or disable unavailable actions and explain why (CORE F4 no-permission state), but still rely on the server's 403.
- A 403 after the screen loaded (role changed) shows a clear message and refreshes the user's permissions.
- Role names and descriptions come from the API, not hard-coded (FE-ACCT-07).

**Acceptance**
- [ ] Given user A and record X owned by user B, when A requests X by id, then the response is 404 (or 403 where existence is public).
- [ ] Given a new endpoint with no permission rule, when the authorisation test suite runs, then it fails.
- [ ] Given a viewer, when they call an edit endpoint directly, then it is refused even though the screen hides the button.
- [ ] Given the only owner of an organisation, when they try to leave, then the request is refused with a transfer message.

**Exceptions**
- A single-user app has one implicit owner; R5 and R1 still apply to guard against other signed-in users.

**Source:** OWASP ASVS 4.0.3 V4 Access Control (standard); OWASP Authorization and IDOR Prevention Cheat Sheets (standard); OWASP API Security Top 10 object-level authorization (standard)

## BE-AUTH-06 · Invitations and sharing

**Purpose:** Let people bring others in, or share one thing with them, without opening the door to the wrong person.
**Triggers:** invite, invitation, share, share link, add member, collaborator, team invite, accept invite, revoke access, guest, link sharing
**Applies when:** a user can invite someone to the app or an organisation, or give another person or a link access to a record.
**Composes:** BE-AUTH-04, BE-AUTH-05, BE-JOB-03, BE-DATA-04, FE-ACCT-07

**Required**
- R1 An invitation records the invited email, the role offered, who invited, and an expiry (default 7 days); the role cannot exceed the inviter's own.
- R2 The invitation token follows BE-AUTH-04: random, hashed at rest, single use, expiring.
- R3 Accepting requires being signed in as, or creating an account with, the invited email (or an owner-approved other address); membership begins only on acceptance.
- R4 Invitations can be revoked and resent; revoking or expiry makes the link fail with a plain message.
- R5 Sharing grants are explicit rows (person or link, access level, expiry optional) and are checked by the rule in BE-AUTH-05; removing a grant takes effect immediately.
- R6 Share links use unguessable tokens, default to view-only, are revocable, and can have an expiry; link access never exposes anything outside the shared record.
- R7 Inviting and sharing are rate limited per user and written to the audit log (BE-DATA-04).

**Conditional**
- C1 IF the invited person already has an account THEN link the membership to it rather than creating a second account.
- C2 IF a plan limits the member count THEN check the limit when inviting, and say so clearly.
- C3 IF a link can be opened without signing in THEN mark the record as publicly reachable in the owner's view.

**Suggest**
- S1 A pending-invitations list with resend and cancel — owners can tidy up forgotten invites.
- S2 Default link expiry of 7 days — old links stop working without anyone remembering.
- S3 A short reminder email before an invitation expires — fewer invitations lapse unnoticed.

**Approval**
- A1 Sending invitation emails on the owner's behalf to people outside the organisation.
- A2 Public (no sign-in) links to private content.
- A3 Per-member charges that change the bill when someone accepts.

**Frontend contract**
- Members screen shows members and pending invitations with role, status, resend and revoke (FE-ACCT-07).
- The accept page handles signed-out, signed-in-as-someone-else, expired, and already-accepted states.
- Share dialogs show who has access and whether a link is public (FE-FEED-03).

**Acceptance**
- [ ] Given an invitation for a@x.com, when someone signed in as b@x.com opens it, then membership is not created.
- [ ] Given an invitation accepted once, when the link is used again, then it is rejected.
- [ ] Given a member whose role is below owner, when they invite someone as owner, then the request is refused.
- [ ] Given a revoked share link, when it is opened, then it returns 404 and no data.

**Exceptions**
- Single-user apps and apps whose users are created only by an administrator do not need invitations.

**Source:** OWASP ASVS 4.0.3 V4 Access Control (standard); OWASP Authorization Cheat Sheet (standard); invitation and share-link conventions in mainstream team products (convention)

## BE-AUTH-07 · API keys for integrations

**Purpose:** Let programs call the app on a user's behalf with a key that can be limited, tracked and cancelled.
**Triggers:** API key, access token, integration, personal access token, developer, secret key, scopes, revoke key, programmatic access
**Applies when:** users or external programs need non-interactive access to the API.
**Composes:** BE-AUTH-05, BE-OPS-04, BE-OPS-02, BE-DATA-04, FE-ACCT-04

**Required**
- R1 Keys are long random values (at least 128 bits) with a readable prefix; the full key is shown exactly once at creation and cannot be retrieved again.
- R2 Only a hash of the key is stored, plus the prefix, name, owner, scopes, created time, optional expiry, and last-used time.
- R3 Each key has scopes limiting what it can do (read-only by default) and is checked with the same object-level rules as a signed-in user (CORE F11).
- R4 Keys are sent in a request header, never in a URL; they are never logged (BE-OPS-02).
- R5 Keys can be revoked instantly by their owner and by an administrator; revoked or expired keys fail with 401.
- R6 Each key is rate limited and its use (last used, request count) is recorded; creation and revocation go in the audit log (BE-DATA-04).

**Conditional**
- C1 IF a key unlocks write or administrative scopes THEN require recent re-authentication to create it.
- C2 IF a key is found in a public code host or reported leaked THEN revoke it and notify its owner.
- C3 IF a key is unused for 90 days THEN warn its owner and offer to revoke it.

**Suggest**
- S1 Expiry dates by default — a forgotten key stops working on its own.
- S2 Alert when a key is used from a new place — an early warning of leaks.

**Approval**
- A1 Keys with write or delete power.
- A2 Letting third parties generate keys for the app's data.

**Frontend contract**
- Settings lists keys by name, prefix, scopes, created, last used, with a revoke action (FE-ACCT-04, FE-FEED-02).
- The create step shows the key once with a copy button and a clear "you won't see this again" notice (FE-FEED-03).

**Acceptance**
- [ ] Given a created key, when the keys list is read afterwards, then only the prefix is visible.
- [ ] Given a read-only key, when it calls a write endpoint, then the response is 403.
- [ ] Given a revoked key, when it is used, then the response is 401.
- [ ] Given a request with the key in the query string, when it is made, then it is rejected.

**Exceptions**
- Apps with no outside integrations do not need API keys; do not add them speculatively.

**Source:** OWASP ASVS 4.0.3 V2.10 Service Authentication (standard); OWASP REST Security Cheat Sheet (standard); show-once, prefix, scoped keys (convention)
