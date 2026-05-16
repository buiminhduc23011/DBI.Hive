## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Discoverability]
**Learning:** Adding global keyboard shortcuts improves power-user experience, but hidden shortcuts are often missed.
**Action:** When adding global shortcuts (like `Cmd+K` for search), dynamically detect `navigator.platform` to display the correct OS modifier and render an unobtrusive `<kbd>` visual hint in the UI. Ensure the hint is hidden on small screens and disappears when input is focused/typed into to avoid visual clutter.
