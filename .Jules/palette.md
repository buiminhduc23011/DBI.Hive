## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Modal Actions Accessibility]
**Learning:** Modal dialogs often contain critical icon-only actions (Close, Edit, Delete) in the header that are frequently missed by screen readers if they lack `aria-label`, even if `title` is present (which is mainly for mouse users).
**Action:** Audit all modal headers and footer action bars to ensure every icon-only button has both `title` (for mouse) and `aria-label` (for assistive tech), using conditional translation strings if necessary.
