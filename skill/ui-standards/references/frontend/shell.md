# FE-SHELL · App shell and navigation

Load for any app with more than one screen: the frame, navigation, addresses, responsiveness, theme, language and app-level error pages.

## FE-SHELL-01 · App shell and primary navigation

**Purpose:** Give every screen the same frame so users always know where they are and how to get anywhere else.
**Triggers:** navigation, menu, sidebar, header, top bar, tabs, app frame, layout, breadcrumbs, logo, home link, account menu, skip link
**Applies when:** the app has more than one screen.
**Composes:** FE-SHELL-02, FE-SHELL-03, FE-ACCT-02, FE-ACCT-07

**Required**
- R1 A persistent shell appears on every signed-in screen: app name or logo linking to the home screen, primary navigation, and an account menu.
- R2 Navigation items are real links inside a labelled navigation landmark; the current item is marked both visibly and programmatically (aria-current="page").
- R3 A "Skip to main content" link is the first focusable element (WCAG 2.2 SC 2.4.1); each screen has one main landmark and one top-level heading.
- R4 Navigation order and labels are identical on every screen (SC 3.2.3 Consistent Navigation); labels use words the user knows, not internal jargon.
- R5 Keep primary navigation to about seven destinations; group or move the rest into a secondary menu.
- R6 Menus opened by a button (account menu, overflow) close on Escape and return focus to that button.

**Conditional**
- C1 IF the user is signed out THEN the shell shows only public destinations plus sign in and sign up.
- C2 IF a destination is not allowed for the user's role THEN hide it from navigation, and the screen still shows a no-permission state when opened by address (CORE F4).
- C3 IF screens nest more than two levels deep THEN show breadcrumbs where each ancestor is a link and the current page is plain text.
- C4 IF the header or navigation is sticky THEN it must not hide a focused control (SC 2.4.11 Focus Not Obscured (Minimum)).

**Suggest**
- S1 Collapsible sidebar that remembers its state — gives more room to people who work in wide tables.
- S2 Quick-jump search to open any screen by name — saves clicks in apps with many screens.
- S3 A keyboard-shortcut help sheet opened with "?" — helps frequent users work faster.

**Approval**
- A1 Moving existing screens to different places in navigation of an app people already use — they will look in the old place.

**Backend contract**
- Role-based visibility reads the caller's role from the session (BE-AUTH-05); the server still enforces access on every request.

**Acceptance**
- [ ] Given a signed-in user on any screen, when the page loads, then the same navigation appears with the current destination marked.
- [ ] Given a keyboard user, when they press Tab first on a page, then a skip link appears and activating it moves focus to the main content.
- [ ] Given the account menu is open, when the user presses Escape, then it closes and focus returns to the account button.
- [ ] Given a user without permission for a destination, when they view navigation, then that destination is not listed.

**Exceptions**
- A single-screen tool needs no navigation; with three or fewer destinations, plain header links or tabs are enough and a sidebar is not needed.

**Source:** WCAG 2.2 SC 2.4.1, 3.2.3, 2.4.11; WAI-ARIA APG Landmarks, Breadcrumb, Menu Button (standard); Apple HIG Navigation and Material 3 Navigation (convention)

## FE-SHELL-02 · Routing, deep links and back behaviour

**Purpose:** Give every screen and meaningful state an address so links, refresh and the Back button behave as people expect.
**Triggers:** URL, deep link, back button, refresh, bookmark, share link, routing, history, redirect, scroll position, return to previous, page title
**Applies when:** the app is a web app or has several screens a user can move between.
**Composes:** FE-SHELL-06, FE-COLL-04, FE-COLL-05, FE-COLL-06, FE-FORM-05, FE-ACCT-02

**Required**
- R1 Each screen has its own readable address (for example /recordings/123) and a unique page title (CORE D6); on in-app navigation the title updates and focus moves to the new screen's heading.
- R2 Back and Forward move between screens as users expect; redirects replace the history entry so Back never bounces the user forward again.
- R3 Refreshing or sharing an address reopens the same screen showing the same content, including the open item, active tab and list state (FE-COLL-04).
- R4 Going Back to a list restores its scroll position, filters, sort and page.
- R5 A protected address opened while signed out leads to sign in, then returns to that address; only same-site paths are accepted as the return target.
- R6 Navigation uses real links (open in a new tab, copy address); actions that change data use buttons.

