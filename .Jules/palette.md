## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-19 - Keyboard Shortcut Focus Hint in Search Bar
**Learning:** Adding a subtle, OS-aware keyboard shortcut visual hint (`<kbd>Cmd + K</kbd>` or `Ctrl + K`) to a primary global search bar significantly improves user discovery of power-user features. Pairing this with `aria-hidden="true"` on the search/close icons ensures the visual enhancement doesn't clutter the screen reader experience.
**Action:** Always verify `navigator.platform` defensively (e.g., `typeof navigator !== 'undefined'`) to prevent SSR crashes when implementing OS-specific keyboard UI patterns. Hide visual keyboard hints when the input is actively focused or contains text to prevent overlapping with user input or clear buttons.
