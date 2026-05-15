## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-05-15 - [Keyboard Shortcut Hints]
**Learning:** Keyboard shortcut hints significantly improve discoverability for power users. When adding shortcut hints like Cmd/Ctrl + K, it's crucial to correctly detect the user's OS via `navigator.platform` and display the semantic <kbd> element to match native feel.
**Action:** Always include keyboard hints on search or primary global actions, ensuring the hint toggles based on the current OS modifier key.
