# BE-OPS · Operations, security and privacy

How the app is configured, observed, protected and deployed: secrets, logs, health, abuse limits, browser security, privacy rights and environments. Load for any app that will run for real users.

## BE-OPS-01 · Configuration and secrets

**Purpose:** Keep passwords, keys and settings out of the code, so they cannot leak and can change per environment.
**Triggers:** config, environment variables, secrets, API key, .env, credentials, settings, secret manager, rotation, hard-coded key
**Applies when:** the app has any secret or environment-specific setting (always).
**Composes:** BE-OPS-07, BE-OPS-02, BE-AUTH-07

**Required**
- R1 All settings that differ by environment, and every secret, come from environment configuration or a secret store (CORE F12); none is written in code or in the repository.
- R2 The repository ignores local secret files and contains an example file listing each setting by name with a harmless placeholder and a description.
- R3 The app validates its configuration at start and refuses to run when a required value is missing or malformed, naming the setting but never its value.
- R4 Each environment has its own secrets; production secrets are never used in development or testing.
- R5 Only values meant for the browser (public identifiers) are exposed to the client bundle, and the names make that clear; secrets are never exposed to it.
- R6 Secrets are never printed in logs, errors or health output (BE-OPS-02), and are read by as few components as needed.
- R7 A secret can be rotated without code changes; the rotation steps and owner are written down.

**Conditional**
- C1 IF a secret is committed or leaked THEN treat it as compromised: rotate it, review use, and remove it from history where possible.
- C2 IF a secret manager is available THEN use it for production secrets and give each service only its own.
- C3 IF a feature depends on an outside service THEN the app starts without it and the feature reports "not configured" rather than failing at random.

**Suggest**
- S1 Automatic scanning for committed secrets — catches an accident before it is public.
- S2 A calendar reminder to rotate long-lived keys — old keys are a common risk.

**Approval**
- A1 Adding a paid secret manager or any new outside service key.
- A2 Giving a person or tool access to production secrets.

**Frontend contract**
- None.

**Acceptance**
- [ ] Given the repository, when it is searched for secret patterns, then no real secret is found and the example file lists every setting.
- [ ] Given a missing required setting, when the app starts, then it stops with an error naming the setting and not its value.
- [ ] Given the built client bundle, when searched for server secret values, then none is present.
- [ ] Given a secret changed in configuration, when the app is restarted, then it uses the new value with no code change.

**Exceptions**
- Public, non-secret identifiers (a map style, a public analytics-free site key) may be placed in client configuration.

**Source:** OWASP ASVS 4.0.3 V14 Configuration (standard); OWASP Secrets Management Cheat Sheet (standard); twelve-factor app configuration (convention)

## BE-OPS-02 · Logging and request tracing

**Purpose:** Make it possible to find and fix problems quickly, without writing anyone's secrets or private details into logs.
**Triggers:** logging, logs, request id, trace, correlation id, debug, monitoring, error log, PII in logs, log retention, structured logging
**Applies when:** the server handles requests or runs jobs (always).
**Composes:** BE-API-02, BE-DATA-04, BE-OPS-03, FE-SHELL-06

**Required**
- R1 Logs are structured (one machine-readable record per line) with time (UTC), level, message, request id, route, status and duration (extends CORE D7).
- R2 Every request gets a request id, accepted from a trusted proxy header only if it is well-formed, else generated; it is returned in a response header and error bodies, and passed to jobs and outside calls.
- R3 Logs never contain passwords, tokens, API keys, session ids, full card data, authorization headers, cookies or request bodies by default; a central redaction list removes known sensitive fields.
- R4 Personal data in logs is minimised: user ids rather than names or emails, and addresses only where needed for security.
- R5 Log levels are meaningful: expected user mistakes are not errors; unexpected faults carry the stack trace and context, server-side only (CORE F14).
- R6 Logs are kept for a stated period (default 30 days) and access is limited to those who need it.
- R7 Security events (failed sign-ins, permission denials, rate limits) are logged with the request id.

