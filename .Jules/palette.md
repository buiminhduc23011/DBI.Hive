## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Icon-Only Button Accessibility in Modals]
**Learning:** Adding `aria-label` to icon-only buttons isn't always enough; if the inner SVG (e.g., Lucide React icons) isn't hidden with `aria-hidden="true"`, screen readers might read out redundant or confusing descriptions of the graphical elements.
**Action:** Always pair `aria-label` on icon-only buttons with `aria-hidden="true"` on the child SVG to ensure clean and semantic screen reader translations, especially in dynamic modals where context shifts.
