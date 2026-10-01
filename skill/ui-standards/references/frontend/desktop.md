# FE-DESK · Desktop interaction

Load for installed desktop apps: windows, menus, local files, native dialogs, keyboard and long-running local work.

## FE-DESK-01 · Window and app lifecycle

**Purpose:** Make the app behave predictably as a desktop window and when it closes or reopens.
**Triggers:** desktop app, window, close, quit, minimise, maximise, restore, tray, reopen
**Applies when:** the app runs in an installed desktop window.
**Composes:** FE-SHELL-01, FE-FEED-03, FE-FORM-05

**Required**
- R1 The window has a useful title, sensible minimum size, and remembers its last size and position when safe.
- R2 Closing a window with unsaved work warns and offers Save, Discard and Cancel; Cancel returns to the same work.
- R3 Closing a long operation explains whether it will continue, stop safely, or be interrupted before the window closes.
- R4 The app has predictable Open, Save and Quit commands; Quit closes all windows only after pending work is resolved.
- R5 Window controls and menus work with keyboard as well as pointer; focus returns to the invoking window after a dialog closes.

**Conditional**
- C1 IF the app has multiple windows THEN each window identifies its document or task in the title and can be closed independently.
- C2 IF the app supports background/tray operation THEN the user explicitly chooses that behaviour and can find the running app again.

**Suggest**
- S1 Reopen the last project on launch — avoids browsing to the same folder each time.
- S2 Keep recent projects in the File menu — makes returning to work quicker.

**Approval**
- A1 Start automatically when the computer starts — changes system behaviour beyond the app.

**Backend contract**
- Persist window preferences locally; never overwrite document data while restoring window state.

**Acceptance**
- [ ] Given unsaved changes, when the user closes the window, then Save, Discard and Cancel are offered and Cancel preserves the work.
- [ ] Given a running task, when the user quits, then its continue-or-stop behaviour is stated before exit.
- [ ] Given a dialog closes, when focus returns, then it goes to the control that opened the dialog.

**Exceptions**
- A single-window utility with no persistent work may omit remembered size and recent projects.

**Source:** Apple Human Interface Guidelines (convention); Windows App SDK windowing guidance (convention); close confirmation (proposal)

## FE-DESK-02 · Local file and folder selection

**Purpose:** Let people choose local files and folders without making them type paths or risk overwriting the wrong file.
**Triggers:** file picker, folder picker, browse, open file, save as, choose folder, local path, import, export
**Applies when:** the app reads or writes files on the user's device.
**Composes:** FE-FORM-04, FE-FEED-04, BE-LOCAL-02

**Required**
- R1 Use the operating system's file or folder chooser; show the chosen name and location before a consequential import or export.
- R2 File filters describe allowed types in plain words; the app still validates actual content after selection.
- R3 Save As does not overwrite an existing file without a clear overwrite confirmation; the default filename is editable.
- R4 A missing, moved or inaccessible path produces a plain message with a Browse again action; never silently switches to another file.
- R5 Long paths and Unicode filenames work; display names are not treated as safe storage paths.

**Conditional**
- C1 IF a folder is selected for batch processing THEN preview the number and types of files before starting.
- C2 IF the destination is a removable or network drive THEN handle it becoming unavailable during save without losing the original.

**Suggest**
- S1 Drag files from the file manager into the app — saves a browse-and-select step.
- S2 Offer a recent-folders list — avoids repeated navigation.

**Approval**
- A1 Recursively include subfolders — may process far more files than expected.

**Backend contract**
- Use safe path handling, atomic writes where practical, and validate file content (BE-LOCAL-02).

**Acceptance**
- [ ] Given a selected file with a misleading extension, when import begins, then content validation rejects it with a useful message.
- [ ] Given an existing destination file, when Save As is confirmed, then the app asks before replacing it.
- [ ] Given a selected file is moved before processing, when the app opens it, then the user sees an error and can choose again.

**Exceptions**
- A workflow that exclusively creates new files may not need an Open picker.

**Source:** HTML file input and platform file chooser guidance (standard/convention); atomic export (proposal)

## FE-DESK-03 · Long local operation and cancellation

**Purpose:** Show what a long task is doing and let the owner stop it safely.
**Triggers:** processing, conversion, transcription, batch, long job, progress, stop, cancel task, local operation
**Applies when:** a local task takes long enough that the app could look frozen.
**Composes:** FE-FEED-04, FE-FEED-01, BE-LOCAL-03

