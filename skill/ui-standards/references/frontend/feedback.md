# FE-FEED · Feedback and confirmation

Load whenever an action needs confirming, undoing, reporting, or showing progress: toasts, destructive actions, dialogs, long operations, notifications.

## FE-FEED-01 · Toasts and inline status messages

**Purpose:** Tell users what just happened, without stealing focus and without hiding problems that need action.
**Triggers:** toast, snackbar, success message, banner, alert, inline message, saved, status message, feedback, notification popup
**Applies when:** the app does anything the user triggers (save, send, delete, update) or can fail.
**Composes:** FE-FEED-02, FE-FEED-05, FE-FORM-02

**Required**
- R1 Every user-triggered save, send or delete confirms visibly (CORE D5), inline near the action or as a toast.
- R2 Messages reach assistive technology without moving focus: polite status for confirmations, alert for errors (WCAG 2.2 SC 4.1.3).
- R3 A toast is never the only place for an error that needs action or has a fix; show it inline next to its cause or as a persistent banner.
- R4 Toasts stay at least 5 seconds (convention), pause while hovered or focused (SC 2.2.1), and can be dismissed; a toast with an action stays until its window ends.
- R5 Text says what happened to what ("Recording 'Intro' deleted"), not just "Success"; status is never colour alone (CORE F3).
- R6 At most three toasts show at once, newest nearest the edge; they never cover primary controls or the mobile navigation bar.

**Conditional**
- C1 IF a message has an action (Undo, View) THEN the action is keyboard reachable and the message stays while it is hovered or focused.
- C2 IF a message describes page-wide state (offline, read-only, maintenance) THEN show a persistent banner, not a toast.
- C3 IF a bulk action fails for several items THEN show one summary with a way to see details, not many toasts.

**Suggest**
- S1 A history of recent messages in a notification centre (FE-FEED-05) — lets people re-read what they missed.

**Approval**
- A1 Browser or phone push notifications for in-app messages — needs the user's permission and a delivery service.

**Backend contract**
- None.

**Acceptance**
- [ ] Given the user saves a record, when the save succeeds, then a message naming the record appears and is announced to screen readers.
- [ ] Given a save fails because a field is invalid, when the response arrives, then the error appears beside the field and not only in a toast.
- [ ] Given a toast is visible, when the user hovers or tabs into it, then it does not dismiss until they leave.
- [ ] Given five actions finish within one second, when messages show, then no more than three toasts are stacked.

**Exceptions**
- Frequent, trivial, instantly visible changes (a toggled switch) may use only the control's own state as confirmation.

**Source:** WCAG 2.2 SC 4.1.3, 2.2.1 (standard); WAI-ARIA APG Alert pattern (standard); Material 3 Snackbar guidance (convention)

## FE-FEED-02 · Destructive actions: confirm and undo

**Purpose:** Prevent accidental or irreversible loss by offering undo where possible and clear confirmation where not.
**Triggers:** delete, remove, discard, undo, confirm, are you sure, archive, overwrite, permanent, recycle bin, irreversible
**Applies when:** an action deletes, overwrites, revokes or otherwise loses data or access.
**Composes:** FE-FEED-01, FE-FEED-03, FE-SEL-01, BE-DATA-03, BE-API-06

**Required**
- R1 Every destructive action gives either undo or a confirmation first (CORE F5); prefer undo whenever the item can be restored.
- R2 Undo appears as a message with an Undo button that stays at least 8 seconds, is keyboard reachable, and restores the item to its original place and state.
- R3 A confirmation dialog names the exact item and the consequence ("Delete 'Intro.mp3'? Its 3 comments are removed too."); buttons are verbs ("Delete recording", "Keep"), never "OK" and "Cancel".
- R4 In a confirmation, initial focus is on the safe choice and Escape cancels (FE-FEED-03).
- R5 When there is no undo and no recovery bin, high-impact actions (account, workspace, many items) need a stronger step such as typing the item's name.
- R6 The destructive control is visually distinct beyond colour and not placed next to the main Save or Done action; the control is busy while running (CORE F6).
- R7 If the action fails, the item stays in place and the message says it was not removed.

**Conditional**
- C1 IF a recovery bin exists THEN the message says "Moved to bin", deleted items show Restore, and the retention period is stated.
- C2 IF several items are affected THEN the dialog states the count and the first few names (FE-SEL-01).
- C3 IF the action affects other people's data or access THEN the dialog says who is affected.

**Suggest**
- S1 A "Recently deleted" bin with 30-day restore — turns mistakes into recoverable slips.
- S2 A "Don't ask again" option for low-risk actions that can be undone — spares frequent users repeated prompts.