**Conditional**
- C1 IF a link opens in a new tab or leaves the app THEN its accessible name says so and it uses no opener access (rel="noopener").
- C2 IF an address is renamed or moved after launch THEN the old address redirects to the new one.
- C3 IF the screen holds unsaved changes THEN apply FE-FORM-05 before navigating away.
- C4 IF the id in the address does not exist or the user may not open it THEN show FE-SHELL-06.

**Suggest**
- S1 Reopen the screen the user last visited when they return — saves them finding their place.
- S2 Readable names in addresses (a title slug) — makes shared links recognisable.

**Approval**
- A1 Changing addresses of a live app without redirects — people's bookmarks and shared links would stop working.

**Backend contract**
- Hosting serves the app for every client-routed address so refresh does not return a server error; unknown API paths return 404 in the BE-API-02 error format; the post-sign-in return path is validated (BE-AUTH-02).

**Acceptance**
- [ ] Given the user is on a record's detail screen, when they refresh the browser, then the same record is shown.
- [ ] Given the user scrolled to page 3 of a list and opened an item, when they press Back, then the list shows page 3 at the same scroll position.
- [ ] Given a signed-out visitor opens a protected address, when they sign in, then they land on that address and not on the home screen.
- [ ] Given a sign-in redirect target pointing to another website, when sign-in completes, then the user goes to the app home instead.

**Exceptions**
- A kiosk or embedded single-view app may skip per-screen addresses; still keep titles and focus handling.

**Source:** WCAG 2.2 SC 2.4.2, 3.2.3; HTML History API (standard); OWASP Unvalidated Redirects and Forwards Cheat Sheet (standard); NN/g guidance on the Back button (convention)

## FE-SHELL-03 · Responsive layout

**Purpose:** Keep every screen usable on phones, tablets and desktops, at zoomed text sizes, and with touch or mouse.
**Triggers:** responsive, mobile, tablet, phone, breakpoint, narrow screen, zoom, touch target, orientation, small screen, reflow
**Applies when:** the app runs in a browser or on devices with different screen sizes.
**Composes:** FE-SHELL-01, FE-COLL-01, FE-COLL-02, FE-FEED-03

**Required**
- R1 Layout reflows from 320 CSS px wide up to desktop with no sideways scrolling of the page, including at 400% zoom (WCAG 2.2 SC 1.4.10); only data tables and maps may scroll inside their own container.
- R2 Navigation adapts: full on wide screens, compact (menu button or bottom bar) on narrow ones, with the same destinations.
- R3 Primary touch controls are at least 44 × 44 px with spacing between them (Apple HIG); CORE F9 sets the 24 × 24 px floor.
- R4 Text can be enlarged to 200% without clipped or overlapping content (SC 1.4.4); no fixed heights that cut text.
- R5 Pinch-zoom is never disabled; the on-screen keyboard never covers the focused input; device safe areas (notches, home bar) are respected.
- R6 Hover only adds extras: every action revealed on hover is also reachable by tap and keyboard focus.

**Conditional**
- C1 IF a data table is wide THEN narrow screens either scroll it inside its container with the identifying column kept visible or stack rows as cards (FE-COLL-01, FE-COLL-02).
- C2 IF the app is used on phones THEN it works in portrait and landscape unless one orientation is essential (SC 1.3.4).
- C3 IF a dialog appears on a narrow screen THEN it becomes a full-width sheet with fixed header and action row (FE-FEED-03).

**Suggest**
- S1 Bottom navigation bar on phones for three to five main destinations — keeps main actions within thumb reach.
- S2 Print-friendly layout for screens people print — gives clean invoices and reports on paper.

**Approval**
- A1 Hiding features on small screens that exist on desktop — some users only have a phone.

**Backend contract**
- None.

