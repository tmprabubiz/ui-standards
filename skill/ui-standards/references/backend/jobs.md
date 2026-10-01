# BE-JOB · Jobs, messages and webhooks

Work that happens outside a single request: background jobs, schedules, email, notifications and webhooks in both directions. Load whenever something runs later, repeatedly, or talks to another system.

## BE-JOB-01 · Background jobs and retries

**Purpose:** Run slow or fallible work out of sight, and make sure it finishes once, even when parts of it fail.
**Triggers:** background job, queue, worker, async task, retry, backoff, dead letter, failed job, long running, processing, deferred work
**Applies when:** work takes longer than a request should, depends on outside services, or must survive restarts.
**Composes:** BE-API-06, BE-OPS-02, BE-OPS-03, FE-FEED-04

**Required**
- R1 Jobs are stored durably (database or queue service) so a restart loses nothing; enqueueing happens in the same transaction as the change that needs it, or via an outbox, so a job is never lost or created for rolled-back data.
- R2 Each job has a type, payload (ids, not whole records or secrets), attempt count, status (`queued`, `running`, `succeeded`, `failed`, `dead`) and timestamps.
- R3 Failures retry with exponential backoff and random jitter up to a maximum number of attempts (default 5); errors that can never succeed (bad input, missing permission) are not retried.
- R4 After the last attempt the job moves to a dead-letter state kept for inspection, with the last error, and raises an alert (BE-OPS-03).
- R5 Handlers are idempotent: running a job twice produces the same result (use the job id or a business key, see BE-API-06 for the pattern).
- R6 Each job has a timeout; a stuck job is recovered and retried; two workers never run the same job at the same time.
- R7 Jobs log their id, type and outcome with the request id of the action that created them (BE-OPS-02).

**Conditional**
- C1 IF a screen waits for the result THEN expose the job status through the API and report progress (FE-FEED-04).
- C2 IF a job's order matters THEN serialise by key, so jobs for the same record run in order.
- C3 IF a job calls an outside provider THEN respect that provider's rate limits and `Retry-After`.

**Suggest**
- S1 An admin view of failed jobs with retry and discard — lets non-developers recover from problems.
- S2 Separate queues for urgent and bulk work — password emails are not delayed by a big import.

**Approval**
- A1 Adding a paid queue or worker service.
- A2 Jobs that spend money or send messages to many people automatically.

**Frontend contract**
- Screens start long work with an endpoint that answers 202 plus a status address, then show progress, done or failed (FE-FEED-04).
- Screens tolerate "still processing" and offer to be notified instead of blocking.

**Acceptance**
- [ ] Given a job that fails twice then succeeds, when run, then it succeeds on attempt 3 with growing delays between attempts.
- [ ] Given a job that fails on every attempt, when the maximum is reached, then it is `dead` with the last error and an alert is sent.
- [ ] Given the same job delivered twice, when both run, then the effect happens once.
- [ ] Given the server restarting mid-queue, when it is back, then queued jobs still run.

**Exceptions**
- Work that is quick and failure of the request is acceptable (a simple read) does not need a job.

**Source:** exponential backoff with jitter, dead-letter queues, transactional outbox (convention); OWASP Logging Cheat Sheet (standard)

## BE-JOB-02 · Scheduled tasks

**Purpose:** Run recurring housekeeping and reminders reliably at the right time, exactly once, with a clear record.
**Triggers:** scheduled task, cron, recurring job, nightly, daily digest, reminder, cleanup, purge, periodic, timer, expire
**Applies when:** something must happen on a schedule (cleanup, reports, reminders, renewals).
**Composes:** BE-JOB-01, BE-OPS-03, BE-DATA-03, FE-ACCT-04

**Required**
- R1 Schedules are defined in one place in code or configuration, in UTC (CORE D1); user-facing times are converted using the user's time zone.
- R2 A task runs once per due time even when several app instances are running (a lock or a leader), and a run that overlaps its previous one is skipped or queued.
- R3 Each scheduled task creates ordinary jobs (BE-JOB-01) rather than doing long work inline.
- R4 Each run records start, end, outcome and counts of items handled; the last success time is visible.
- R5 A task that has not succeeded within its expected interval raises an alert (BE-OPS-03).
- R6 Missed runs (app down at the time) have a stated policy: run once on return, or skip.
- R7 Tasks are idempotent and safe to run twice.

