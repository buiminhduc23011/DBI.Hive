## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Icon-Only Button Accessibility Pattern]
**Learning:** Adding `aria-label` to an icon-only button isn't enough; screen readers may still redundantly read the SVG contents unless `aria-hidden="true"` is explicitly added to the inner SVG element.
**Action:** Always combine `aria-label` on the parent `<button>` with `aria-hidden="true"` on the inner decorative SVG to ensure clean and concise screen reader announcements.
