# FE-CLOUD · Cloud operations console

Load only when a person can view or control cloud projects, virtual machines, GPUs, deployments or cloud costs from the app.

## FE-CLOUD-01 · Cloud resource dashboard and controls

**Purpose:** Make remote compute and deployment status understandable before the owner starts a resource that can cost money.
**Triggers:** cloud dashboard, VM dashboard, GPU instance, start server, stop server, deploy status, cloud resources, AWS console, Google Cloud console
**Applies when:** this app exposes controls for real cloud resources; it does not apply merely because the app is hosted in a cloud.
**Composes:** FE-COST-01, FE-FEED-02, FE-FEED-04, BE-CLOUD-01, BE-CLOUD-02

**Required**
- R1 Show provider, project/account, region, resource type, current state and last update time together.
- R2 Before start or scale-up, show the selected machine/GPU, estimated hourly cost and any storage/network costs available; require a separate cost-labelled confirmation.
- R3 While an operation runs, show progress and current step; prevent duplicate start, stop or deploy actions while the operation is pending.
- R4 Show partial and failed states per resource, with a safe retry path and a copyable operation id; never show success based only on a request being accepted.
- R5 Stopping a resource says what will persist (disk, IP, data) and what stops; deleting says what is permanently removed and needs explicit confirmation.
- R6 Secrets, private keys and full credentials are never rendered in the dashboard; show only safe identifiers or a masked hint.
- R7 Make the active environment obvious (development, staging, production) and visually distinct before any change.

**Conditional**
- C1 IF a resource can incur charges while idle THEN show an idle-timeout or scheduled-stop setting before creation.
- C2 IF the dashboard can change production resources THEN require a second confirmation naming the resource and consequence.
- C3 IF the provider cannot return a reliable price estimate THEN say so and require the configured spending cap or explicit maximum-cost acknowledgement.

**Suggest**
- S1 A cost-by-project history — helps the owner see which experiments used the budget.
- S2 A one-click stop-all for non-production resources — makes it easier to end a work session.

**Approval**
- A1 Creating a paid resource, changing its size, opening a public network port, or deleting persistent storage — can create cost, expose a service or destroy data.
- A2 Automatic scaling or scheduled starts — can create charges while the owner is away.

**Backend contract**
- Use provider APIs through a least-privilege service; every mutation is auditable and idempotent, with an operation id the screen can poll (BE-CLOUD-01, BE-CLOUD-02).

**Acceptance**
- [ ] Given a VM is stopped, when Start is offered, then the selected type, region and estimated hourly cost are visible before confirmation.
- [ ] Given the request is accepted but the VM is still provisioning, when the dashboard refreshes, then it shows Pending rather than Running.
- [ ] Given the owner stops a VM, when the action is confirmed, then the interface states whether its disk and data persist.
- [ ] Given a production resource is selected, when a destructive change is prepared, then the environment and resource identity are repeated in the confirmation.

**Exceptions**
- A read-only status dashboard does not need mutation confirmations, but still identifies provider, project, environment and update time.

**Source:** least-privilege cloud IAM (standard); cloud resource billing and lifecycle guidance (provider-specific); cost-visible mutation confirmation (proposal)
