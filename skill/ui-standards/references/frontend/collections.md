# FE-COLL · Collections, search and detail

Load for screens that show many records or one record in depth: tables, lists, grids, search, filters, paging, detail pages, dashboards.

## FE-COLL-01 · Data table

**Purpose:** Present records in rows and columns that can be scanned, sorted and acted on, by mouse, touch and keyboard.
**Triggers:** table, grid, spreadsheet, columns, rows, sortable, sticky header, data list, admin list, records, export
**Applies when:** each record has several attributes users compare across records.
**Composes:** FE-COLL-03, FE-COLL-04, FE-COLL-05, FE-SEL-01, FE-SHELL-03, BE-API-04

**Required**
- R1 Use a true table with header cells and a name or caption; every row action is named for its row ("Delete Intro.mp3") (CORE F2).
- R2 The header row stays visible while scrolling; when columns overflow, the table scrolls inside its own container and the identifying first column stays visible (WCAG 2.2 SC 1.4.10 exception).
- R3 Sortable headers are buttons that show the sort direction visually and to assistive technology; only one sort is active (FE-COLL-04).
- R4 Numbers are right-aligned with consistent decimals, text left-aligned, dates in the user's locale (CORE D1); long text truncates with the full value available on focus or expand; empty cells show "—".
- R5 The table implements the five states in place (CORE F4): skeleton rows, empty versus no-results (FE-COLL-03), error with retry, partial.
- R6 Rows that open a detail contain a real link in the name cell; whole-row click is an addition, never the only way (CORE F1).
- R7 When paginated, show the visible range and total ("Showing 1–25 of 240") (FE-COLL-05).

**Conditional**
- C1 IF users can pick rows THEN apply FE-SEL-01.
- C2 IF there are many columns THEN users can show or hide columns and the choice is remembered.
- C3 IF the screen is narrow THEN each row becomes a labelled card or the table scrolls (FE-SHELL-03).
- C4 IF cells are editable in place THEN Enter starts editing, Escape cancels, arrow keys move between cells, and each save is confirmed.

**Suggest**
- S1 Show or hide columns — lets each person keep only what they use.
- S2 Export the current view as a spreadsheet file — lets the owner work with data elsewhere.
- S3 Saved views of filters and sort — saves rebuilding common searches.
- S4 Compact and comfortable row density — fits more rows for power users.

**Approval**
- A1 Exporting personal data of other people — raises privacy and consent questions.

**Backend contract**
- The list endpoint does paging, sorting and filtering on the server, returns a total count and uses a stable sort with an id tiebreaker (BE-API-04).

**Acceptance**
- [ ] Given a long table, when the user scrolls down, then the header row stays visible.
- [ ] Given a screen reader user, when they move through a row, then each cell announces its column header.
- [ ] Given the list request fails, when the table renders, then an error with Retry appears inside the table area.
- [ ] Given a sorted column, when the user activates its header, then the direction toggles and is announced.

**Exceptions**
- Do not use a table for layout or for lists of three or fewer fields per record; use FE-COLL-02.

**Source:** WAI-ARIA APG Table and Sortable Table patterns; HTML table; WCAG 2.2 SC 1.3.1, 1.4.10 (standard); NN/g data table guidance (convention)

## FE-COLL-02 · Lists and card grids

**Purpose:** Show collections of items where each item is a unit, such as a recording, contact or project.
**Triggers:** list, cards, grid, gallery of items, tiles, thumbnails, feed, items, library, my projects
**Applies when:** records have a title, perhaps an image, and a few details, and are browsed rather than compared.
**Composes:** FE-COLL-03, FE-COLL-04, FE-COLL-05, FE-SEL-01, FE-SHELL-03, BE-API-04

**Required**
- R1 Use list semantics; each item has a title that is the link or primary action; secondary actions are separate controls, so there are no nested interactive conflicts.
- R2 Every card has the same structure; a missing value keeps its place with a placeholder; images have a description or are marked decorative; image areas reserve their size so nothing jumps when they load.
- R3 The collection implements the five states (CORE F4): skeleton cards, empty with a next action, no-results (FE-COLL-03), error with retry, partial.
- R4 The current order is stated ("Newest first") and changeable where more than one order is meaningful (FE-COLL-04).
- R5 Long lists are paged or loaded in increments (FE-COLL-05, CORE D3).
- R6 The grid reflows to one column at 320 px and keeps targets apart (FE-SHELL-03).

**Conditional**
- C1 IF items have a status THEN show it as text plus icon, in the same words everywhere (CORE F3).
- C2 IF users can switch between list and grid THEN remember the choice.
- C3 IF items have an overflow menu THEN its button names the item ("More actions for Intro").
- C4 IF items can be selected THEN apply FE-SEL-01.

