# Target profiles

Ask this first, before account, language, or business questions. Use the owner's own words;
"desktop" includes an installed PySide6, Electron, or native app. A target is an app shape,
not a framework choice.

| Profile | Use when | Load index | Exclude unless requested |
|---|---|---|---|
| Web | Runs in a browser; may have hosted server and multiple users | `indexes/web.md` | Native window behaviour |
| Desktop | Installed on Windows/macOS/Linux; may be one user and local-first | `indexes/desktop.md` | Sign-in, sessions, hosted API, team roles, sharing links |
| Hybrid | Desktop/mobile client plus hosted account or sync | Load the matching client profile and web index only for networked slices | Unrelated account or server families |
| Mobile-native | Installed phone/tablet app | Not fully catalogued yet; ADVISE, identify platform and use only shared families | Web-only URL and pointer assumptions |
| CLI / service / embedded | No conventional visual app or a specialised device | Not catalogued yet; ADVISE first | All visual UI families unless a UI exists |

Load full `CORE.md` for web and hybrid slices that use hosted services. For a single-user,
local-only desktop app, `CORE-CARD.md` plus the matched desktop/local families apply; do not
impose password, hosted API, browser-cookie or multi-user permission floors where those
features do not exist. Apply access-control rules when accounts, shared records or remote
services are present.

## Desktop modes

After choosing Desktop, ask only what changes the design:

1. Does one person use it, or do multiple people need accounts? Default: one local user if
   the owner says local files and no collaboration.
2. Does data stay on this computer, sync to a server, or both? Never infer cloud storage.
3. Which operating systems must it support? Default from the owner's machine; ask before
   promising cross-platform behaviour.
4. Does it call a paid or quota-limited service (AI, transcription, maps, media processing)?
   If yes, load FE-COST and BE-COST before planning that action.

## Loading rule

`CORE-CARD.md` → target profile → that profile's generated index → only matched family files.
Do not load the general `INDEX.md` when a profile-specific index exists. Account and server
families are not automatic: cast them only for a slice that actually needs them.
