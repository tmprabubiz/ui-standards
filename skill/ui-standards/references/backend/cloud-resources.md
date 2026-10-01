# BE-CLOUD · Cloud accounts and compute

Load only when an app or its owner workflow provisions or manages cloud accounts, VMs, GPUs, storage or networks.

## BE-CLOUD-01 · Cloud account, region and cost guardrails

**Purpose:** Make cloud choices explicit and keep credentials, access and spending under the owner's control.
**Triggers:** cloud provider, AWS, Google Cloud, GCP, project, account, region, IAM, budget, GPU cost, cloud VM, cloud account
**Applies when:** the app or its build/deploy workflow creates or changes cloud resources.
**Composes:** BE-COST-01, BE-OPS-01, BE-OPS-02

**Required**
- R1 Name the provider account/project, environment, region and owner before creating a resource; never silently use a personal or production account.
- R2 Use a dedicated least-privilege identity for automation; never ask an agent to print credentials or put keys in source, images, logs or committed config.
- R3 Show estimated recurring and one-time costs for compute, disks, snapshots, IP addresses, registry and network egress where available; record the estimate and budget cap.
- R4 Set spending/usage alerts before a paid GPU or VM is started; where hard caps are unavailable, explain that an alert does not stop charges.
- R5 Separate development and production projects/accounts or equivalent boundaries; prohibit test workflows from changing production by default.
- R6 Log who requested each resource change, what changed, operation id and outcome without logging credentials.

**Conditional**
- C1 IF a GPU type or region can be unavailable by quota/capacity THEN check availability before provisioning and offer a compatible fallback for approval.
- C2 IF data is regulated, personal or location-sensitive THEN confirm region and transfer constraints before upload (Approval if not already agreed).
- C3 IF the owner has no cloud account or billing setup THEN stop before provisioning and explain the account/billing setup they must complete.

**Suggest**
- S1 A separate sandbox project/account for experiments — limits the blast radius of mistakes.
- S2 A monthly resource/cost summary — helps find forgotten disks, IPs and idle machines.

**Approval**
- A1 Creating or resizing a paid resource, increasing a quota, opening a public network path, or moving data to a new region — may create charges or expose data.
- A2 Granting broad administrator access to an agent or automation identity — makes mistakes harder to contain.

**Frontend contract**
- Cloud controls show account/project, region, environment, resource identity, status, estimate and operation id before and after a change (FE-CLOUD-01).

**Acceptance**
- [ ] Given a cloud mutation is requested, when it is prepared, then provider account, environment, region and estimated costs are shown before approval.
- [ ] Given a GPU quota or capacity check fails, when provisioning is attempted, then no chargeable resource is reported as ready and a safe alternative is offered.
- [ ] Given credentials are rotated, when old credentials are searched in the repository and logs, then they are absent.
- [ ] Given a development workflow targets production, when it starts, then it is blocked unless a separately recorded approval exists.

**Exceptions**
- A read-only dashboard may omit mutation approval controls, but must still disclose the account and region it is reading.

**Source:** AWS IAM and Google Cloud IAM least-privilege guidance (provider-specific); cloud pricing and quota behaviour (provider-specific); least-privilege access (standard practice)

## BE-CLOUD-02 · VM and GPU lifecycle

**Purpose:** Start the right remote machine for the work and stop paying for it when it is no longer needed.
**Triggers:** cloud VM, GPU instance, virtual machine, remote workstation, GPU server, start instance, stop instance, idle shutdown, cloud development machine
**Applies when:** an app or owner workflow controls a remote VM or GPU machine.
**Composes:** BE-CLOUD-01, BE-COST-01, BE-DEPLOY-01

**Required**
- R1 Record purpose, owner, environment, selected CPU/GPU type, region, disk retention and maximum run duration before starting.
- R2 Distinguish machine states (requested, provisioning, ready, stopping, stopped, failed, unknown); API acceptance is not proof the machine is ready.
- R3 Define idle-stop and maximum lifetime defaults for development machines; explain that persistent disks, snapshots and reserved resources may still cost money after compute stops.
- R4 Stop is repeat-safe; delete is a separate, explicitly approved action that names the disks and data it will remove.
- R5 On restart, reconcile provider state before issuing another create/start call; do not duplicate an instance because a prior response timed out.
- R6 Keep machine images, bootstrap scripts and access policies versioned; do not expose SSH/RDP or service ports publicly by default.

**Conditional**
- C1 IF a GPU workload needs large model/data downloads THEN show expected storage and egress cost and check free disk before starting.
- C2 IF work can be interrupted THEN save checkpoints to durable storage and describe what is lost when stopping.
- C3 IF GPU supply is limited THEN allow an owner-approved alternate region/type; never change it silently because cost or data location may change.

**Suggest**
- S1 Auto-stop after a configurable idle period — reduces forgotten compute charges.
- S2 A one-click resume of a stopped development machine — avoids repeating setup.

**Approval**
- A1 Delete a VM together with its persistent disks or snapshots — can permanently remove work.
- A2 Keep a GPU VM running indefinitely or start it on a schedule — can accumulate substantial charges.

**Frontend contract**
- Show lifecycle status, elapsed time, current hourly estimate and stop/delete distinction (FE-CLOUD-01).

**Acceptance**
- [ ] Given a create call times out, when the owner retries, then provider state is reconciled before another VM is created.
- [ ] Given compute is stopped, when the owner sees cost status, then persistent disk and reserved-resource charges are still disclosed when applicable.
- [ ] Given Delete is selected, when confirmation appears, then every persistent resource that will be removed is named.

**Exceptions**
- A provider-managed serverless service with no user-visible VM lifecycle does not need this entry; use BE-DEPLOY-02.

**Source:** AWS EC2 and Google Compute Engine lifecycle/quota guidance (provider-specific); cloud billing meters (provider-specific); repeat-safe provisioning (proposal)