**Suggest**
- S1 A list or grid toggle — lets people choose between scanning and browsing.
- S2 A compact density option — shows more items at once.

**Approval**
- None.

**Backend contract**
- The list endpoint pages results (BE-API-04) and returns small thumbnails rather than full-size images.

**Acceptance**
- [ ] Given a collection with no items, when it loads, then it explains what belongs here and offers a create action.
- [ ] Given a card with an overflow menu, when a screen reader reaches the menu button, then the name includes the item's title.
- [ ] Given images load slowly, when the grid renders, then cards keep their size with no layout jump.
- [ ] Given a 320 px viewport, when the grid renders, then items show in a single column.

**Exceptions**
- A short fixed menu of options (under about six) may be a plain list without paging or states.

**Source:** HTML lists; WCAG 2.2 SC 1.3.1, 1.1.1 (standard); Material 3 Cards and Lists, Apple HIG Collections (convention)

## FE-COLL-03 · Search

**Purpose:** Let users find a record by typing, with results that are shareable and explained.
**Triggers:** search, search box, find, look up, query, search results, no results, autocomplete, global search
**Applies when:** a collection can grow beyond what is easy to scan, about 20 items or more.
**Composes:** FE-COLL-04, FE-COLL-05, FE-SHELL-02, BE-API-04, BE-DATA-07

**Required**
- R1 The search field is in a search landmark with a visible label or a named icon button; it shows a clear button once text exists; Enter submits and Escape clears.
- R2 The search text is in the address (?q=) so results survive refresh, sharing and Back (FE-SHELL-02); typing replaces the history entry and submitting adds one.
- R3 Search-as-you-type is delayed briefly (about 300 ms) and only the latest query's results are shown; slow searches show busy state (CORE F6); otherwise search runs on submit.
- R4 Results show a count ("12 results for 'intro'") announced politely (WCAG 2.2 SC 4.1.3) and highlight the matched text; the ordering is stated.
- R5 "Empty" and "no results" differ: no results says "No results for 'xyz'", lists the active filters and offers Clear search and filters; an empty collection explains how to add the first item (CORE F4).
- R6 Search is forgiving: ignores case and extra spaces, tolerates accents, and handles quotes and symbols without errors.

**Conditional**
- C1 IF results span several record types THEN group by type with counts.
- C2 IF the dataset is large THEN search runs on the server with paging (BE-DATA-07, BE-API-04).
- C3 IF filters exist THEN search and filters combine and "Clear all" resets both (FE-COLL-04).

**Suggest**
- S1 Recent searches — saves retyping.
- S2 Suggestions while typing — gets people to the right item sooner.
- S3 A "/" shortcut to focus search that can be switched off — speeds up keyboard users.

**Approval**
- A1 Search that reaches other users' content — raises privacy questions.

**Backend contract**
- The list endpoint accepts a search term (BE-API-04); matching and ranking follow BE-DATA-07; results only include records the caller may see (CORE F11).

**Acceptance**
- [ ] Given the user searches "intro", when results load, then the address contains the query and a refresh shows the same results.
- [ ] Given a search with no matches, when results load, then the message shows the query and a Clear action, not a blank list.
- [ ] Given the user types quickly, when two requests overlap, then only the latest query's results are shown.
- [ ] Given a query containing a quote and a percent sign, when searched, then results or no-results appear with no error.

**Exceptions**
- Collections of ten or fewer items do not need search.

**Source:** WAI-ARIA APG Landmarks (search); WCAG 2.2 SC 4.1.3, 2.1.4 (standard); NN/g search usability guidance (convention)

## FE-COLL-04 · Filter and sort

**Purpose:** Let users narrow and order a collection while always seeing what is applied.
**Triggers:** filter, sort, order by, chips, facets, status filter, date range, clear filters, newest first, refine
**Applies when:** records have attributes users commonly use to narrow or reorder them.
**Composes:** FE-COLL-01, FE-COLL-03, FE-COLL-05, FE-SHELL-02, BE-API-03, BE-API-04

**Required**
- R1 Filter controls are labelled by their field; applied filters show as chips ("Status: Active ×"), each removable by keyboard, with a "Clear all" control whenever any filter is active.
- R2 Filter, sort, search and page state live in the address (?status=active&sort=-created&page=2) so refresh, sharing and Back work (FE-SHELL-02); changing a filter resets to page 1.
- R3 Applying a filter updates the result count, announces it politely, and keeps focus on the control used.
- R4 The current sort field and direction are visible, the default is stated, and the sort is stable with a tiebreaker.
- R5 Filters that return nothing show the no-results state with the active filters and Clear all (FE-COLL-03).
- R6 Combining rules are consistent: choices within one filter match any of them, different filters must all match.