**Conditional**
- C1 IF logs go to an outside service THEN apply the redaction first and treat the service as a processor of the data.
- C2 IF a user quotes a request id THEN support can find all lines for it, including job lines.
- C3 IF a log line would include user-supplied text THEN encode it so it cannot forge new log lines.

**Suggest**
- S1 A trace view linking a request to its database and outside calls — shortens finding slow or failing steps.
- S2 Error grouping and alerting — repeated faults surface themselves.

**Approval**
- A1 Sending logs or error reports to an outside service (data leaves your system; may cost money).
- A2 Keeping logs with personal data beyond 30 days.

**Frontend contract**
- Error screens and toasts show the request id for server errors so users can quote it (FE-SHELL-06, FE-FEED-01).
- Screens never send logs containing user input to outside services without approval.

**Acceptance**
- [ ] Given any request, when the response is read, then it has a request id header and the matching log line exists.
- [ ] Given a sign-in with a wrong password, when logs are searched, then the password value is absent.
- [ ] Given a request that triggers a job, when the job runs, then its log lines include the originating request id.
- [ ] Given an input containing line breaks, when it is logged, then it cannot produce a fake log line.

**Exceptions**
- Debug-level body logging may be enabled temporarily in development with fake data only, never in production.

**Source:** OWASP ASVS 4.0.3 V7 Error Handling and Logging (standard); OWASP Logging Cheat Sheet (standard); structured logs with request id (convention)

## BE-OPS-03 · Health checks and monitoring

**Purpose:** Know the app is working before users complain, and know what to do when it is not.
**Triggers:** health check, uptime, monitoring, alerts, status page, readiness, liveness, downtime, error rate, metrics, ping
**Applies when:** the app is deployed for real users.
**Composes:** BE-JOB-01, BE-JOB-02, BE-DATA-05, BE-OPS-02, FE-SHELL-06

**Required**
- R1 A liveness endpoint reports the process is running without touching other systems; a readiness endpoint checks the database and other must-have dependencies.
- R2 Health responses reveal no versions, hostnames, settings or error details, or are restricted to the platform that polls them.
- R3 An external check calls a public health or key page at least every minute and alerts the owner on failure; the alert channel is tested.
- R4 These are measured and alerted: error rate, response time, failed jobs and dead letters, queue age, scheduled-task misses, backup failures, disk and memory near limits, expiring certificates.
- R5 Alerts go to a named person with a short plain note of what to do first; noisy alerts are tuned or removed.
- R6 During planned maintenance or dependency failure the app returns 503 with `Retry-After`, not a broken page.

**Conditional**
- C1 IF the app has a paid dependency (email, payment, storage) THEN monitor its failures separately.
- C2 IF users depend on the app for work THEN publish a status page.
- C3 IF a dependency is optional THEN the app reports degraded service rather than failing readiness.

**Suggest**
- S1 A simple weekly summary of uptime, errors and slow pages — the owner sees the trend without a dashboard.
- S2 Alert when sign-ups or key actions drop to zero — catches silent breakage no error shows.

**Approval**
- A1 Paid monitoring, paging or SMS alert services.
- A2 Putting a public status page up.

**Frontend contract**
- Screens show a friendly unavailable page for 503 and a retry (FE-SHELL-06).
- Screens show offline or degraded banners using the API's status, not guesses.

**Acceptance**
- [ ] Given the database down, when readiness is called, then it fails and liveness still passes.
- [ ] Given a health response, when its body is read, then it contains no version numbers, hostnames or secrets.
- [ ] Given the app stopped, when the external check runs, then an alert reaches the owner.
- [ ] Given maintenance mode, when any page is requested, then the response is 503 with `Retry-After`.

**Exceptions**
- A tiny internal tool used by one person may rely on the host's built-in restart and one external check.

**Source:** OWASP ASVS 4.0.3 V7 (standard); RFC 9110 on 503 and `Retry-After` (standard); liveness and readiness probes and alerting practice (convention)

## BE-OPS-04 · Rate limiting and abuse protection

