## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-04-02 - [Keyboard Shortcuts UI Hint & Platform Detection]
**Learning:** Hardcoded keyboard shortcut hints (like "Cmd K") in UI text or `<kbd>` tags create confusion for users on other OSes. Playwright tests asserting these might also fail or timeout if environment checks misalign.
**Action:** Always dynamically detect the OS via `typeof navigator !== 'undefined' && navigator.platform` to toggle the correct modifier string ("Cmd" for Mac, "Ctrl" for Windows/Linux) before rendering keyboard hints in the UI. Keep event listeners generic by checking `event.metaKey || event.ctrlKey`.
