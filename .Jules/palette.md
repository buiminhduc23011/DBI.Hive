## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-06-19 - [Global Keyboard Shortcuts in Search]
**Learning:** When implementing keyboard shortcut visual hints (`<kbd>`) for components like Search, it is important to conditionally render OS-specific hints (`Cmd K` vs `Ctrl K`) to avoid user confusion, and ensure the hint is hidden as soon as the user starts typing to keep the UI clean. Applying `pointer-events-none` prevents the hint from interfering with mouse clicks inside the input.
**Action:** When adding global search or action shortcuts, always check `navigator.platform` for OS context and hide the hints dynamically when text is present.