**Purpose:** Stop guessing attacks, scraping and runaway clients from overwhelming the app or the owner's bill.
**Triggers:** rate limit, throttle, 429, too many requests, brute force, abuse, bot, captcha, spam, Retry-After, denial of service
**Applies when:** the app is reachable from the internet.
**Composes:** BE-API-02, BE-AUTH-01, BE-AUTH-04, BE-AUTH-07, FE-FEED-01

**Required**
- R1 A general limit applies per signed-in user or key, and per source address for anonymous requests, with a sensible default (e.g. 100 requests per minute).
- R2 Stricter limits protect sign-in, sign-up, password reset, token checks, search, file uploads, invitations and email-sending actions.
- R3 Exceeding a limit returns 429 Too Many Requests (RFC 6585) with a `Retry-After` header and a problem-details body (BE-API-02); the limit state never reveals account existence.
- R4 Counters live in a store shared by all app instances, and the client address is read only from the trusted proxy's header.
- R5 Request body size, request time and concurrent connections are capped, so one request cannot hold the server.
- R6 Limit events are logged (BE-OPS-02) and repeated abuse raises an alert.

**Conditional**
- C1 IF the API is used by programs THEN document limits and return remaining-quota headers.
- C2 IF a form can be abused by bots (sign-up, contact) THEN add a challenge step or a hidden-field trap before any account or message is created.
- C3 IF costs per request are high (email, AI, media) THEN apply a daily per-user quota in addition to the rate limit.

**Suggest**
- S1 Temporary blocking of addresses with repeated abuse — slows persistent attackers.
- S2 A bot challenge only after suspicious behaviour — real people are rarely bothered.

**Approval**
- A1 Adding a third-party bot-check service (privacy and cost).
- A2 Blocking regions or address ranges (can block real users).
- A3 Paid protection services in front of the app.

**Frontend contract**
- On 429 the screen shows "Too many attempts, try again in N seconds" using `Retry-After`, keeps user input, and re-enables the control afterward (FE-FEED-01, CORE F8).
- Screens avoid automatic fast retries on 429 and back off.

**Acceptance**
- [ ] Given the sign-in limit exceeded, when another attempt is made, then the response is 429 with `Retry-After`.
- [ ] Given two app instances, when a client alternates between them, then the limit still counts across both.
- [ ] Given a spoofed client-address header from an untrusted source, when sent, then it is ignored for limiting.
- [ ] Given the limit window passing, when the client retries, then it succeeds.

**Exceptions**
- Internal tools reachable only through a private network may use looser limits, but keep R2 for sign-in.

**Source:** RFC 6585 429 Too Many Requests; RFC 9110 Retry-After (standard); OWASP ASVS 4.0.3 V11 Business Logic and V2.2 (standard); OWASP API Security Top 10 unrestricted resource consumption (standard)

## BE-OPS-05 · Browser security: headers, CORS, CSRF

**Purpose:** Use the browser's built-in protections so other websites and injected scripts cannot act as the user.
**Triggers:** security headers, CORS, CSRF, cross-site, CSP, HSTS, clickjacking, XSS, cookies, same-site, HTTPS, origin, content security policy
**Applies when:** the app is used through a web browser.
**Composes:** BE-AUTH-02, BE-API-03, BE-OPS-02, FE-SHELL-06

**Required**
- R1 The app is served only over HTTPS; HTTP redirects to HTTPS and `Strict-Transport-Security` is sent.
- R2 Responses carry `Content-Security-Policy` (no unsafe inline script without a nonce or hash), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, a framing rule (`frame-ancestors` or `X-Frame-Options`), and `Permissions-Policy` for unused features.
- R3 CORS allows only an explicit list of exact origins; a wildcard is never combined with credentials, and the origin is never reflected back unchecked.
- R4 Requests that change data and rely on cookies are protected against CSRF: SameSite cookies plus an anti-forgery token, or a required custom header with an Origin and Referer check; GET never changes data.
- R5 User-supplied content is encoded for the place it is shown, and rich text is sanitised (BE-API-03).
- R6 Cookies follow BE-AUTH-02; cookies are scoped to the narrowest host and path that works.
- R7 Error and redirect responses do not leak internal addresses, and redirects only go to a fixed list of destinations.

