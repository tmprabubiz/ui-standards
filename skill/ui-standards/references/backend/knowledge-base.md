# BE-KNOW · Knowledge sources and retrieval

Load when the app ingests documents/media for later search, retrieval or source-grounded answers.

## BE-KNOW-01 · Source ingestion and index lifecycle

**Purpose:** Keep searchable extracts tied to the files they came from, including when those files change or are removed.
**Triggers:** knowledge base, document indexing, RAG, embeddings, vector store, OCR, ingest, chunking, re-index, transcript search
**Applies when:** the app extracts text or metadata and creates a search/retrieval index.
**Composes:** BE-FILE-01, BE-FILE-02, BE-JOB-01, BE-DATA-07

**Required**
- R1 Give every source and indexed version a stable id; record source hash, version, processing state and timestamps.
- R2 Process large/OCR/transcription/embedding work as a job with progress, retry and per-file failure state (BE-JOB-01).
- R3 Keep extracted chunks and embeddings linked to the source and version; a result can be traced to its origin.
- R4 Replacing or removing a source invalidates its old indexed content according to a stated deletion window; do not silently keep stale chunks searchable.
- R5 Enforce the source's access rules when retrieving extracted content, not only when opening the original file (CORE F11 where hosted).
- R6 Record which parser/model version produced an index so it can be rebuilt after changes.

**Conditional**
- C1 IF OCR or transcription is paid THEN apply BE-COST-01 and keep unknown outcomes from triggering duplicate paid work.
- C2 IF embeddings or extracts are sent to an external provider THEN apply BE-AI-01 and disclose data handling.
- C3 IF the source is audio/video THEN retain time ranges so citations can point to the relevant moment.

**Suggest**
- S1 Let the owner re-index one source without rebuilding the entire library — saves time after a small change.

**Approval**
- A1 Keep deleted source extracts or embeddings beyond the stated deletion window — hidden copies may retain private information.

**Frontend contract**
- Show queued, processing, ready, failed and removed states per source; surface a plain failure reason (FE-KNOW-01).

**Acceptance**
- [ ] Given a source changes, when indexing finishes, then search results reference the new source version rather than old chunks.
- [ ] Given a source is removed, when its deletion window ends, then its extracted chunks and embeddings are no longer retrievable.
- [ ] Given one file fails in a batch, when the job completes, then successful files remain usable and the failed file is named.

**Exceptions**
- A normal file manager that does not extract or index content does not need this entry.

**Source:** source traceability and deletion lifecycle (practice); provider/model retention terms (provider-specific)

## BE-KNOW-02 · Retrieval and grounded answers

**Purpose:** Retrieve relevant saved material while keeping every generated claim connected to its evidence.
**Triggers:** ask documents, answer from files, citations, grounded answer, retrieval, RAG, source passage, knowledge search
**Applies when:** a search or model returns answers based on an indexed collection.
**Composes:** BE-KNOW-01, BE-AI-01, BE-DATA-07

**Required**
- R1 A retrieved passage carries source id, source version and location (page, timestamp or section) to the caller.
- R2 Apply the same authorization checks to retrieved chunks as to the source (CORE F11 when hosted).
- R3 Treat retrieved text as untrusted input; it cannot override system/developer policy or trigger tools merely because it contains instructions.
- R4 If retrieval finds no adequate evidence, return an explicit no-support result instead of fabricating a citation.
- R5 Keep retrieval scores and model confidence internal unless their meaning is calibrated and explained; a similarity score is not a probability of truth.
- R6 Log safe references and outcome for debugging without storing private passages or prompts by default.

**Conditional**
- C1 IF results blend multiple sources THEN preserve citation boundaries per claim or passage.
- C2 IF a user asks for a quote or exact wording THEN return the source text distinctly from any generated paraphrase.

**Suggest**
- S1 Let users inspect the passages retrieved before the answer — helps them spot a missing or wrong source.

**Approval**
- A1 Use source material to train or fine-tune a model — creates a derived artifact that may retain the material.

**Frontend contract**
- Each displayed citation opens the correct source location, and generated paraphrase is visually distinguished from quoted source text (FE-KNOW-01, FE-AI-01).

**Acceptance**
- [ ] Given retrieved evidence exists, when an answer is shown, then its citations resolve to the correct source and version.
- [ ] Given no supporting passage is retrieved, when the model cannot ground its answer, then the result states that no supporting source was found.
- [ ] Given a retrieved passage contains instructions to reveal secrets or call a tool, when it is processed, then it is treated as content and cannot change agent policy.

**Exceptions**
- Direct keyword search can return source results without generating a natural-language answer.

**Source:** OWASP Top 10 for LLM Applications prompt-injection guidance (security guidance); retrieval/source provenance (practice)
