# FE-FORM · Forms and data entry

Load for any screen where users type, choose or upload information: fields, validation, wizards, file fields, drafts.

## FE-FORM-01 · Form fields and labels

**Purpose:** Make every field understandable, fast to fill, and friendly to browsers and password managers.
**Triggers:** form, input, field, label, placeholder, required, optional, autocomplete, autofill, submit button, text box, help text
**Applies when:** the app asks the user to enter or edit information.
**Composes:** FE-FORM-02, FE-FORM-05, BE-API-03

**Required**
- R1 Every field has a visible, persistent label tied to the input (CORE F2); a placeholder is only an example, never the label.
- R2 Required and optional fields are distinguished consistently, and any symbol such as an asterisk is explained (WCAG 2.2 SC 3.3.2).
- R3 Fields use the right input kind (email, phone, number, date, web address) and the right autocomplete purpose (given-name, family-name, email, tel, postal-code, one-time-code, username, current-password, new-password) (SC 1.3.5).
- R4 Format hints and help text sit next to the field before the user types and are linked to it for screen readers; important help is not hidden in a tooltip.
- R5 Related fields are grouped with a group label (radio sets, addresses); layout is one column on narrow screens and tab order follows visual order.
- R6 The submit button names the outcome ("Save changes", "Create account") and is a real submit so Enter works; it stays enabled so pressing it can explain what is missing.
- R7 Nothing a user typed is cleared by an error (CORE F8); pasting is allowed in every field, including passwords (SC 3.3.8).