**Conditional**
- C1 IF an embeddable widget or iframe is offered THEN allow framing only for named origins.
- C2 IF third-party scripts are used (analytics, chat, fonts) THEN list their origins in the policy and load only approved ones.
- C3 IF the API is called by other origins THEN rely on tokens in headers and keep cookie-based endpoints same-origin.

**Suggest**
- S1 Report-only mode for a new content policy first — breaks nothing while you learn what it blocks.
- S2 Subresource integrity for external scripts — a tampered file will not run.
- S3 Preload for HSTS once stable — first visits are protected too.

**Approval**
- A1 Loosening the content policy or CORS list to include third-party sites.
- A2 Adding third-party scripts, ads or trackers.

**Frontend contract**
- Screens send the anti-forgery token or header on every changing request and handle its expiry by refreshing and retrying once.
- Screens do not use inline scripts or event attributes that the policy blocks, and avoid injecting raw HTML.

**Acceptance**
- [ ] Given a page response, when its headers are read, then CSP, nosniff, framing and referrer headers are present.
- [ ] Given a request from an origin not on the list, when it is made with credentials, then no `Access-Control-Allow-Origin` is returned.
- [ ] Given a state-changing request without the anti-forgery token or header, when sent with a valid cookie, then it is rejected.
- [ ] Given an HTTP request, when received, then it is redirected to HTTPS.

**Exceptions**
- Local development may use HTTP and relaxed headers, never beyond the developer's machine.

**Source:** OWASP ASVS 4.0.3 V14 and V13 (standard); OWASP CSRF Prevention, HTTP Headers and CORS cheat sheets (standard); RFC 6797 HSTS (standard)

## BE-OPS-06 · Privacy: export and erasure

**Purpose:** Let people see, take with them, and remove their own data, and keep the owner on the right side of privacy law.
**Triggers:** privacy, GDPR, export my data, delete my account, erasure, right to be forgotten, data portability, retention, personal data, data request, DSAR
**Applies when:** the app stores personal data about people, especially in the EU, UK or California.
**Composes:** BE-DATA-03, BE-DATA-04, BE-DATA-05, BE-FILE-02, BE-JOB-01, FE-ACCT-06

**Required**
- R1 A signed-in user can request an export of their data (GDPR Art. 15 and 20) in a common machine-readable format (JSON or CSV plus their files), produced as a job and delivered by a short-lived, permission-checked link.
- R2 The export covers everything held about the user, including data in related tables and files, and excludes other people's private data.
- R3 Export and erasure require recent re-authentication, and the user is notified by email that the request was made.
- R4 A user can request account erasure (GDPR Art. 17); it starts with a grace period (default 14 days) in which the user can cancel it with an explicit action (signing in alone never cancels it), then runs as a job.
- R5 Erasure removes or anonymises personal data in the database, files, search index and caches, and tells integrated processors (BE-JOB-05) to do the same; shared content others rely on is transferred, anonymised, or handled by an explicit rule.
- R6 Backups age out by their stated retention; the privacy notice states this period and restored data is re-erased afterwards.
- R7 Legal holds and legally required records (invoices) are kept minimal and separated; the user is told what remains and why.

**Conditional**
- C1 IF the user is the sole owner of an organisation THEN require them to transfer ownership or delete the organisation first.
- C2 IF the app is used by children THEN apply extra rules and approvals before any collection.
- C3 IF personal data is sent outside the user's region THEN document it and obtain approval first.

**Suggest**
- S1 A page listing what the app stores about each person — builds trust and makes requests easier to answer.
- S2 Automatic deletion of inactive accounts after a long period — less data held, less risk.
- S3 Let users correct their own data in settings — the simplest answer to rectification requests.

