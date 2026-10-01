# BE-DEPLOY · Remote build and deployment

Load when packaging, building or deploying an app, especially when the owner's computer cannot run a local container engine or virtual machine.

## BE-DEPLOY-01 · Build container images remotely

**Purpose:** Build a repeatable app image without requiring Docker Desktop, local virtualization or a local GPU.
**Triggers:** Docker image, container, Dockerfile, build image, no Docker Desktop, no virtualization, remote build, cloud build, CI build, image registry
**Applies when:** the app needs a container image or local build prerequisites are unavailable or too heavy.
**Composes:** BE-CLOUD-01, BE-DEPLOY-02, BE-OPS-07

**Required**
- R1 Detect whether local container/virtualization support is actually available; do not install or assume Docker Desktop. Offer a remote builder or hosted CI when unavailable.
- R2 Build from a versioned source commit using a reproducible build definition; record commit, builder, image digest, build logs and outcome.
- R3 Send only the required source context to the builder; exclude credentials, local datasets, `.env` files and unrelated files.
- R4 Pass secrets through the builder's protected secret mechanism at build time; never bake credentials into image layers, build args, logs or cached output.
- R5 Scan dependencies and the resulting image using available security checks; report findings and do not claim a clean scan when no scan ran.
- R6 Tag images with an immutable digest for deployment; human-readable tags are aliases and may move.

**Conditional**
- C1 IF the owner cannot run virtualization locally THEN choose a hosted CI runner, provider build service or remote VM builder; explain where source is sent and what it costs.
- C2 IF a GPU is needed only at runtime THEN build the image on a CPU builder unless the build itself genuinely needs a GPU.
- C3 IF private model weights or large datasets are needed THEN fetch them through authenticated runtime storage rather than committing them into the source or image by default.

**Suggest**
- S1 Cache dependency layers — speeds up repeat builds.
- S2 Produce a software bill of materials — makes it easier to see what went into an image.

**Approval**
- A1 Send private source code or data to a new remote builder — grants an outside service access to that material.
- A2 Publish an image to a public registry — exposes the code and any accidentally included files.

**Frontend contract**
- Build screens show queued/running/succeeded/failed states, source commit, builder location, logs and resulting image digest; local UI is not required for a headless CI workflow.

**Acceptance**
- [ ] Given the owner's computer has no local virtualization, when the image is built, then no local Docker daemon is required and the selected remote builder is named.
- [ ] Given the source context is prepared, when it is uploaded, then environment files, credentials and excluded data are absent.
- [ ] Given a build succeeds, when it is deployed, then the deployment references the immutable image digest and source commit.
- [ ] Given no image scan ran, when build results are shown, then the status says not scanned rather than passed.

**Exceptions**
- A language-native package or serverless source deploy may not need an OCI/Docker image; choose the simplest supported artifact.

**Source:** OCI image and distribution specifications (standard); Docker build context and build-secret guidance (implementation reference); CI reproducibility and provenance (practice)

## BE-DEPLOY-02 · Release, health check and rollback

**Purpose:** Release a known build, confirm it is healthy, and return to the last working version if it is not.
**Triggers:** deploy, release, staging, production, rollback, health check, rollout, canary, cloud run, ECS, GKE
**Applies when:** an app is delivered to a hosted service, VM or managed runtime.
**Composes:** BE-DEPLOY-01, BE-CLOUD-01, BE-OPS-03, BE-OPS-07

**Required**
- R1 Separate development/test from production; production changes require an explicit target and confirmation.
- R2 Deploy an immutable artifact identifier and keep the previous known-good version available for rollback.
- R3 Wait for an application-level health/readiness check before marking a release successful; infrastructure creation alone is not app health.
- R4 On failed health checks, stop rollout or restore the last known-good version and report what changed.
- R5 Record release id, artifact digest, environment, migration version, start/end time and outcome.
- R6 Database changes are backward-compatible across the rollout window or have a rehearsed restore/forward-fix plan.

**Conditional**
- C1 IF the service handles live traffic THEN use a gradual rollout or maintenance window appropriate to downtime tolerance.
- C2 IF a migration is irreversible THEN obtain explicit approval and verify a restorable backup before deployment.

**Suggest**
- S1 A staging environment that uses production-like configuration without production data — catches configuration issues before release.

**Approval**
- A1 Deploying to production, changing a public domain, or running an irreversible migration — affects users or can cause data loss.

**Frontend contract**
- Release status distinguishes build, upload, rollout and health-check phases and links logs to a release id.

**Acceptance**
- [ ] Given a release is deploying, when the health check fails, then it is not shown as successful and rollback/stop status is visible.
- [ ] Given a rollback runs, when it completes, then the previous artifact digest is active and the failed release remains in history.
- [ ] Given a deployment targets production, when it is initiated, then the environment and artifact digest are shown for explicit confirmation.

**Exceptions**
- A static local utility with no deployment target does not need a release pipeline.

**Source:** OCI digests (standard); deployment health and rollback conventions (practice); production approval boundary (proposal)