**Required**
- R1 The app stays responsive while work runs; progress shows a bar when measurable, a spinner when not, and words naming the current step.
- R2 The user can stop a task when safe; the control changes from Start to Stop while it runs and prevents a duplicate start.
- R3 Stopping states what is kept and what is discarded; partial outputs are clearly labelled and never mistaken for complete results.
- R4 Every task ends with a plain closeout: completed, stopped or failed; elapsed time; what succeeded; where outputs were saved; and known cost. Errors include a Copy details action.
- R5 A failed task can be retried without repeating completed or paid steps unless the owner confirms that those steps will run again.

**Conditional**
- C1 IF the work includes a paid or quota-limited service THEN compose FE-COST-01 and BE-COST-01.
- C2 IF work survives app restart THEN show it in a task history with status and an explicit Resume or Discard action.

**Suggest**
- S1 Estimate remaining time after enough work completes — helps the owner decide whether to wait.

**Approval**
- A1 Continue work after the app closes — consumes resources when the owner may think the app has stopped.

**Backend contract**
- Run work outside the UI event loop; persist task state and stop requests if restart recovery is supported.

**Acceptance**
- [ ] Given a task is running, when progress changes, then the window remains responsive and shows a progress indicator and current step.
- [ ] Given the owner selects Stop, when cancellation completes, then kept and discarded outputs are listed.
- [ ] Given a task partially fails, when the summary appears, then successful and failed items are distinguished and retry does not repeat completed paid steps silently.

**Exceptions**
- A task that always completes immediately does not need a progress window, but still needs success and error feedback.

**Source:** Qt progress and cancellation guidance (convention); duplicate prevention and task summary (proposal)

## FE-DESK-04 · Keyboard shortcuts and command menus

**Purpose:** Make frequent work quick without hiding commands from new users.
**Triggers:** keyboard shortcut, hotkey, menu, command, accelerator, Ctrl, Cmd, shortcut help
**Applies when:** the app has repeatable actions or desktop menus.
**Composes:** FE-SHELL-01

**Required**
- R1 Every shortcut has the same visible menu command, with its shortcut shown beside it.
- R2 Shortcuts do not fire while the user types in a text field unless the shortcut is a standard editing command.
- R3 Conflicting shortcuts are avoided; use platform conventions for Save, Open, Undo, Redo and Quit.
- R4 Important actions remain discoverable through menus or labelled controls; shortcuts are never the only way to operate.

**Conditional**
- C1 IF shortcuts can be customised THEN provide a reset-to-default action and detect conflicts before saving.

**Suggest**
- S1 A searchable command palette — helps people find actions without remembering menu locations.

**Approval**
- A1 Global shortcuts that work while another app is active — they can intercept keys outside this app.

**Backend contract**
- None.

**Acceptance**
- [ ] Given a shortcut is shown in a menu, when it is pressed outside a text field, then the same menu action runs.
- [ ] Given the user types the shortcut letters in a text field, when they do so, then the app does not trigger the unrelated command.
- [ ] Given keyboard-only use, when a shortcut is unknown, then every essential action remains reachable from a labelled menu or control.

**Exceptions**
- A single-action utility with no repeated commands may not need a menu bar.

**Source:** Apple Human Interface Guidelines keyboard shortcuts; Windows keyboard guidance (convention)

## FE-DESK-05 · Copyable messages and clipboard actions

**Purpose:** Make long errors and generated text easy to read, copy and share safely.
**Triggers:** copy error, copy details, clipboard, long message, stack trace, copy output, copy path
**Applies when:** the app displays long text, diagnostic details or generated output.
**Composes:** FE-FEED-01

**Required**
- R1 Long messages wrap within the window and remain selectable; they never force the window wider.
- R2 Diagnostic messages offer Copy details; copied details include a request or task id when available and exclude secrets and unrelated personal data.
- R3 Copy has visible success feedback and does not clear or alter the source text.
- R4 Technical details are separated from the plain-language summary; the owner can copy either when useful.

**Conditional**
- C1 IF a message contains a local path THEN offer Copy path and avoid exposing it in public-facing reports by default.

**Suggest**
- S1 Include a "Copy for support" action — gathers the useful diagnostics in one step.

**Approval**
- A1 Automatically send diagnostics to the developer or a third party — shares device information outside the app.

**Backend contract**
- Redact credentials, tokens and sensitive values before diagnostic details are copied or logged.

**Acceptance**
- [ ] Given a long error, when the window narrows, then the message wraps and remains readable without widening the window.
- [ ] Given Copy details is selected, when clipboard content is inspected, then it includes useful diagnostics and contains no secret values.
- [ ] Given copy succeeds, when feedback appears, then the original message remains unchanged and a clear copied confirmation is shown.

**Exceptions**
- Short status labels do not need a copy control.

**Source:** WCAG 2.2 reflow and text resize (standard); clipboard feedback (convention)