**Approval**
- A1 Permanent deletion with no undo and no recovery bin — data cannot come back.
- A2 Automatic permanent purge of deleted items after a set period — confirm how long the owner wants to keep them.

**Backend contract**
- Delete is a soft delete with a restore operation and a scheduled purge (BE-DATA-03); restore and delete are safe to repeat (BE-API-06).

**Acceptance**
- [ ] Given the user deletes an item, when the deletion completes, then a message with Undo stays for at least 8 seconds.
- [ ] Given the user presses Undo, when the restore completes, then the item reappears in its original position.
- [ ] Given a confirmation dialog opens, when it appears, then focus is on the safe button and Escape cancels without deleting.
- [ ] Given the server rejects a delete, when the response arrives, then the item remains listed and an error says it was not deleted.

**Exceptions**
- Clearing a field or removing an unsaved draft line item the user just added needs no confirmation.

**Source:** WCAG 2.2 SC 3.3.4 Error Prevention (Legal, Financial, Data) (standard); WAI-ARIA APG Alert and Message Dialogs (standard); Material 3 Dialogs and NN/g confirmation guidance (convention)

## FE-FEED-03 · Modal dialogs and drawers

**Purpose:** Show focused tasks or details over the page while keeping keyboard and screen-reader users oriented.
**Triggers:** modal, dialog, popup, drawer, side panel, sheet, overlay, lightbox, confirm box, escape key, focus trap
**Applies when:** content or a decision appears on top of the current screen.
**Composes:** FE-FEED-02, FE-FORM-05, FE-SHELL-02, FE-SHELL-03

**Required**
- R1 A dialog has dialog semantics (alert dialog for confirmations), is marked modal, and is named by its title; on open, focus moves inside it.
- R2 While open, focus is trapped (Tab cycles inside), the page behind is inert and does not scroll, and Escape closes it; a visible Close button always exists.
- R3 On close, focus returns to the control that opened it, or to the nearest logical place if that control is gone.
- R4 Only one dialog is open at a time; long forms or content that deserves its own address are pages, not dialogs.
- R5 Long content scrolls inside the dialog while its title and action row stay visible; on narrow screens it becomes a full-width sheet.
- R6 Buttons are verbs; the main action is placed consistently; submitting shows busy and blocks double submit (CORE F6); a failure keeps the dialog open with the error inside it.

**Conditional**
- C1 IF the panel only shows details of a list item and the page stays usable THEN it may be non-modal: no focus trap, Escape closes it, focus still moves in and returns.
- C2 IF the dialog contains a form with changes THEN Escape or Close triggers the unsaved-changes guard (FE-FORM-05); Enter submits.
- C3 IF a dialog appears without a user action (timeout, update) THEN do not interrupt typing; use a banner unless the user must decide now.
- C4 IF the dialog shows a shareable item THEN it has an address and Back closes it (FE-SHELL-02).

**Suggest**
- S1 Make the phone Back button close the dialog — matches how people expect sheets to behave.
- S2 Swipe down to dismiss sheets on touch devices — feels natural on phones.

**Approval**
- None.

**Backend contract**
- None.

**Acceptance**
- [ ] Given a dialog opens, when the user presses Tab repeatedly, then focus cycles only among the dialog's controls.
- [ ] Given a dialog is open, when the user presses Escape, then it closes and focus returns to the button that opened it.
- [ ] Given a dialog form with a server error, when the user submits, then the dialog stays open with the error inside and entries kept.
- [ ] Given a dialog taller than the screen, when it opens, then its title and buttons remain visible while the body scrolls.

**Exceptions**
- Native browser alerts for trivial notices are acceptable only in prototypes.

**Source:** WAI-ARIA APG Dialog (Modal) and Alert and Message Dialogs patterns; HTML dialog element; WCAG 2.2 SC 2.1.2, 2.4.3 (standard); Material 3 Side sheets and Apple HIG Sheets (convention)

## FE-FEED-04 · Progress for long operations

**Purpose:** Show that work is happening, how far along it is, and what happens when it ends.
**Triggers:** progress bar, spinner, loading, uploading, processing, importing, exporting, long running, cancel, percent, please wait, background task
**Applies when:** an action takes more than about a second to finish.
**Composes:** FE-FEED-01, FE-FEED-05, FE-FORM-04, BE-JOB-01, BE-API-06

