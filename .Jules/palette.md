## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-03-24 - [Keyboard Shortcut Hints]
**Learning:** Adding global keyboard shortcuts (like Ctrl+K / Cmd+K) to focus search inputs is a common power-user feature, but discoverability is often poor. Providing a visual OS-aware `<kbd>` hint inside the input makes it obvious.
**Action:** Always verify `navigator.platform` for OS-aware modifier keys and use `pointer-events-none` on overlapping hint containers to avoid blocking clicks on the input underneath.
