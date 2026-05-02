## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-02-01 - [TaskDetailModal Icon-only Buttons Accessibility]
**Learning:** Icon-only buttons for actions like Edit, Delete, Close, and Send Comment lack descriptive context for screen readers when they don't have `aria-label` or only have `title` tooltips.
**Action:** Always ensure `aria-label` is present on icon-only buttons, and use `aria-hidden="true"` on the inner SVGs to prevent screen readers from reading meaningless SVG paths or elements. If translated strings exist, reuse them for ARIA labels.