**Conditional**
- C1 IF users set their own times (daily digest at 8:00) THEN store their time zone and handle daylight-saving changes, including skipped and repeated hours.
- C2 IF a task deletes data THEN follow the retention rules in BE-DATA-03 and log the counts.
- C3 IF a task sends messages THEN apply BE-JOB-03 or BE-JOB-04 rules, including preferences.

**Suggest**
- S1 A page showing each task, its last and next run — lets the owner see the app is healthy.
- S2 A "run now" button for administrators — helps with testing and recovery.

**Approval**
- A1 New tasks that email, charge or delete automatically in bulk, beyond those another entry already requires (such as the BE-DATA-03 purge).
- A2 Adding a paid scheduler service.

**Frontend contract**
- Where users control a schedule, settings shows next run time in their time zone and lets them change or pause it (FE-ACCT-04).

**Acceptance**
- [ ] Given three running instances, when a task's time arrives, then it runs once.
- [ ] Given the app was down at the scheduled time, when it restarts, then the stated missed-run policy is followed.
- [ ] Given a task that fails, when its expected interval passes without success, then an alert is raised.
- [ ] Given a user in a daylight-saving zone, when the clocks change, then their 8:00 digest still arrives at 8:00 local time.

**Exceptions**
- Apps with no recurring work need no scheduler; do not add one.

**Source:** cron-style scheduling with locks and run records (convention); RFC 3339 time handling for UTC (standard); idempotent scheduled tasks (proposal)

## BE-JOB-03 · Transactional email

**Purpose:** Get the emails the app must send to people's inboxes, and keep non-essential email within what they agreed to.
**Triggers:** email, send email, transactional email, welcome email, receipt, notification email, unsubscribe, bounce, SMTP, email template, deliverability
**Applies when:** the app sends email to its users.
**Composes:** BE-JOB-01, BE-JOB-04, BE-OPS-01, BE-OPS-02, FE-ACCT-04

**Required**
- R1 Email is sent through a transactional email provider via a background job (BE-JOB-01), never inside the user's request.
- R2 The sending domain is authenticated (SPF, DKIM, DMARC) and uses a stable "from" address on the app's own domain.
- R3 Templates live in the repository, have a plain-text and a HTML version, use translated strings (CORE D4), and take only safe, escaped data.
- R4 Emails are classed as essential (account, security, receipts) or non-essential (tips, updates, marketing); essential mail carries no marketing content.
- R5 Non-essential email includes a visible unsubscribe link and the standard one-click unsubscribe headers (RFC 8058, RFC 2369); an unsubscribe takes effect before the next send.
- R6 Bounces and spam complaints from the provider are received (BE-JOB-06) and the address is suppressed; suppressed addresses are never mailed again without fresh confirmation.
- R7 Each send is recorded (recipient, template, status, provider message id) without storing secret tokens in the record.

**Conditional**
- C1 IF an email contains a link with a token THEN follow BE-AUTH-04 and keep the token out of logs.
- C2 IF the app sends in several languages THEN pick the template from the user's saved language.
- C3 IF the volume is high THEN throttle to the provider's limits and keep urgent mail ahead of bulk mail.

**Suggest**
- S1 Send emails from a staging mode that delivers to a safe test inbox only — avoids accidental emails to real people while testing.
- S2 A preview page for each template — lets the owner check wording and design.
- S3 A reply-to address someone reads — people can answer.

**Approval**
- A1 Sending any marketing or non-essential email (consent rules apply, such as GDPR and ePrivacy).
- A2 Choosing or paying for an email provider.
- A3 Changing the domain's DNS records for sending.

**Frontend contract**
- Settings shows email preferences and an unsubscribe page that works without signing in (FE-ACCT-04).
- Screens tell the user an email was sent ("Check your inbox") and offer resend with a cool-down.

**Acceptance**
- [ ] Given a non-essential email, when it is rendered, then it includes an unsubscribe link and the list-unsubscribe headers.
- [ ] Given a hard bounce, when the provider reports it, then the address is suppressed and a later send to it is skipped.
- [ ] Given a failed send, when the provider is down, then the job retries with backoff and the user's request has already completed.
- [ ] Given the template, when it is sent, then both a plain-text and a HTML part are present.

