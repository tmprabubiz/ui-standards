# FE-KNOW · Knowledge and source-grounded content

Load when people collect documents, notes or media and later search, summarise or ask questions about them.

## FE-KNOW-01 · Source-grounded knowledge results

**Purpose:** Help people find information while showing which saved source supports each result.
**Triggers:** knowledge base, document library, ask my files, source citations, upload documents, notes search, RAG, retrieval, explain with sources
**Applies when:** the app searches or generates answers from a collection the user owns or provides.
**Composes:** FE-COLL-03, FE-COLL-06, FE-AI-01, FE-FORM-04, BE-KNOW-01, BE-KNOW-02

**Required**
- R1 Each answer or extracted claim links to the source item and the relevant page, time range or passage when available.
- R2 Distinguish a source quote from a generated summary; make the source openable without losing the current question or result.
- R3 Show the source's indexing state (waiting, processing, ready, failed, removed) and a plain reason when it cannot be used.
- R4 Removing or replacing a source makes its old extracted text unavailable to later search/answers within the stated removal window.
- R5 An empty search and an answer with no supporting sources are distinct; say when no useful source was found instead of inventing a supported answer.

**Conditional**
- C1 IF the app generates answers from sources THEN apply FE-AI-01; unsupported claims are labelled and can be checked against citations.
- C2 IF the collection contains private documents THEN access to each source and its extracted text follows the same owner/share rules as the original (CORE F11 when hosted).
- C3 IF a source is re-indexed after editing THEN identify its current version so old and new citations are not confused.

**Suggest**
- S1 Filters by source type, date or folder — helps narrow a large library.
- S2 A list of recently used sources beside the answer — makes follow-up research faster.

**Approval**
- A1 Sending the user's collection to a new external AI/search provider — shares private material and may create ongoing cost.

**Backend contract**
- Track source versions and processing state; keep extracted text and search records linked to their source (BE-KNOW-01, BE-KNOW-02).

**Acceptance**
- [ ] Given a result has a source, when the user opens its citation, then the correct source and referenced passage are shown.
- [ ] Given no retrieved source supports an answer, when the result appears, then the app says it could not find support rather than presenting an uncited claim as fact.
- [ ] Given a source is removed, when a later search runs after the stated removal completes, then the removed content is not returned.
- [ ] Given a source is still processing, when it appears in the collection, then its status is visible and it is not presented as searchable yet.

**Exceptions**
- A document organiser with no generated or source-grounded answers needs collection/search entries but not this result contract.

**Source:** information provenance and retrieval transparency (convention); user-controlled source deletion (proposal)
