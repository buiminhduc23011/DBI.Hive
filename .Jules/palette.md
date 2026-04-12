## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Hints]
**Learning:** Adding subtle `<kbd>` visual hints for global shortcuts (like search) dramatically improves feature discoverability, but requires checking `navigator.platform` safely to render the correct OS-specific modifier (Cmd vs Ctrl) without causing SSR errors.
**Action:** Always wrap `navigator.platform` checks in a `typeof navigator !== 'undefined'` guard, and dynamically set the modifier key symbol in state for cross-platform accuracy.