**Conditional**
- C1 IF there are many filters THEN narrow screens put them in a panel with Apply and show the active count on its button ("Filters (3)").
- C2 IF dates are filtered THEN offer presets (Today, Last 7 days, Custom range) in the user's locale.
- C3 IF counts show beside options THEN they update with the other active filters.
- C4 IF filters persist between visits THEN they still appear as chips so they are never hidden.

**Suggest**
- S1 Saved views — lets people reuse a favourite combination.
- S2 Counts beside each option — shows what a filter will return before applying it.

**Approval**
- None.

**Backend contract**
- Filter and sort parameters are allow-listed; unknown parameters return a validation error (BE-API-03, BE-API-04); the response includes the total.

**Acceptance**
- [ ] Given a status filter is applied, when the user reloads, then the same filter and results remain.
- [ ] Given two filters are active, when the user activates Clear all, then both clear and the full list returns.
- [ ] Given the user is on page 3, when they change a filter, then results restart at page 1.
- [ ] Given a screen reader user applies a filter, when results update, then the new count is announced.

**Exceptions**
- Do not add filters nobody can use; only offer attributes that vary across records.

**Source:** WCAG 2.2 SC 4.1.3 (standard); WAI-ARIA APG Disclosure pattern (standard); Material 3 Filter chips and NN/g filtering guidance (convention)

## FE-COLL-05 · Pagination and incremental loading

**Purpose:** Load long collections in manageable parts without losing the user's place.
**Triggers:** pagination, next page, load more, infinite scroll, page size, page numbers, show more, lazy loading, long list
**Applies when:** a collection can exceed 50 items.
**Composes:** FE-COLL-01, FE-COLL-02, FE-SHELL-02, BE-API-04

**Required**
- R1 Collections over 50 items are never loaded in full (CORE D3); use numbered pages for tables, and a "Load more" button for card lists and feeds; searching a list keeps that list's own style.
- R2 Pagination sits in a labelled navigation landmark with Previous, Next and page numbers; the current page is marked; Previous is disabled on the first page.
- R3 The position is shown ("Showing 26–50 of 240") and the page is in the address (FE-SHELL-02); changing page moves focus to the results heading and scrolls to the top.
- R4 "Load more" adds items below without moving focus or scroll, announces "25 more loaded" politely, shows busy, and on failure keeps what is loaded and offers retry.
- R5 Going Back from a detail restores the same page or loaded items and scroll (FE-SHELL-02).
- R6 Items added or removed while browsing do not cause duplicates or skipped items.

**Conditional**
- C1 IF infinite scroll is used THEN a keyboard-reachable way to the page footer exists, position is never lost, and the feed role with item positions is used.
- C2 IF counting every result is slow THEN show "25+ results" instead of an exact total.
- C3 IF users benefit from choosing density THEN offer a page size choice (25, 50, 100) that is remembered.

**Suggest**
- S1 A "Back to top" button after long scrolls — saves effort on phones.
- S2 A page size selector — lets power users see more at once.

**Approval**
- None.

**Backend contract**
- Pagination is by cursor or offset with a stable sort, a total or next-cursor, and a server-side maximum page size (BE-API-04).

**Acceptance**
- [ ] Given 240 items, when the list opens, then only the first page loads and a position line shows.
- [ ] Given the user selects Load more and it fails, when the error appears, then already loaded items stay and Retry is offered.
- [ ] Given the user opens an item from page 3, when they press Back, then page 3 shows at the same scroll position.
- [ ] Given a keyboard user changes page, when it loads, then focus lands on the results heading.

**Exceptions**
- Collections guaranteed to stay small (under 50) may show everything.

**Source:** WAI-ARIA APG Feed pattern; WCAG 2.2 SC 2.4.3 (standard); NN/g pagination versus infinite scrolling guidance (convention)

## FE-COLL-06 · Detail view

**Purpose:** Show one record fully, with its actions, related items and history, at its own address.
**Triggers:** detail page, view item, record page, profile page, open item, item details, edit button, master detail, side panel
**Applies when:** users open a single record from a collection or a link.
**Composes:** FE-COLL-01, FE-COLL-02, FE-FEED-02, FE-FORM-05, FE-SHELL-06, BE-API-01, BE-API-07

**Required**
- R1 The detail has its own address, uses the record's name as heading and page title (CORE D6), and Back returns to the originating list state (FE-SHELL-02).
- R2 It implements the five states (CORE F4): skeleton, not-found or no-access (FE-SHELL-06), error with retry, and partial where sections that fail load independently with their own retry.
- R3 Primary actions (Edit, Share, Delete) are grouped consistently; destructive ones are separated (FE-FEED-02); actions the user lacks permission for are hidden or disabled with a reason.
- R4 Fields are grouped under labelled sections; empty values show "—" or "Not set" with an Add link; times are local (CORE D1); statuses use text plus icon.
- R5 Created and last-updated times (and who, where several people edit) are visible (CORE D2).