**Exceptions**
- Internal tools mailing only staff addresses need no unsubscribe, but keep R1, R2 and R6.

**Source:** RFC 8058 one-click unsubscribe and RFC 2369 list headers (standard); SPF, DKIM and DMARC email authentication (standard); essential vs marketing classification (convention)

## BE-JOB-04 · Notification delivery

**Purpose:** Tell people about things that matter on the channel they chose, without overwhelming them.
**Triggers:** notifications, push notification, in-app notification, email digest, notification preferences, mute, unread count, batching, alerts, bell icon
**Applies when:** the app tells users about events (mentions, updates, reminders, completions).
**Composes:** BE-JOB-01, BE-JOB-02, BE-JOB-03, FE-FEED-05, FE-ACCT-04

**Required**
- R1 Events create one notification record per recipient with type, target, text keys, created time, and read time; the in-app list is its own source of truth (FE-FEED-05).
- R2 Delivery to other channels (email, push) is decided from each user's preferences per type and channel, with sensible defaults; unknown types default to in-app only.
- R3 Security and account notices (sign-in alert, password change) cannot be turned off, and are sent regardless of marketing settings.
- R4 A user never receives a notification for an action they did themselves, or for something they cannot access (CORE F11).
- R5 Similar events within a short window are batched or merged ("5 new comments") and digests respect the user's time zone.
- R6 Duplicate notifications for the same event and recipient are prevented (key on event id and recipient).
- R7 Read state, unread count, mark-all-read and delete work per user and persist across devices.

**Conditional**
- C1 IF push is offered THEN get the user's opt-in first, store tokens per device, and remove tokens the provider reports invalid.
- C2 IF email is a channel THEN apply BE-JOB-03, including unsubscribe and bounce handling.
- C3 IF the user disables a type THEN stop it on the next event and show the current setting in settings.

**Suggest**
- S1 Quiet hours — people are not woken at night.
- S2 A daily digest option — fewer interruptions for busy users.
- S3 One-tap "turn off this kind of notification" in each message — less frustration and fewer unsubscribes.

**Approval**
- A1 Adding push or SMS providers (cost per message and data shared).
- A2 Sending reminders automatically to people other than the user themselves.

**Frontend contract**
- The notification centre lists items with unread count, mark read, mark all read and links to the target (FE-FEED-05).
- Settings offers a type-by-channel table with explanations (FE-ACCT-04).

**Acceptance**
- [ ] Given an event with three recipients, when it is created, then three notification records exist and the actor has none.
- [ ] Given a user who turned off email for mentions, when they are mentioned, then an in-app item exists and no email is sent.
- [ ] Given 5 similar events within the window, when delivered, then one batched notification is sent.
- [ ] Given a push token reported invalid, when the next send happens, then the token is removed.

**Exceptions**
- Apps with no events to report to users do not need notifications.

**Source:** notification centre with per-channel preferences, batching and digests (convention); GDPR and ePrivacy consent for non-essential messages (standard)

## BE-JOB-05 · Outgoing webhooks

**Purpose:** Let other systems learn about events in the app, safely and reliably.
**Triggers:** webhook, outgoing webhook, event subscription, callback URL, notify external system, webhook secret, delivery log, integration events
**Applies when:** the app sends HTTP calls to addresses its users or owner configure.
**Composes:** BE-JOB-01, BE-AUTH-05, BE-OPS-01, BE-OPS-04, FE-ACCT-04

**Required**
- R1 Each subscription has a target address (HTTPS only), a chosen set of event types, an owner, and its own secret generated by the server and shown once.
- R2 Each delivery is signed following the Standard Webhooks scheme (an id, a timestamp and an HMAC signature in headers) so receivers can verify origin and reject replays.
- R3 The payload has a stable shape: event id, type, time (UTC) and data containing only what the subscriber is allowed to see (CORE F11); it has a version.
- R4 Deliveries run as jobs: short timeout, retries with exponential backoff over many hours (BE-JOB-01); any 2xx is success; others are retried.
- R5 Every attempt is stored in a delivery log (time, status code, duration, response excerpt) viewable by the subscription owner.
- R6 Subscriptions that fail continuously (for example for several days) are disabled and the owner is told.
- R7 Target addresses are checked against server-side request forgery: private, loopback and link-local addresses are refused, redirects are not followed blindly, and the address is re-checked at send time.

