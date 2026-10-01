# Build and deployment environments

This is separate from the app's runtime target. A web app may be built on a remote VM; a
desktop app may use cloud inference; an app can run locally while its image is built remotely.
Do not assume the owner's computer can run Docker, a hypervisor, a GPU, or every project tool.

## Ask only what changes the plan

- What computer/OS will the owner use to edit and test the project?
- Can it run the required language runtime, virtualization/container engine, and GPU workload?
- Where should builds run: this computer, hosted CI/cloud build service, or a remote development VM?
- Where will the finished app run, and where must data live?
- Is a cloud account/billing profile already set up? What monthly and per-run limit is acceptable?
- Does “cloud dashboard” mean the provider's console, a custom dashboard inside the app, or both?

The owner can answer in plain language. If they do not know, inspect the existing machine and
project first; if still unclear, propose the least-cost reversible option. Do not create
accounts, start paid resources, upload private source, or open network access without approval.

## If the owner's computer cannot run Docker or virtualization

A local Docker daemon is not required to produce a container image. Consider, in this order,
only after checking the project and account constraints:

| Option | What happens | Important trade-off |
|---|---|---|
| Hosted CI runner | Source is pushed to the chosen Git host; its hosted runner builds/tests/publishes the image | Source is available to that CI service; usage and storage may be billed |
| Managed cloud build | Source is submitted or fetched by a provider build service; it builds and can publish to a registry | Provider IAM, build logs, source retention, region and charges must be understood |
| Remote build VM | A cloud VM builds the image; it can also be a remote development machine | Owner must patch/secure it and stop/delete resources; persistent disks can continue charging |
| Non-container deploy | Buildpacks or the platform's source deploy may create the runtime artifact | Less control over OS/system libraries; may not fit GPU or special native dependencies |

Prefer an image build from a versioned repository commit. Send the smallest source context
needed. Keep keys out of the source tree, image layers, build arguments and logs. Record the
immutable image digest and build result. See `backend/build-and-deploy.md`.

## Provider examples (not endorsements or exclusive choices)

Names are examples of current service families, not fixed architecture requirements. Verify
region, quotas, price, account policy and current docs before selecting a service.

| Need | AWS example | Google Cloud example |
|---|---|---|
| Remote container build | CodeBuild | Cloud Build (Dockerfile, config, or buildpacks) |
| Image registry | Elastic Container Registry (ECR) | Artifact Registry |
| GPU/VM runtime | EC2 accelerated-computing instances | Compute Engine GPU machine types |
| Orchestration/managed runtime | ECS, EKS, Batch or another fit-for-purpose service | Cloud Run, GKE, Batch or another fit-for-purpose service |

Provider documentation:
- [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [EC2 accelerated computing](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/accelerated-computing-instances.html)
- [Google Cloud Build: build container images](https://docs.cloud.google.com/build/docs/building/build-containers)
- [Google Artifact Registry](https://docs.cloud.google.com/artifact-registry/docs)
- [Compute Engine GPU types](https://docs.cloud.google.com/compute/docs/gpus)

## Cloud approval and shutdown

Before provisioning, name the account/project, region, machine type, disk, expected hourly
cost, maximum run time and teardown action. Check quota/capacity first. Add an idle timeout
where safe. State which disks, snapshots, registry artifacts, IP addresses and logs remain
billable after the VM stops. Do not confuse “stop” with “delete”. Keep a recovery route for
source and outputs before deleting persistent resources. Apply `BE-CLOUD-01/02`,
`BE-DEPLOY-01/02` and `BE-COST-01` only when the relevant work is in scope.
