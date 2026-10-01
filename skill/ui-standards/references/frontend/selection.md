# FE-SEL · Selection and ordering

Load when users pick one or many things from a set, choose from options, tag items, or reorder them.

## FE-SEL-01 · Multi-select collection and bulk actions

**Purpose:** Let users pick several items and act on them together.
**Triggers:** select multiple, checkboxes, select all, bulk delete, bulk edit, inbox, batch action, multi-select, selection toolbar
**Applies when:** users can perform a meaningful action on more than one item at once.
**Composes:** FE-COLL-01, FE-COLL-02, FE-FEED-02, BE-API-05, BE-API-06

**Required**
- R1 One selection control per item, with an accessible name naming the item ("Select Intro.mp3"); its target is at least 24 × 24 px (CORE F9).
- R2 A select-all control has three states: none, all, and mixed (some selected); expose mixed programmatically (`aria-checked="mixed"` or the platform equivalent). Activating it from mixed resolves predictably (default: select all on this page) and never stays mixed.
- R3 The selected count is visible and announced politely whenever at least one item is selected; an action bar appears naming the available actions and disables those that do not apply.
- R4 Selection survives sorting and paging; it clears when a filter or search changes the set, and clears after an action completes except for items that failed.
- R5 Row behaviour is unambiguous: clicking the name opens the item, the checkbox selects, and one click never does both.
- R6 Bulk actions return a result per item (CORE F4 partial); the user sees which items failed and why, and failed items stay selected for retry.

**Conditional**
- C1 IF results span pages THEN state the select-all scope ("this page" or "all 240 results") and offer the wider scope as an explicit extra step.
- C2 IF the bulk action is destructive THEN apply FE-FEED-02 (confirm or undo) and state the count in the confirmation.
- C3 IF the action applies to all matching items including ones not loaded THEN the confirmation states the full count and the active filters.
- C4 IF the screen is used on touch devices THEN a Select mode (long-press or a Select button) shows checkboxes and a Cancel control, and the action bar sits within thumb reach; Escape or Cancel exits selection.

**Suggest**
- S1 Shift-click range selection — saves time for power users with long lists.
- S2 Ctrl or Cmd plus A to select the page when the list has focus — matches desktop habits.
- S3 Remember the last used bulk action — speeds up repeated clean-up.

**Approval**
- A1 Bulk delete with no recovery path — a single slip could remove many items for good.
- A2 "Select all results" applying to items the user has not seen — the action reaches beyond what is visible.

**Backend contract**
- The bulk endpoint accepts a list of ids (or a filter for "all matching"), checks permission per item (CORE F11), caps the batch size, returns per-item results (BE-API-05) and is safe to repeat (BE-API-06).

**Acceptance**
- [ ] Given no items selected, when the list renders, then select-all is unchecked and bulk actions are hidden or disabled.
- [ ] Given some items selected, when the user looks at select-all, then it shows the mixed state.
- [ ] Given a bulk action fails for 2 of 10 items, when it completes, then the user sees which 2 failed and they remain selected.
- [ ] Given 25 items on this page of 240 are selected via select-all, when the banner shows, then it offers "Select all 240" as a separate step.
- [ ] Given the user changes a filter, when the list updates, then the selection clears and the count disappears.

**Exceptions**
- Do not add checkboxes when the only action is opening a single item.

**Source:** WAI-ARIA APG Checkbox (mixed-state) pattern; WCAG 2.2 SC 4.1.3, 2.5.8 (standard); Gmail, Outlook, Finder (convention)

## FE-SEL-02 · Single choice

**Purpose:** Pick the right control for choosing one option, and make its state and consequences clear.
**Triggers:** radio buttons, dropdown, select, toggle, switch, segmented control, choose one, option, checkbox, setting on off
**Applies when:** the user chooses one value from a set, or turns one thing on or off.
**Composes:** FE-SEL-03, FE-FORM-01, FE-FORM-02, BE-API-01, BE-API-03

