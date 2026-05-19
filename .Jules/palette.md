## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2024-05-18 - Added `aria-label` to icon-only buttons in TaskDetailModal
**Learning:** Icon-only buttons lack accessible names without `aria-label`, leaving screen reader users confused about their purpose. When adding `aria-label`, child elements like SVG icons should be given `aria-hidden="true"` to hide them from the accessibility tree, preventing redundancy. Furthermore, localized labels should be used to support multi-language environments.
**Action:** Always provide translated `aria-label`s for icon-only interactive elements and ensure their child decorative graphics have `aria-hidden="true"`.
