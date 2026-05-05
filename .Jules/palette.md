## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-05-05 - [Icon-Only Button Accessibility]
**Learning:** Icon-only buttons (like Edit, Delete, Close, Send) using Lucide React SVGs frequently lack `aria-label` attributes, making them inaccessible to screen readers, and the inner SVGs need `aria-hidden="true"` to avoid redundant announcements.
**Action:** Always verify custom icon-only buttons have descriptive, localized `aria-label` attributes on the `<button>` and `aria-hidden="true"` on the inner SVG.