**Conditional**
- C1 IF the owner rotates a secret THEN accept both old and new for a short overlap.
- C2 IF an event must be resent THEN offer a manual replay of the same event id.
- C3 IF events are ordered-sensitive THEN include a sequence or timestamp so receivers can order them.

**Suggest**
- S1 A "send test event" button — owners check the connection before relying on it.
- S2 An event catalogue page with example payloads — saves integrators time.

**Approval**
- A1 Sending app data to addresses the owner does not control.
- A2 Including personal data in payloads.

**Frontend contract**
- Settings lets owners add and remove endpoints, choose events, view the secret once, send a test, and read the delivery log (FE-ACCT-04).
- Disabled subscriptions show a clear reason and a re-enable action.

**Acceptance**
- [ ] Given a delivery, when its headers are inspected, then it carries an id, timestamp and valid signature computed with the subscription secret.
- [ ] Given a target that returns 500 twice then 200, when delivered, then the log shows three attempts with growing gaps and a final success.
- [ ] Given a target address of a private network IP, when saved, then it is rejected.
- [ ] Given a subscription failing for the disable period, when the period passes, then it is disabled and the owner is notified.

**Exceptions**
- Apps with no integrations do not need outgoing webhooks.

**Source:** Standard Webhooks specification (standard); OWASP SSRF Prevention Cheat Sheet (standard); delivery log with replay (convention)

## BE-JOB-06 · Incoming webhooks

**Purpose:** Receive events from outside services (payments, email, sign-in) without being fooled by fakes or processing the same event twice.
**Triggers:** incoming webhook, webhook receiver, provider callback, payment webhook, signature verification, event handler, bounce webhook, replay attack
**Applies when:** an outside service calls an address of the app to report events.
**Composes:** BE-JOB-01, BE-JOB-03, BE-OPS-01, BE-OPS-04, BE-API-06

**Required**
- R1 The signature is verified on the raw request body with the provider's secret from configuration (CORE F12) using a constant-time comparison, before anything is parsed or trusted.
- R2 The timestamp is checked against a tolerance (default 5 minutes) to reject replays, where the provider supplies one.
- R3 The event id is stored on receipt; an id seen before is acknowledged and not processed again.
- R4 The endpoint answers 2xx quickly after storing the event, and the real work runs as a job (BE-JOB-01); bad signatures get 401 and are logged without the body.
- R5 Handlers check current truth: for money or status events fetch the object from the provider or compare versions instead of trusting the payload alone.
- R6 Unknown event types are acknowledged with 2xx and ignored; the handler never fails the delivery for an event it does not need.
- R7 The endpoint is the only unauthenticated route this provider needs, is rate limited, and has a body size limit (BE-OPS-04).

**Conditional**
- C1 IF the provider sends events out of order THEN handlers compare event time or version before applying changes.
- C2 IF the provider rotates secrets THEN accept both for the overlap.
- C3 IF processing fails permanently THEN keep the stored event for manual replay.

**Suggest**
- S1 A page listing received events with status and a replay button — lets owners recover from outages without developers.
- S2 Daily reconciliation against the provider — catches events that never arrived.

**Approval**
- A1 Connecting a new outside service to the app (what data it sees and sends, and its cost).
- A2 Letting an event trigger refunds, deletions or other irreversible actions automatically.

**Frontend contract**
- None.

**Acceptance**
- [ ] Given a request with an invalid signature, when received, then the response is 401 and no event is stored or processed.
- [ ] Given the same event id delivered twice, when both arrive, then the effect happens once and both get 2xx.
- [ ] Given a valid event, when received, then the response returns before the handler's work completes and the work later runs as a job.
- [ ] Given a request with a timestamp older than the tolerance, when received, then it is rejected.

**Exceptions**
- Apps that poll an outside service instead of receiving webhooks need none of this; treat the polled data with the same idempotency rules.

**Source:** Standard Webhooks specification (standard); OWASP ASVS 4.0.3 V13 API and Web Service (standard); respond fast then queue, event-id dedupe (convention)
