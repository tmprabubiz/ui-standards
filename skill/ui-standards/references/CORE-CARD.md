# CORE card

Start with the owner's goal in their own words. Profiles and families are retrieval aids,
not a closed list. If nothing fits, clarify the need and record the gap.

- **Before a slice:** show one walkthrough line: what the owner does, what they see, and
  what is saved if it fails. Get confirmation before code.
- **Build:** use the existing stack; read existing tests, write/update the acceptance test,
  then implement. Never remove or weaken a failing test.
- **States:** loading (working), empty (nothing yet), error (could not finish), unavailable
  (can't use now), partial (some worked). Long tasks explain progress.
- **Access:** keyboard users can reach every action; focus is visible; controls have names;
  meaning is not colour alone.
- **Safety:** validate input, protect secrets, and check before repeating paid or destructive
  actions.
- **Owner language:** explain new terms simply; wrap messages; let users copy errors and IDs.
- **Scope:** Required is built; Conditional only if true; Suggest is asked or saved for
  later; Approval needs an explicit yes. Record exclusions in the coverage sheet.

A one-user local app needs no accounts or hosted API unless asked. Paid calls need cost and
duplicate-run safeguards.

Assess build machine separately from app runtime. Remote builds/GPU add source, credential
and billing decisions; see BUILD-ENVIRONMENTS.md.

For server-specific rules, load CORE.md only for a hosted or hybrid slice. For routing, see
PROFILES.md and CAPABILITIES.md.