**Required**
- R1 Control follows option count: up to five options use radio buttons or a segmented control with all options visible; about six to fifteen use a select; more than about fifteen, or options loaded from data, use a searchable picker (FE-SEL-03).
- R2 A radio group has a group label; it starts unselected unless a safe, sensible default exists; arrow keys move and select within the group, and Tab treats the group as one stop (APG Radio Group).
- R3 A switch applies at once and is labelled for what it controls ("Email notifications"); its state is shown in text or an icon, not colour alone; a checkbox is used when the choice applies only on Save. Do not mix both models in one section.
- R4 Unavailable options say why in text rather than only looking greyed out; the selected option is distinguishable without colour (CORE F3).
- R5 Prefer the native select control so phone pickers and typing to jump work; a custom select follows the APG select-only combobox or listbox pattern.

**Conditional**
- C1 IF a "Select…" placeholder exists THEN it is not a valid value and required validation applies (FE-FORM-02).
- C2 IF the choice reveals further fields THEN they appear directly after the control without moving focus.
- C3 IF options come from the server THEN the control has loading, empty and error states (CORE F4).
- C4 IF "None" or "Other" exists THEN it comes last and "Other" reveals a text field.

**Suggest**
- S1 A short description under each radio option — helps people choose without guessing.
- S2 Card-style options with icons for big decisions such as plans — makes choices easier to compare.

**Approval**
- None.

**Backend contract**
- Options have stable ids or codes separate from display text (BE-API-01); the server checks the chosen value is in the allowed set (BE-API-03).

**Acceptance**
- [ ] Given a radio group, when the user presses the Down arrow, then the next option is selected and focus moves with it.
- [ ] Given a switch labelled "Email notifications", when toggled, then the change is saved at once and confirmed.
- [ ] Given a disabled option, when the user views it, then text explains why it is unavailable.
- [ ] Given a required select left on its placeholder, when the user submits, then a validation error appears.

**Exceptions**
- A yes or no question inside a form that saves with Save may use a checkbox or a pair of radios instead of a switch.

**Source:** WAI-ARIA APG Radio Group, Switch, Listbox and Combobox (select-only) patterns; HTML select and input type=radio (standard); Material 3 Segmented buttons and Switch, Apple HIG Toggles (convention)

## FE-SEL-03 · Searchable picker and tag input

**Purpose:** Let users choose from many options, or add several tags, by typing.
**Triggers:** autocomplete, combobox, typeahead, picker, tags, chips input, assign user, choose person, multi-select dropdown, labels
**Applies when:** the option list is long, remote, or the user may add free-form values.
**Composes:** FE-SEL-02, FE-FORM-02, BE-API-04, BE-API-03, BE-DATA-07, BE-AUTH-05

**Required**
- R1 The input is a combobox: it announces expanded state and the list of options; Down and Up arrows move through options, Enter picks, Escape closes the list (then clears), and the active option has a visible focus (APG Combobox).
- R2 Matching ignores case and accents and matches anywhere in the text, highlighting the match; "No matches" appears when empty; remote options are fetched after a short pause and only the latest request counts, with a loading indicator.
- R3 Chosen values stay visible; in multi-select each appears as a chip with a Remove button named for it ("Remove Marketing"), and Backspace in an empty input removes the last chip.
- R4 It is explicit whether free text is allowed: either only listed values can be chosen (unmatched text is flagged or reverted on leaving), or a visible "Create 'xyz'" option exists; duplicates are prevented and text is trimmed.
- R5 On small screens the list is not hidden by the on-screen keyboard and options meet touch target sizes; a Clear control unsets the choice.

**Conditional**
- C1 IF options number in the hundreds or live on the server THEN fetch matches as the user types with a limit and paging (BE-API-04, BE-DATA-07).
- C2 IF the field is a tag input THEN Enter or comma commits a tag, pasted comma- or line-separated text splits into several tags, and maximum counts and lengths are stated.
- C3 IF the picker chooses people THEN show name plus a distinguishing detail (email or avatar) and list only people the user may see (BE-AUTH-05, CORE F11).
- C4 IF a new option is created THEN it is saved with feedback and only permitted users can create it.

