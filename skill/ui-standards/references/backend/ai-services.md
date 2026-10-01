# BE-AI · AI and model services

Load only when the app sends data to or receives generated results from a model or inference service.

## BE-AI-01 · Safe model-provider integration

**Purpose:** Keep model use explainable, bounded and replaceable without making the app depend on one provider's hidden behaviour.
**Triggers:** AI provider, LLM, inference endpoint, voice model, image generation, transcription API, model selection, prompts, tokens, generated result
**Applies when:** application code calls a hosted or locally served model to generate, transform, classify or retrieve content.
**Composes:** BE-COST-01, BE-OPS-01, BE-OPS-02, BE-FILE-02

**Required**
- R1 Keep provider-specific request/response handling behind a small adapter; record provider and model/version for each result when the provider exposes them.
- R2 Treat user documents, prompts, transcripts, retrieved passages and model outputs as untrusted data; do not execute their contents as code, shell commands or system instructions.
- R3 Send only the minimum input needed; make external processing, retention and training-use assumptions visible to the owner before adopting a provider.
- R4 Do not put provider secrets in browser code or a distributed desktop binary; use a server secret store or a user-supplied key in the OS credential store with a clear device-owner warning.
- R5 Bound input size, output size, runtime and retry count; record operation id, outcome and known cost without logging secrets or full private content by default.
- R6 Handle timeout as an unknown outcome until reconciled; don't silently repeat a potentially billable or state-changing call (BE-COST-01).

**Conditional**
- C1 IF the model uses retrieved documents THEN preserve source/version references and enforce source access before retrieval (BE-KNOW-01, BE-KNOW-02).
- C2 IF output affects a person, impersonates their voice/likeness, or makes a consequential recommendation THEN require documented authority/consent where relevant and human review before use.
- C3 IF a model runs on a cloud GPU/VM THEN apply BE-CLOUD-01 and BE-CLOUD-02 to resource access, cost and shutdown.

**Suggest**
- S1 Record a redacted prompt template and model settings with each result — helps reproduce a result without storing private input.
- S2 Offer a provider/model comparison on a small sample — helps balance quality, speed and cost before a large run.

**Approval**
- A1 Sending private user data to a provider whose retention or training policy is unknown — the data may leave the owner's control.
- A2 Fine-tuning on user-provided material — creates a derived model that may retain sensitive information.

**Frontend contract**
- Label generated or transformed output and expose review, retry and discard actions (FE-AI-01); show cost controls when metered (FE-COST-01).

**Acceptance**
- [ ] Given a user-provided prompt includes an instruction to run a command, when model content is processed, then it is treated as data and never executed.
- [ ] Given a provider call times out, when the app considers a retry, then it reconciles status or asks before making another billable call.
- [ ] Given provider credentials are inspected in the client package or logs, when searched, then no developer-owned secret is present.
- [ ] Given a generated result is shown, when the user inspects it, then provider/model identity is shown when available and the result is labelled as generated.

**Exceptions**
- A fully local model with no external service still needs untrusted-input handling and output review; provider-secret rules do not apply.

**Source:** OWASP Top 10 for LLM Applications (security guidance); NIST AI Risk Management Framework (guidance); provider-specific privacy and model terms (provider-specific)
