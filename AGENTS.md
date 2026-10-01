# AGENTS.md — working on the ui-standards repository

This repository **is** the catalogue. These instructions are for agents editing it, not
for apps that use it.

- Source of truth: `skill/ui-standards/`. Everything else (installers, adapters) copies or
  points to it.
- Entry format and rules: `docs/ENTRY-FORMAT.md`. Architecture: `docs/BLUEPRINT.md`.
- After any change under `skill/`, run `node scripts/build-index.mjs`, then
  `node scripts/validate.mjs`; it must exit 0. Never hand-edit `references/INDEX.md`.
- Keep `SKILL.md` short (it loads on every activation). Put detail in `references/`.
- New entries need a recorded miss in `GAPS.md` and a source (standard, or 3+ mature products).
- At most 7 Required items per entry. Record every tie-break in `DECISIONS.md`.
- Behaviour only: no framework names in Required items, no brand names, no URLs in entries.
- `Research/` is local, gitignored reference material. Do not commit or quote it.
- Update `CHANGELOG.md` and bump `metadata.version` in `SKILL.md` for content changes.
