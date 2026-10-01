# Runtime profiles

Profiles answer **where and how the app runs**, not what the app is about. They are an
open set. The examples below help route retrieval; they do not define the limit of supported
projects. Use more than one when a product spans several surfaces.

| Runtime surface | Retrieval aid | Typical concerns (not exhaustive) |
|---|---|---|
| Browser app | `indexes/web.md` | routes, browser state, responsive input, hosted services |
| Installed desktop app | `indexes/desktop.md` | windows, OS dialogs, local storage, update/install lifecycle |
| Phone/tablet app | `indexes/mobile.md` | touch, platform navigation, permissions, offline behavior |
| Headless service/API/worker | `indexes/service.md` | contracts, data, jobs, security, operations |
| Hybrid, extension, game, embedded, XR, or other | Combine only relevant indexes and entries, or use the full INDEX as a search aid | Ask what differs in this context; do not pretend a matching profile fully covers it |

A product domain is a separate question. The same knowledge tool, media editor, learning
product, business workflow or experimental idea can run on any of these surfaces. Do not
infer accounts, cloud hosting, AI, collaboration, payments or a particular UI from a domain
label alone.

## Routing rules

- Begin from the goal, users, workflow, data and constraints in the owner's own words.
- Select runtime profiles only after understanding the need. Use the generated index as a
  retrieval aid; its trigger phrases are examples, not a classifier or complete inventory.
- Match capability families separately (see `CAPABILITIES.md`). Load only what a slice needs.
- For hybrid products, use client rules for local slices and service rules only for
  networked slices.
- If no profile or entry fits, use common safety rules, ask about the novel requirement,
  research authoritative domain constraints when useful, and record a proposed pattern in
  the coverage sheet and `NEXT-ITERATION.md`. Never silently omit it or force a false match.
- A one-user, local-data app does not need accounts, hosted APIs, cloud resources or sharing
  links unless the owner requires them.

## Full CORE

Load the full server-side `CORE.md` only for hosted or hybrid slices where those server
contracts apply. `CORE-CARD.md` and relevant family rules apply across runtimes.

## Profile indexes

`indexes/web.md`, `indexes/desktop.md`, `indexes/mobile.md`, and `indexes/service.md` are
small retrieval views generated from the same catalogue. They save context; they do not
remove access to another family when the actual request needs it. A custom runtime can use
more than one view plus the general `INDEX.md`.