**Required**
- R1 Operations over one second show a busy state on the control; over five seconds they show a progress indicator with a label ("Uploading 3 of 5 files").
- R2 Use a determinate bar when the fraction is known and an indeterminate indicator when it is not; never show fake progress.
- R3 Progress is exposed to assistive technology (progressbar with name and value) and announced at sensible intervals, not on every tick.
- R4 Leaving the screen does not silently cancel long work; either it continues and the user can see its status later, or leaving warns first (CORE F8).
- R5 Cancel is offered when stopping is safe, and says what happens to partial work.
- R6 On finish, show a clear result with per-item outcomes for batches (CORE F4 partial) and the next step (open, download); failures offer Retry from the failed item, not from the start.

**Conditional**
- C1 IF work continues on the server after the request returns THEN the screen shows queued, running, done or failed from server state and survives refresh.
- C2 IF an operation takes longer than about a minute THEN offer to notify the user on completion (FE-FEED-05).
- C3 IF reduced motion is requested THEN animated spinners are replaced by static or low-motion indicators (CORE F7).

**Suggest**
- S1 Time remaining once the estimate is stable — helps people decide whether to wait.
- S2 "Email me when it's done" — lets people leave without watching the screen.

**Approval**
- A1 Completion emails or push messages — they involve permissions and an email or push provider (BE-JOB-03, BE-JOB-04).

**Backend contract**
- Long work is a background job with an id; the start call returns at once, and a status call returns state, counts and errors (BE-JOB-01); starting is safe to repeat (BE-API-06).

**Acceptance**
- [ ] Given an import takes 20 seconds, when it runs, then a labelled progress indicator with count shows throughout.
- [ ] Given the user refreshes during a server-side job, when the screen reloads, then it shows the job's current status.
- [ ] Given 2 of 10 items fail, when the operation ends, then the result names the 2 failed items and offers Retry.
- [ ] Given the user presses Cancel, when the operation stops, then a message states what was kept and what was discarded.

**Exceptions**
- Operations that reliably finish in under a second need only the busy state.

**Source:** WAI-ARIA progressbar role (standard); WCAG 2.2 SC 4.1.3 (standard); NN/g response-time limits (convention); Material 3 Progress indicators (convention)

## FE-FEED-05 · In-app notification centre

**Purpose:** Collect events that matter to the user in one place they can revisit, with unread state.
**Triggers:** notifications, bell, inbox, unread, alerts, mark as read, activity feed, mentions, push, notification settings
**Applies when:** the app generates events for a user that happen while they are away or on another screen.
**Composes:** FE-FEED-01, FE-ACCT-04, FE-MEDIA-04, BE-JOB-04, BE-API-04

**Required**
- R1 A bell or inbox control in the shell shows the unread count and has an accessible name such as "Notifications, 3 unread"; it opens a panel reachable by keyboard.
- R2 Each notification says what happened, to which item, and when (relative time with the exact time available), links to that item, and shows unread state by more than colour.
- R3 Opening a notification marks it read; "Mark all as read" exists; the unread count updates without a page reload.
- R4 The panel has loading, empty ("You're all caught up"), error and partial states (CORE F4) and loads older items in pages (CORE D3).
- R5 A notification whose item was deleted or is no longer accessible opens a graceful message instead of an error page.

**Conditional**
- C1 IF notifications also go out by email or push THEN settings let the user pick channels per type (FE-ACCT-04); security messages cannot be switched off.
- C2 IF a notification is actionable (approve, join) THEN the action works from the panel and confirms its result (FE-FEED-01).
- C3 IF browser push is used THEN permission is requested only after the user opts in from a clear control, never on first load, and a denied state explains how to change it (see FE-MEDIA-04 for the same pattern).
- C4 IF many similar events arrive THEN group them ("5 new comments").

**Suggest**
- S1 Quiet hours or a daily digest — reduces interruptions.
- S2 Snooze a notification — lets people handle it later without losing it.

**Approval**
- A1 Browser or phone push notifications — they need permission and a push service.
- A2 Email digests — they need an email provider and unsubscribe handling.

**Backend contract**
- Notifications are stored per recipient with read state and listed with pagination (BE-API-04); delivery runs through BE-JOB-04; only the recipient can read or mark them (CORE F11).

**Acceptance**
- [ ] Given three unread notifications, when the shell renders, then the bell announces "3 unread".
- [ ] Given the user opens a notification, when its item loads, then the notification is marked read and the count drops by one.
- [ ] Given no notifications exist, when the panel opens, then it shows an all-caught-up message.
- [ ] Given a notification points to a deleted item, when the user opens it, then a clear "no longer available" message appears.

**Exceptions**
- Apps with no events to report between visits need no notification centre; use FE-FEED-01 only.

**Source:** WAI-ARIA APG Disclosure pattern; WCAG 2.2 SC 4.1.3; W3C Push API (standard); Apple HIG Notifications and Material 3 notification guidance (convention)
