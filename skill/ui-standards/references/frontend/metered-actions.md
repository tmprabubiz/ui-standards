# FE-COST · Paid and metered actions

Load whenever an action may spend money, consume credits, or use a limited external quota.

## FE-COST-01 · Confirm a paid or metered action

**Purpose:** Prevent surprise charges and accidental repeat calls while making the price clear before work starts.
**Triggers:** paid API, cost per call, credits, quota, metered, usage-based billing, token cost, charge, spend, double confirmation, dry run
**Applies when:** one user action may incur a provider charge or consume a limited allowance.
**Composes:** FE-FEED-03, FE-FEED-04, BE-COST-01

**Required**
- R1 Before the call, show the service, input scope, estimated cost or credits, and what changes if it runs; say when the estimate may differ.
- R2 Use two deliberate steps: first show the estimate/preview, then require a separate action labelled with the cost (for example, "Run transcription · about $0.12"). No destructive or paid call starts from merely opening a screen.
- R3 Disable repeat submission while pending; after a timeout, show whether the result is unknown and reconcile the task ledger before offering Retry.
- R4 Show progress and the final outcome, including actual cost or credits when the provider reports them; if cost is unavailable, say so.
- R5 Offer a no-charge dry run when the provider or operation can estimate the work without performing the paid action.
- R6 The owner can set a per-run limit and a stop/cancel rule before starting when the provider supports it.

**Conditional**
- C1 IF the price cannot be estimated before the call THEN show the maximum possible charge or explain that no reliable bound exists, and ask for explicit confirmation each run.
- C2 IF a task processes multiple items THEN show the item count and maximum estimated total before confirmation.
- C3 IF cancellation cannot stop provider billing THEN say this before the call and clarify that stopping only prevents further work.
- C4 IF the provider requires a choice such as language or voice THEN do not silently choose one; require the owner to select it or explicitly choose the provider's auto-detect option before Run is enabled.

**Suggest**
- S1 A monthly spending or credit limit — prevents cumulative usage from surprising the owner.
- S2 A preview of the exact text or files sent to the provider — lets the owner check privacy and input scope.

**Approval**
- A1 Automatically run paid calls in the background or on a schedule — charges can happen without the owner present.
- A2 Retry an uncertain paid call without checking its idempotency or provider status — could charge twice.

**Backend contract**
- Create a durable operation record before dispatch, use an idempotency key, and reconcile unknown outcomes before retry (BE-COST-01, BE-API-06).

**Acceptance**
- [ ] Given an operation may cost money, when its details are shown, then the user sees provider, scope, estimate or uncertainty, and a separate cost-labelled confirm action.
- [ ] Given the user double-clicks confirm, when the operation is pending, then only one billable provider operation is created.
- [ ] Given a timeout leaves the outcome unknown, when the user returns, then the app checks the operation record before enabling a retry.
- [ ] Given a dry run is supported, when it completes, then no billable provider call was made.

**Exceptions**
- Free operations with no metered quota do not use a paid confirmation step.

**Source:** informed consent for costs and Idempotency-Key usage in payment APIs (convention); Idempotency-Key HTTP header Internet-Draft (expired; proposal); spend guard (proposal)
