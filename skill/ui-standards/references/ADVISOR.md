# ADVISOR — context-first discovery

Use this as a question aid, not a required questionnaire or a fixed taxonomy. The owner does
not need to know the app category, stack or architecture. Start from their description and
ask at most five consequential questions per round. Offer a recommended option only when
there is a reason; always include a way to answer in their own words.

## Start with the idea

Invite the owner to describe, in their own words:

- What should someone be able to accomplish with this app?
- Who is that person, and what do they do today instead?
- What would a successful result look like?
- What is unusual, sensitive, expensive, regulated or risky in this domain?

Do not replace this description with a label such as "AI app", "dashboard", "knowledge base"
or "CRUD app". Those labels can hide important workflows.

## Discover relevant context

Choose only questions whose answers change the design. These are prompts, not an exhaustive
menu; invent a better question when the described domain needs it.

### People and workflow

- Who uses it? Is it one owner, a team, customers, the public, or several roles?
- What are the two or three most important things a person does, from start to finish?
- What should the app never do automatically?

### Information and rights

- What information comes in, what changes, and what must come out?
- Where does the information come from, who owns it, and who may see it?
- Does it include personal, confidential, copyrighted, licensed, safety-critical or regulated material?
- What must be kept, recoverable, exported, deleted or traceable?

### Runtime and access

- Where will people use it: browser, installed computer, phone/tablet, terminal, embedded device, a combination, or something else?
- Must any part work without internet or on a single computer?
- Does "cloud dashboard" mean the provider's console, a custom dashboard inside the app, or both?

### Build and deployment constraints

- What computer and operating system will be used to build and test it?
- Can that computer run virtualization, containers or GPU work? "Not sure" is valid; the agent can inspect first.
- Where should builds run: locally, hosted CI/cloud build, or a remote VM?
- Where will the finished app run? Is a cloud account already set up?
- What per-run or monthly budget is acceptable? What should automatically stop?

### Outside services

- Does an action send information to an outside service or incur a fee/credit/quota?
- Is local processing preferred, or is hosted processing acceptable?
- What happens if a provider is down, changes its terms, or returns an uncertain result?

## Domain-specific follow-up

Use the owner's actual domain to identify missing rights, standards, safety practices and
success measures. Examples in this repo (voice/media, knowledge search, creative generation,
cloud compute, and others) illustrate the method only. They are not the supported-domain
list. When the agent lacks reliable domain knowledge, say so, research authoritative sources
when available, and ask the owner about their real practice rather than inventing a rule.

## Question format

Ask in plain language. Use choices only when they make the decision easier:

```text
Where should this work happen?
  a) On this computer, if it can handle it
  b) On a hosted build service (source is uploaded there)
  c) On a remote cloud computer (can cost while it runs)
  d) Not sure — inspect my computer and recommend a low-cost option
  e) Something else: <owner's words>
```

Do not ask every prompt above. Ask only the questions needed for the next decision. Record
assumptions and unresolved questions in the coverage sheet. An unanswered question about cost,
privacy, rights, data loss or public exposure is not silently assumed away.

## Next-iteration advice

For each option the owner did not choose, state what it does, why they might want it, effort
(S/M/L) and the relevant entry code if one exists. If there is no code, label it
**Uncatalogued need** and record it in the app's `NEXT-ITERATION.md` under "Catalogue gaps".