**Conditional**
- C1 IF a field takes a number with a unit or currency THEN the unit shows beside the field and common typing (spaces, commas) is accepted.
- C2 IF a text field has a length limit THEN show the remaining count, announced only at thresholds, not on every keystroke.
- C3 IF the app already knows a value (the signed-in user's email) THEN prefill it instead of asking again (SC 3.3.7).
- C4 IF a date is requested THEN allow typing in the user's locale format as well as picking from a calendar.

**Suggest**
- S1 Example text inside format-sensitive fields — shows people what a good answer looks like.
- S2 Trim stray spaces automatically — avoids failures caused by invisible spaces.

**Approval**
- A1 Collecting sensitive personal data (ID numbers, date of birth, health details) — needs a stated purpose and a storage review.

**Backend contract**
- Field formats and limits shown on screen mirror the server's rules (BE-API-03).

**Acceptance**
- [ ] Given any form field, when a screen reader reaches it, then its label, required state and help text are announced.
- [ ] Given an email field on a phone, when the user taps it, then the email keyboard appears and the browser offers saved addresses.
- [ ] Given the user pastes into a password field, when the paste happens, then the text is accepted.
- [ ] Given the user presses Enter in a text field, when the form is valid, then it submits.

**Exceptions**
- A single search box may use a visually hidden label with a visible icon button, provided it has an accessible name.

**Source:** WCAG 2.2 SC 1.3.5, 3.3.2, 3.3.7, 3.3.8 (standard); HTML autocomplete and input types (standard); GOV.UK Design System form patterns and NN/g form guidance (convention)

## FE-FORM-02 · Validation and error messages

**Purpose:** Tell users what is wrong and how to fix it, at the right moment, without losing their work.
**Triggers:** validation, error message, invalid, required field, error summary, inline error, check input, can't submit, format error
**Applies when:** users submit or edit data that must meet rules.
**Composes:** FE-FORM-01, FE-FEED-01, FE-FEED-04, BE-API-02, BE-API-03

**Required**
- R1 The server always validates (CORE F10); client checks only add speed and use the same rules.
- R2 A field is validated when the user leaves it or on submit, not while they are still typing the first time; once an error is showing, it re-checks as they type and clears as soon as it is fixed.
- R3 Each error sits beside its field, in text, says what is wrong and how to fix it ("Enter an email like name@example.com"), is not colour alone (CORE F3), and is linked to the field; the field is marked invalid (SC 3.3.1, 3.3.3).
- R4 On a failed submit an error summary at the top lists every error as a link to its field; focus moves to the summary and the number of errors is announced; a sticky header never hides it (SC 2.4.11).
- R5 Field errors returned by the server appear on the matching fields; errors about the whole form (network, conflict, permission) appear at the top of the form, not only in a toast (FE-FEED-01); input is kept (CORE F8).
- R6 Rules never reject valid real data: apostrophes and hyphens in names, plus signs in emails, long addresses, non-Latin characters.

**Conditional**
- C1 IF a value must be unique (username, email) THEN check availability after the user leaves the field and still handle a server rejection on submit.
- C2 IF two fields depend on each other (end after start, matching passwords) THEN the message goes on the field the user can change and names both.
- C3 IF a problem is a warning, not a blocker THEN style it differently and allow submit after confirmation.

**Suggest**
- S1 Fix common slips silently (extra spaces, capital letters in emails) — spares people trivial rejections.
- S2 Live hints while typing for tricky formats such as phone numbers — reduces failed submissions.

**Approval**
- None.

**Backend contract**
- The API returns all field errors at once, keyed by field name with stable codes and a request id (BE-API-02, BE-API-03).

**Acceptance**
- [ ] Given three invalid fields, when the user submits, then a summary lists all three as links and focus moves to the summary.
- [ ] Given the user is typing an email for the first time, when the value is still incomplete, then no error appears until they leave the field or submit.
- [ ] Given an error is showing, when the user types a valid value, then the error disappears immediately.
- [ ] Given the server rejects one field, when the response arrives, then the message appears on that field and other entries remain.

**Exceptions**
- Very short forms (one field) may show the error only on submit with focus returned to the field.

**Source:** WCAG 2.2 SC 3.3.1, 3.3.3, 4.1.3, 2.4.11 (standard); WAI-ARIA aria-invalid and aria-describedby (standard); GOV.UK error summary pattern and NN/g form error guidance (convention)

## FE-FORM-03 · Multi-step forms

**Purpose:** Break long data entry into clear steps that can be revisited without losing answers.
**Triggers:** wizard, stepper, multi-step, step 1 of, next button, back button, checkout, application form, review answers, progress steps
**Applies when:** a form has more than about seven fields or naturally falls into stages.
**Composes:** FE-FORM-01, FE-FORM-02, FE-FORM-05, FE-SHELL-02, BE-API-03, BE-API-06

**Required**
- R1 A step indicator shows "Step 2 of 4" with step names; the current step is marked for assistive technology (aria-current="step") and completed steps are identifiable.
- R2 Next and Back are always available; Back keeps entered data; each step validates on Next (FE-FORM-02) and focus moves to the new step's heading.
- R3 Steps are reflected in the address and history (FE-SHELL-02): browser Back goes to the previous step and refresh keeps the user's place and answers.
- R4 Consequential forms end with a review step listing all answers, each with a Change link, before a clearly named final submit (WCAG 2.2 SC 3.3.4); the submit runs once (CORE F6).
- R5 No question is asked twice (SC 3.3.7), and only information the process needs is requested.

**Conditional**
- C1 IF steps depend on earlier answers THEN the step list and count update, and earlier answers are not lost when a choice changes back.
- C2 IF the process is long THEN progress is saved so the user can resume later (FE-FORM-05).
- C3 IF final submit finds an error in an earlier step THEN take the user to that step with the error shown.
- C4 IF steps are optional THEN mark them and allow skipping.

**Suggest**
- S1 An "about 3 minutes" estimate at the start — helps people decide to begin.
- S2 Save and continue later through an emailed link — rescues interrupted sessions.

**Approval**
- A1 Saving partial answers on the server for people who are not signed in — it stores personal data before an account exists.

**Backend contract**
- Either a draft resource is saved per step and validated per step, or all answers are sent at the end; full validation always runs at final submit (BE-API-03) and submit is safe to repeat (BE-API-06).

**Acceptance**
- [ ] Given the user is on step 3, when they press Back, then step 2 shows with their earlier answers intact.
- [ ] Given the user refreshes on step 2, when the page reloads, then step 2 appears with answers kept.
- [ ] Given the review step, when the user selects Change on an answer, then that step opens and returning goes back to the review.
- [ ] Given the user presses the final submit twice quickly, when both clicks register, then only one submission is made.

**Exceptions**
- Do not split a short form into steps just to look lighter.

**Source:** WCAG 2.2 SC 3.3.4, 3.3.7 (standard); WAI-ARIA aria-current (standard); GOV.UK Check answers pattern and NN/g wizard guidance (convention)

## FE-FORM-04 · File upload field

**Purpose:** Let users attach files with clear limits, per-file status and recovery from failures.
**Triggers:** upload, attach, file picker, drag and drop, choose file, file size, image upload, document upload, avatar upload
**Applies when:** a form accepts one or more files from the user.
**Composes:** FE-FEED-04, FE-FORM-02, BE-FILE-01, BE-FILE-02, BE-FILE-04

**Required**
- R1 A real file chooser button is always present and keyboard operable; drag and drop is an extra, never the only way (WCAG 2.2 SC 2.5.7).
- R2 Accepted types, maximum size and maximum count are stated before choosing; chosen files are checked at once and each rejection gives a plain reason; the server rechecks (CORE F10).
- R3 After choosing, a list shows each file's name, size, status (waiting, uploading with progress, done, failed), a Remove or Cancel control, and Retry for failures (CORE F4 partial).
- R4 One failed file does not fail the others, and the final summary says which succeeded.
- R5 The form warns while uploads are running if the user tries to submit or leave (CORE F8) and blocks double submit (CORE F6).
- R6 File names are displayed as plain text only; replacing a file shows the old one being removed.

**Conditional**
- C1 IF files are images THEN show a thumbnail before upload completes and, when others will see them, ask for a short description (SC 1.1.1).
- C2 IF files can be large or connections poor THEN uploads resume after interruption (BE-FILE-04).
- C3 IF several files are allowed THEN they can be chosen at once and total progress is shown.
- C4 IF files are scanned or processed after upload THEN show a "Checking" status before the file becomes usable.

**Suggest**
- S1 Paste an image from the clipboard — saves a save-then-attach step.
- S2 Shrink large photos before upload — makes uploads faster on phone connections.

**Approval**
- A1 Accepting executable or archive file types — they can carry malicious code.
- A2 Making uploaded files reachable by anyone with the link — private files could leak.

**Backend contract**
- The upload endpoint enforces type, size and count and returns per-file results (BE-FILE-01); files are stored privately with access checks (BE-FILE-02); large uploads can resume (BE-FILE-04).

**Acceptance**
- [ ] Given a file over the size limit, when the user selects it, then it is rejected immediately with the limit stated.
- [ ] Given five files and one fails, when uploads finish, then four show done and one shows failed with Retry.
- [ ] Given a keyboard-only user, when they reach the field, then they can open the file chooser and remove a chosen file.
- [ ] Given an upload is in progress, when the user tries to leave the page, then a warning appears.

**Exceptions**
- A single tiny file input (such as an import of a settings file) may skip the per-file list and show one status line.

**Source:** HTML input type=file (standard); WCAG 2.2 SC 2.5.7, 1.1.1 (standard); OWASP File Upload Cheat Sheet (standard); GOV.UK file upload pattern (convention)

## FE-FORM-05 · Autosave, drafts and unsaved-changes guard

**Purpose:** Never lose what the user typed, and always make clear what is saved and what is not.
**Triggers:** autosave, draft, unsaved changes, leave page, save indicator, discard changes, restore draft, conflict, offline editing
**Applies when:** users edit data that is saved later, or spend more than a minute on one screen.
**Composes:** FE-FEED-01, FE-FEED-03, FE-FORM-02, BE-API-06, BE-API-07

**Required**
- R1 Leaving with unsaved changes (navigation, tab close, closing a dialog) warns and offers Stay, Discard or Save (CORE F8); no warning appears when nothing changed or after a successful save.
- R2 Save state is shown honestly: "Saving…", "Saved at 10:42", or "Couldn't save — Retry"; a failed save keeps a persistent unsaved warning and never reads as saved.
- R3 Autosave is debounced, never moves the cursor or focus, and announces status politely (WCAG 2.2 SC 4.1.3).
- R4 Forms without autosave keep an explicit Save button that is busy only while saving (CORE F6).
- R5 Invalid or incomplete data is not saved as if complete: it is kept as a draft flagged incomplete, or held locally with a message.

**Conditional**
- C1 IF the form is long or creative (documents, posts, notes) THEN autosave drafts and offer "Restore draft?" on return.
- C2 IF the same record can be edited in two places or by two people THEN detect the clash on save and offer Review, Overwrite or Keep mine (BE-API-07).
- C3 IF the user can be offline THEN keep changes locally, show "Offline — changes will sync", and sync on reconnection.
- C4 IF drafts differ from published content THEN label Draft and Published and make publishing an explicit action.

**Suggest**
- S1 Version history with restore — lets people go back to an earlier version.
- S2 Undo and redo inside long text — recovers from accidental edits.

**Approval**
- A1 Storing drafts on the server for people not signed in — it keeps personal data without an account.
- A2 Working offline with later sync — it adds conflict rules and testing effort.

**Backend contract**
- A draft or save endpoint accepts incomplete data flagged as draft; saves carry a version and a clash returns a conflict response (BE-API-07); repeated saves are safe (BE-API-06).

**Acceptance**
- [ ] Given unsaved edits, when the user clicks a navigation link, then a Stay, Discard or Save prompt appears.
- [ ] Given a form with no changes, when the user navigates away, then no prompt appears.
- [ ] Given autosave fails, when the response arrives, then "Couldn't save" stays visible with Retry and the text remains.
- [ ] Given two tabs edit the same record, when the second saves, then the user is offered Review, Overwrite or Keep mine.

**Exceptions**
- One-click toggles and instant-apply settings need no unsaved guard; they confirm each change instead (FE-FEED-01).

**Source:** HTML beforeunload event (standard); WCAG 2.2 SC 4.1.3 (standard); Google Docs, Gmail drafts and Notion autosave (convention)