**Approval**
- A1 Erasing immediately with no grace period, or keeping a person's data after erasure for any reason other than R7.
- A2 Setting retention periods that touch legal duties.
- A3 Sending personal data to a third party or another country.
- A4 Third-party analytics or advertising that tracks people.

**Frontend contract**
- Account settings offers "Download my data" and "Delete my account" with a plain explanation of what happens and when (FE-ACCT-06).
- The export shows progress and then a download; deletion shows the grace period and a cancel option (FE-FEED-04).

**Acceptance**
- [ ] Given an export request, when it completes, then the file contains the user's records and files, and none of another user's private data.
- [ ] Given an erasure request, when the grace period ends, then the user's personal data is gone from the database, files and search, and a minimal audit marker remains.
- [ ] Given a user who signs in during the grace period, when they do so, then they see the scheduled deletion date and the erasure stays scheduled until they choose to cancel it.
- [ ] Given an export link, when it is used after its expiry or by another user, then it fails.

**Exceptions**
- Apps holding no personal data (anonymous public tools) have nothing to export; confirm this in the coverage sheet.

**Source:** GDPR Art. 15, 17 and 20 (standard); OWASP ASVS 4.0.3 V8 Data Protection (standard); grace-period deletion and signed expiring export links (convention)

## BE-OPS-07 · Environments and deployment

**Purpose:** Release changes in a repeatable way that can be undone, without touching real users' data while testing.
**Triggers:** deployment, environments, staging, production, release, rollback, CI, CD, hosting, domain, go live, zero downtime, build
**Applies when:** the app runs anywhere other than one developer's machine.
**Composes:** BE-OPS-01, BE-DATA-02, BE-DATA-05, BE-OPS-03, BE-DATA-06

**Required**
- R1 At least a development and a production environment exist; each has its own database, storage, secrets and addresses, and nothing is shared between them (BE-OPS-01).
- R2 Deployment is a repeatable script or pipeline run from the repository, not manual steps; the same built artifact is promoted between environments.
- R3 Automated checks (tests, build, validation) run before a release is allowed to reach production.
- R4 Database migrations run as a defined step with a backup first for destructive changes (BE-DATA-02, BE-DATA-05).
- R5 After a deploy a health check confirms the app is up (BE-OPS-03); failure stops the rollout or reverts it.
- R6 A rollback to the previous release is written down and was tried, including the database consequence.
- R7 Production data never goes to other environments unless anonymised (BE-DATA-06); non-production environments are visibly labelled and cannot send real emails or payments.

**Conditional**
- C1 IF the owner has real users THEN add a staging environment that matches production.
- C2 IF downtime must be avoided THEN use rolling or blue-green releases with expand-and-contract migrations.
- C3 IF a custom domain is used THEN HTTPS certificates renew automatically and expiry is monitored.

**Suggest**
- S1 A short release note per deploy — everyone knows what changed and when.
- S2 A one-page "how to deploy and roll back" for the owner — nobody depends on one person's memory.
- S3 Preview environments for each change — review without risk.

**Approval**
- A1 Choosing a hosting provider or paid plan.
- A2 Hosting in a region or country other than the users' (privacy law and speed).
- A3 Deploying to production or pointing the live domain at a new system.

**Frontend contract**
- Non-production builds show an environment label so no one mistakes them for the real app.
- The screen handles a new release by prompting a reload when the API version changes (BE-API-08).

**Acceptance**
- [ ] Given a clean checkout, when the deploy script runs, then the same steps produce a running app with no manual changes.
- [ ] Given a failing test, when a release is attempted, then it does not reach production.
- [ ] Given a failed post-deploy health check, when it happens, then the release is stopped or rolled back automatically.
- [ ] Given staging, when it sends email, then messages go only to a safe test inbox.

**Exceptions**
- A personal prototype may run in one environment until real users exist; the production secrets and backup rules still apply from the first real data.

**Source:** OWASP ASVS 4.0.3 V14 Configuration (standard); twelve-factor app on dev and prod parity and one codebase (convention); roll-forward and rollback runbooks (convention)
