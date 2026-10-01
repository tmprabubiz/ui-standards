# CORE card

Start here for every app. Ask **target first**: web, desktop, mobile, or hybrid. Load only
that profile's index and matched families. For a target without a profile, advise and ask
before assuming web conventions.

- **Before a slice:** show one walkthrough line: what the owner does, what they see, and
  what is saved if it fails. Get confirmation before code.
- **Build:** use the existing stack; tests first. Read existing tests, write or update the
  acceptance test, then implement. Never remove or weaken a failing test to make the change pass.
- **States:** loading (working), empty (nothing here yet), error (could not finish),
  unavailable (cannot use this now), and partial (some worked, some did not). Every long
  task says what is happening and shows progress when measurable.
- **Access:** keyboard users can reach every action; focus is visible; controls have names;
  meaning is not colour alone.
- **Safety:** validate input; keep secrets out of code and logs; never repeat a paid or
  destructive action without checking whether it already happened.
- **Owner language:** pair unfamiliar terms with a short plain-English meaning the first
  time. Messages wrap; errors can be copied with their request or task id when available.
- **Scope:** Required is built; Conditional only if true; Suggest is asked or saved for
  later; Approval needs an explicit yes. Record exclusions in the coverage sheet.

A desktop app with one user and local files does **not** need accounts, passwords, web APIs,
or sharing links unless the owner asks for them. A paid or metered external call is a separate
high-risk action; load its UI and persistence contracts before implementing it.

For server-specific rules, load CORE.md only for a hosted or hybrid slice. For target
routing, see PROFILES.md.
