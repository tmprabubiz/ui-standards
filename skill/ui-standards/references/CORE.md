# CORE — always applied

Load full CORE for hosted web and hybrid slices. `CORE-CARD.md` applies to every target;
these additional server floors apply only where the feature exists. Floors cannot be
declined by default; overriding an applicable floor needs a written exception in COVERAGE.md.

## Floors

### Front end

| ID | Floor |
|---|---|
| F1 | Every interactive control is reachable and operable by keyboard, in a logical order, with a visible focus indicator. |
| F2 | Every control and input has an accessible name; inputs have visible labels (a placeholder is not a label). |
| F3 | Meaning is never carried by colour alone; text meets WCAG 2.2 AA contrast. |
| F4 | Every async view implements the 5-state frame below. |
| F5 | Destructive or irreversible actions need confirmation or undo (see FE-FEED entries). |
| F6 | Actions in progress cannot be submitted twice; the control shows it is busy. |
| F7 | No media autoplays with sound; motion respects the reduced-motion preference. |
| F8 | User input is never lost by navigation, refresh or a failed submit without a warning. |
| F9 | Layout works from 320 px wide to desktop; touch targets are at least 24 × 24 CSS px. |

### Hosted back end

| ID | Floor |
|---|---|
| F10 | Every input is validated on the server, regardless of client validation. |
| F11 | Every data access checks the caller is allowed to touch **that** record, not only that they are signed in. |
| F12 | Secrets live in environment configuration, never in code, logs, or the client bundle. |
| F13 | Passwords are hashed with a slow, salted algorithm (Argon2id, scrypt or bcrypt); never stored or logged in plain text. |
| F14 | Errors returned to clients carry a safe message and a stable code; stack traces and internals stay in server logs. |
| F15 | Database queries are parameterised; no string-built queries from user input. |
| F16 | Every change to user data is recoverable: soft delete, backup, or explicit confirmation of permanence. |

## 5-state frame (F4)

Every view that loads, saves or depends on remote data defines all five:

| State | Required behaviour |
|---|---|
| Loading | A placeholder that keeps the layout's shape; no blank screen; no layout jump when data arrives. |
| Empty | Says what is missing and offers the next useful action. Distinguish "nothing yet" from "no results for these filters". |
| Error | Says what failed in plain words, keeps user input, and offers retry when retry can help. |
| Disabled / no permission | Explains why the action is unavailable and, if possible, how to get access. |
| Partial | When some items load or save and others fail, show which; never report total success. |

## Shared defaults

| ID | Default |
|---|---|
| D1 | Times are stored in UTC and shown in the user's local time zone and format. |
| D2 | Every record has a stable id, `created_at`, `updated_at`. |
| D3 | Lists that can exceed 50 items are paginated or incrementally loaded, on server and client. |
| D4 | User-facing text lives in one place per screen or a strings file, ready for translation. |
| D5 | Success feedback appears for every save, send or delete the user triggers. |
| D6 | Each screen has a unique page title and a URL (web) that can be bookmarked or shared when the content is shareable. |
| D7 | Server logs one structured line per request with a request id; the id is shown in user-facing error details. |

## Applying CORE

- List floors only when excepted; they are assumed applied.
- When a floor and a user instruction conflict, explain the risk in one sentence, offer the
  nearest safe alternative, and record the decision.

Sources: WCAG 2.2 (standard), WAI-ARIA APG (standard), OWASP ASVS 4 and Top 10 (standard),
OWASP Password Storage Cheat Sheet (standard), RFC 9457 Problem Details (standard).
