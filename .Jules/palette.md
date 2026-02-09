## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-09 - [Semantic Interactive Elements]
**Learning:** "Unassigned Tasks" alerts implemented as clickable `div`s break keyboard accessibility (tab focus/Enter key).
**Action:** Convert interactive "card" elements to `<button>` with `text-left w-full` classes to maintain layout while gaining native accessibility.
