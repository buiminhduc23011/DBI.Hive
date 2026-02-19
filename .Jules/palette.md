## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-19 - [Interactive Elements Accessibility]
**Learning:** `div` elements with `onClick` handlers are not keyboard accessible by default and lack semantic meaning.
**Action:** Convert interactive `div`s to `<button>` elements to ensure keyboard focus, activation (Enter/Space), and proper screen reader announcement.
