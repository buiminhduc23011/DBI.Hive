## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Hints]
**Learning:** Displaying dynamic OS-aware visual hints (e.g., 'Cmd K' vs. 'Ctrl K') for global keyboard shortcuts improves discoverability. Ensuring the hint only shows when the input is empty prevents visual overlap with user text.
**Action:** When implementing keyboard shortcuts like Cmd+K / Ctrl+K, dynamically check `navigator.platform` on mount and display the appropriate keys (hidden visually when search text is present).