**Conditional**
- C1 IF list and detail show side by side THEN the selected item is in the address, and on narrow screens the detail replaces the list with a Back control.
- C2 IF the record has related collections (comments, files) THEN each is a section with its own count, paging and empty state.
- C3 IF users step through records THEN Previous and Next keep the list's filters and order.
- C4 IF the record is shareable THEN a Copy link control confirms the copy (FE-FEED-01).

**Suggest**
- S1 Previous and Next buttons — speeds up reviewing many records.
- S2 An activity history of changes — shows who changed what and when.
- S3 Print or export of one record — helps with sharing outside the app.

**Approval**
- A1 Showing the activity history to every user — it reveals who did what.

**Backend contract**
- The single-record read returns not-found for missing records, and also for forbidden ones when existence is sensitive, includes updated time or version for later saves, and only the fields the caller may see (BE-API-01, BE-API-07).

**Acceptance**
- [ ] Given a record's detail is open, when the user refreshes, then the same record appears.
- [ ] Given the related comments request fails, when the page renders, then the rest of the record shows and the comments section has a Retry.
- [ ] Given a user without edit rights, when they open the record, then Edit is hidden or disabled with a reason.
- [ ] Given the user opens an unknown id, when the address loads, then the not-found page appears (FE-SHELL-06).

**Exceptions**
- Very small records may be edited in place in the list without a separate detail view.

**Source:** WCAG 2.2 SC 1.3.1, 2.4.2, 2.4.6 (standard); Material 3 List-detail canonical layout and NN/g content page guidance (convention)

## FE-COLL-07 · Dashboard and summary cards

**Purpose:** Give an at-a-glance, trustworthy view of the numbers and trends the owner cares about.
**Triggers:** dashboard, summary, KPI, statistics, metrics, chart, graph, overview, totals, report, analytics, cards
**Applies when:** users need counts, totals or trends before deciding where to go next.
**Composes:** FE-COLL-04, FE-ACCT-05, FE-SHELL-02, FE-SHELL-05, BE-API-04, BE-JOB-02, BE-JOB-03

**Required**
- R1 Each card shows a label, a value with units, the period or scope ("Last 30 days"), and when it was last updated; numbers follow the user's locale (FE-SHELL-05).
- R2 Each card has its own loading, empty, error and retry states; one failed card never blanks the dashboard (CORE F4 partial); skeletons keep their size.
- R3 A card links to the filtered list behind its number, and that list shows the same count.
- R4 Every chart has a title, a one-sentence takeaway and an accessible alternative such as a data table; meaning is never colour alone (CORE F3; WCAG 2.2 SC 1.1.1, 1.4.1, 1.4.11).
- R5 The first screen shows the three to six numbers that matter most, ordered by importance.
- R6 A new account's empty dashboard says how to get data and what to do next, not rows of zeros (FE-ACCT-05).

**Conditional**
- C1 IF the period is selectable THEN one control sets it for all cards, it is in the address (FE-SHELL-02), and each card states it.
- C2 IF a value compares with a previous period THEN the change appears as text with direction ("+12% vs previous 30 days").
- C3 IF data is not live THEN state how often it refreshes and offer Refresh.
- C4 IF the screen mixes personal and team numbers THEN each card says which scope it shows.

**Suggest**
- S1 Auto-refresh with a pause control — keeps live screens current without surprises.
- S2 Export a report as PDF or spreadsheet — helps share results with others.
- S3 Choose and reorder cards — lets each person focus on their own numbers.

**Approval**
- A1 Scheduled reports sent by email — involves recipients' data and an email service (BE-JOB-02, BE-JOB-03).

**Backend contract**
- Summary endpoints return aggregates with period and generated time, scoped to what the caller may see (CORE F11), reuse the list filters (BE-API-04), and expensive ones are precomputed (BE-JOB-02).

**Acceptance**
- [ ] Given one summary request fails, when the dashboard loads, then only that card shows an error with Retry.
- [ ] Given a card shows 42 recordings, when the user selects it, then the filtered list shows 42 recordings.
- [ ] Given a chart, when a screen reader reaches it, then a summary and a data table alternative are available.
- [ ] Given a brand-new account, when the dashboard loads, then it shows guidance instead of zeros.

**Exceptions**
- An app with one core list may use the list itself as home instead of a dashboard.

**Source:** WCAG 2.2 SC 1.1.1, 1.4.1, 1.4.11, 2.2.2 (standard); NN/g dashboard guidance and Apple HIG Charting data (convention)
