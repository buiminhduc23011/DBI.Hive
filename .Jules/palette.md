## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Global Keyboard Shortcuts and Input Overlays]
**Learning:** When adding keyboard shortcuts like `Cmd K`/`Ctrl K` and displaying visual hints (<kbd>) or decorative icons inside search inputs, the overlapping absolutely-positioned elements can block mouse clicks on the underlying input field.
**Action:** Always apply `pointer-events-none` to decorative input overlay elements (like search icons and shortcut hints) so they don't interfere with user interaction. Use `typeof navigator !== 'undefined'` to safely read `navigator.platform` for OS-aware hints.