**Acceptance**
- [ ] Given a 320 px wide viewport, when any screen loads, then the page does not scroll sideways and no content is cut off.
- [ ] Given browser zoom at 400%, when the user views a form, then every field and button remains reachable without horizontal page scroll.
- [ ] Given a touch device, when the user taps primary buttons, then each target is at least 44 × 44 px and not touching another target.
- [ ] Given an action revealed on hover, when a touch or keyboard user visits the screen, then the same action is available without hovering.

**Exceptions**
- Large canvases (maps, drawings, spreadsheets) may need two-dimensional scrolling inside their own region.

**Source:** WCAG 2.2 SC 1.4.10, 1.4.4, 1.3.4, 2.5.8 (standard); Apple HIG Layout and Material 3 adaptive layout window size classes (convention)

## FE-SHELL-04 · Theme and appearance

**Purpose:** Present one consistent look that follows the user's device preferences and stays readable in light and dark.
**Triggers:** dark mode, light mode, theme, appearance, colours, contrast, high contrast, reduced motion, branding, accent colour
**Applies when:** the app shows its own interface (almost always).
**Composes:** FE-SHELL-05, FE-ACCT-04

**Required**
- R1 The app follows the device's light or dark preference by default; both themes meet WCAG 2.2 AA contrast (CORE F3), including focus rings and component borders (SC 1.4.11).
- R2 Reduced-motion preference is honoured (CORE F7); in forced-colours (high contrast) mode, controls, borders and focus indicators stay visible.
- R3 The chosen theme applies before first paint, with no flash of the wrong theme on load.
- R4 Colours, spacing and type sizes are defined once and reused; changing the theme changes every screen consistently.

**Conditional**
- C1 IF users can choose a theme manually THEN offer System, Light and Dark, apply it immediately, and remember it per user or device.
- C2 IF logos, charts or images carry meaning THEN provide versions that remain legible on both light and dark backgrounds.
- C3 IF each customer or workspace can set an accent colour THEN reject choices that fail contrast against the interface.

**Suggest**
- S1 A theme picker in settings — lets people override their device setting.
- S2 A larger-text option — helps people who need bigger type without changing browser settings.

**Approval**
- A1 Per-customer branding (own logo and colours) — needs stored assets and contrast checks for each customer.

**Backend contract**
- None required; if the theme should follow the user across devices, it is saved with the profile (FE-ACCT-04, BE-API-01).

**Acceptance**
- [ ] Given a device set to dark mode, when a first-time visitor opens the app, then it renders dark with no light flash.
- [ ] Given a device with reduced motion enabled, when the user navigates, then no large animated transitions play.
- [ ] Given dark mode, when text and icon contrast is measured, then all meet the AA ratios.
- [ ] Given a user selects Light in settings, when they reload, then the app stays light regardless of device setting.

**Exceptions**
- A brand-mandated single theme may skip dark mode; keep contrast and reduced-motion rules.

**Source:** WCAG 2.2 SC 1.4.3, 1.4.11 (standard); CSS Media Queries prefers-color-scheme, prefers-reduced-motion, forced-colors (standard); Apple HIG Dark Mode and Material 3 dark theme (convention)

## FE-SHELL-05 · Language, locale and right-to-left

**Purpose:** Show text, dates, numbers and layout in the form each user expects, and keep the app ready for more languages.
**Triggers:** language, translation, i18n, localisation, locale, RTL, right to left, Arabic, Hebrew, date format, currency, time zone, plural
**Applies when:** the app has users in more than one region or may add a second language.
**Composes:** FE-SHELL-04, FE-ACCT-04

**Required**
- R1 The page language is declared (SC 3.1.1) and passages in another language are marked (SC 3.1.2).
- R2 All visible text lives in one strings place (CORE D4); sentences are never glued together from fragments and plurals use proper plural rules ("1 file", "2 files").
- R3 Dates, times, numbers and currencies follow the user's locale (CORE D1); a currency is always shown with its symbol or code, never assumed.
- R4 Layouts survive text 40% longer than English; buttons and labels wrap or grow instead of truncating meaning.
- R5 Names, addresses and text fields accept any Unicode characters; the app never assumes a first-name and last-name structure.

