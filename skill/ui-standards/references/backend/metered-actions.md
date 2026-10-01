# BE-COST · Paid and metered operations

Load when a user action spends money, consumes credits, or uses a limited provider quota.

## BE-COST-01 · Safe paid-call execution and ledger

**Purpose:** Prevent duplicate charges and leave a trustworthy record of what the app asked a paid provider to do.
**Triggers:** paid API, metered service, credit balance, usage ledger, double charge, retry, idempotency, cost tracking
**Applies when:** an operation can incur a provider charge or consume a limited quota.
**Composes:** FE-COST-01

**Required**
- R1 Hosted apps keep provider credentials in a server secret store. A desktop app may store an owner-supplied key in the OS credential store, but must explain that anyone controlling the device can extract it; never ship the developer's shared provider key inside a desktop binary, source, logs or browser bundle (CORE F12).
- R2 Persist an operation id, user confirmation, input scope, estimate, provider, idempotency key and pending status before dispatch.
- R3 Make each operation idempotent at the app boundary; use provider idempotency where available and store the provider operation id returned.
- R4 On timeout or connection loss, mark outcome unknown and reconcile with the provider before retry; if reconciliation is impossible, ask the owner before another call.
- R5 Record actual cost/credits when available, timestamp, outcome and safe input reference; never store full sensitive input by default.
- R6 Enforce configured per-operation and cumulative limits before dispatch; stop before the next billable unit when a limit is reached.

**Conditional**
- C1 IF the provider offers a no-charge estimate endpoint THEN call it before confirmation and label it as an estimate.
- C2 IF the owner configures a monthly or project budget THEN warn before the budget is reached and block new work at the limit.
- C3 IF provider credentials are entered by the owner THEN validate them without making a billable request where possible and explain where they are stored.

**Suggest**
- S1 A monthly usage summary — helps the owner spot rising costs.
- S2 An exportable call ledger — makes invoices and project costs easier to reconcile.

**Approval**
- A1 Sending provider input to a new service or region — may expose private material or incur new charges.
- A2 Automatically retrying a call when the provider cannot guarantee idempotency or reveal whether it completed — may charge twice.

**Frontend contract**
- Follow FE-COST-01 for estimate, separate confirmation, progress, stop behaviour and actual cost.

**Acceptance**
- [ ] Given an operation is confirmed, when dispatch begins, then its durable ledger row already exists with the confirmation and idempotency key.
- [ ] Given the same operation is submitted twice, when both requests arrive, then at most one provider operation is created.
- [ ] Given the provider times out after accepting work, when the app recovers, then it reconciles before retrying or asks the owner.
- [ ] Given the configured budget is exhausted, when another operation is requested, then it is blocked before provider dispatch.

**Exceptions**
- Free, unlimited services still need secret handling but do not need a cost confirmation or budget.

**Source:** Idempotency-Key usage in payment APIs and provider-specific billing/retry guarantees (convention); Idempotency-Key HTTP header Internet-Draft (expired; proposal); spend ledger (proposal)
