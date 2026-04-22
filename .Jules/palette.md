## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-23 - [Keyboard Shortcut Visual Hints]
**Learning:** Providing explicit OS-aware visual hints (like "Cmd K" on Mac vs. "Ctrl K" on Windows) within search inputs significantly improves discoverability for keyboard navigation.
**Action:** When adding global keyboard shortcuts to input fields, dynamically render the shortcut key hint based on `navigator.platform`, and ensure the input padding accommodates the hint to prevent text overlap.