**Conditional**
- C1 IF a right-to-left language is supported THEN set the text direction on the page, mirror layout and directional icons, but do not mirror logos, numerals, clocks or playback controls.
- C2 IF more than one language is offered THEN a language switcher lives in the shell and settings, names each language in its own language, and the choice is remembered.
- C3 IF users enter text in mixed directions THEN direction is detected per field or item.
- C4 IF the app sends emails or notifications THEN they use the recipient's language preference.

**Suggest**
- S1 Choice of date format and first day of the week — avoids ambiguity such as 03/04.
- S2 A native speaker reviews any machine translation — catches wrong or rude wording before launch.

**Approval**
- A1 Adding a new language — it needs translation and upkeep with every later change.

**Backend contract**
- The API returns machine values (ISO 8601 UTC times, plain numbers, currency codes), never preformatted text; the locale preference is stored on the profile and used for emails (BE-JOB-03).

**Acceptance**
- [ ] Given a user in a different locale, when a date and a price are shown, then both follow that locale's format.
- [ ] Given a count of 1 and a count of 5, when the label renders, then singular and plural forms are both correct.
- [ ] Given a name with an apostrophe and non-Latin characters, when it is saved and shown, then it is unchanged.
- [ ] Given an RTL language is active, when a screen renders, then layout is mirrored and the document direction is rtl.

**Exceptions**
- A single-language internal tool may skip a language switcher; keep the strings in one place and the language declared.

**Source:** WCAG 2.2 SC 3.1.1, 3.1.2 (standard); HTML lang and dir attributes (standard); Unicode CLDR plural rules (standard); W3C Internationalization guidance on personal names (convention)

## FE-SHELL-06 · Not-found and app-level error pages

**Purpose:** Handle missing pages, forbidden pages, crashes and outages without dead ends or blame.
**Triggers:** 404, not found, page missing, 403, forbidden, error page, crash, something went wrong, offline, maintenance, 500
**Applies when:** the app has addresses a user can type, follow from old links, or reach after a failure.
**Composes:** FE-SHELL-02, FE-FEED-01, FE-ACCT-02, BE-API-02

**Required**
- R1 An unknown address shows a not-found page inside the normal shell: it says the page does not exist, links home, offers search or main navigation, and does not blame the user.
- R2 A page the user may not open explains it is not allowed and how to get access (CORE F4); where even the existence of the record is sensitive, it uses the same wording as not found.
- R3 An unexpected failure shows a friendly error page in plain words with Retry and Go home, and a copyable reference id (CORE D7); no technical details leak (CORE F14).
- R4 A failure in one part of a screen is contained to that region with its own retry; navigation and the rest of the page stay usable.
- R5 Error pages set a matching page title and heading, and move focus to the heading (FE-SHELL-02).
- R6 Losing the network says "You're offline" with retry and keeps any entered input (CORE F8).

**Conditional**
- C1 IF planned maintenance is running THEN show a maintenance page with the expected return time when known.
- C2 IF the session expired THEN send the user to sign in with a short message and return afterwards (FE-ACCT-02), not to an error page.
- C3 IF an address moved THEN redirect it (FE-SHELL-02) instead of showing not found.

**Suggest**
- S1 A "Report a problem" button that includes the reference id — helps the owner find the cause quickly.
- S2 Suggest similar pages on the not-found screen — gets lost users back on track.

**Approval**
- A1 Sending crash reports automatically to an outside monitoring service — involves privacy and cost.

**Backend contract**
- The server returns true 404, 403 and 5xx statuses and the BE-API-02 error format with stable code and request id; the front end maps codes to plain messages.

**Acceptance**
- [ ] Given a mistyped address, when it loads, then a not-found page appears in the app shell with a way home.
- [ ] Given a server failure on one dashboard card, when the page renders, then only that card shows an error with Retry.
- [ ] Given an unexpected error, when the error page shows, then it displays a reference id and no stack trace.
- [ ] Given the device goes offline mid-form, when the user submits, then the entered values remain and an offline message appears.

**Exceptions**
- None.

**Source:** HTTP Semantics RFC 9110 status codes (standard); WCAG 2.2 SC 2.4.2 (standard); NN/g error-page guidance (convention)