**Suggest**
- S1 Recently used options first — shortens repeat selections.
- S2 Suggest existing tags while typing — keeps tags consistent and avoids near-duplicates.

**Approval**
- A1 Letting any user create tags or values everyone sees — lists can become cluttered without moderation.

**Backend contract**
- The options endpoint accepts a text query and a limit (BE-API-04); creating a tag validates and de-duplicates ignoring case (BE-API-03) and returns a stable id.

**Acceptance**
- [ ] Given the user types "mar", when options filter, then matches anywhere in the text show with the match highlighted.
- [ ] Given a list is open, when the user presses Escape, then the list closes and focus stays in the input.
- [ ] Given three chips, when the user activates "Remove Sales", then that chip is removed and focus moves to a sensible neighbour.
- [ ] Given a tag already exists, when the user adds it again, then no duplicate appears.

**Exceptions**
- Short, fixed lists use FE-SEL-02 instead.

**Source:** WAI-ARIA APG Combobox with listbox popup and Editable Combobox patterns; WCAG 2.2 SC 4.1.2, 2.1.1 (standard); Material 3 Input chips (convention)

## FE-SEL-04 · Drag to reorder

**Purpose:** Let users arrange items in their own order, by dragging or by keyboard.
**Triggers:** drag and drop, reorder, sort manually, move up, move down, rearrange, kanban, playlist order, priority order
**Applies when:** the order of items is chosen by the user and saved.
**Composes:** FE-COLL-02, FE-FEED-01, BE-API-01, BE-API-07

**Required**
- R1 Every drag-to-reorder has a non-drag alternative operable by keyboard and pointer: Move up and Move down buttons or a "Move to position" menu (WCAG 2.2 SC 2.5.7, 2.1.1).
- R2 Dragging starts from a visible handle named for the item ("Reorder Intro.mp3"); on touch, dragging needs the handle or a long-press so normal scrolling still works.
- R3 While dragging, the lifted item and a clear drop position are shown, the page scrolls near edges, and Escape cancels and returns the item.
- R4 Keyboard moves announce the result politely ("Intro moved to position 3 of 8") and keep focus on the moved item.
- R5 The new order is saved on drop with feedback (CORE D5); on failure the item snaps back and the error says so (CORE F4); the order persists across reloads.

**Conditional**
- C1 IF the list is sorted, filtered or paged THEN reordering is available only in the full manual-order view, otherwise disabled with an explanation.
- C2 IF items move between lists or columns THEN a "Move to…" menu is also offered and each list's item count updates and is announced.
- C3 IF items can be dropped into containers (folders) THEN valid targets highlight and invalid ones are marked.
- C4 IF reduced motion is requested THEN items move without flying animations (CORE F7).

**Suggest**
- S1 Undo of the last reorder — recovers from a mis-drop.
- S2 A "Sort automatically" button (A to Z, newest) — replaces slow manual arranging.

**Approval**
- None.

**Backend contract**
- Order is stored as an explicit position per item and updated by one request that moves an item before or after another; clashes return a conflict (BE-API-01, BE-API-07); only permitted users may reorder (CORE F11).

**Acceptance**
- [ ] Given a keyboard-only user, when they focus an item's Move down button and press Enter, then the item moves and the new position is announced.
- [ ] Given a drag in progress, when the user presses Escape, then the item returns to its original place.
- [ ] Given the order save fails, when the response arrives, then the item snaps back and an error appears.
- [ ] Given the list is sorted by name, when the user looks for reorder handles, then they are disabled with an explanation.

**Exceptions**
- If the order carries no meaning, do not offer reordering.

**Source:** WCAG 2.2 SC 2.5.7 Dragging Movements, 2.1.1 Keyboard (standard); WAI-ARIA live regions (standard); Apple HIG Drag and drop and Trello, Notion (convention)
