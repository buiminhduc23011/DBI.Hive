## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-06-21 - Task Detail Modal Accessibility Improvements
**Learning:** When using icon-only buttons (e.g., using Lucide React icons), combining a descriptive `aria-label` on the `<button>` tag and `aria-hidden="true"` on the internal `<svg>` element is critical for screen reader compatibility. Without `aria-hidden`, screen readers may redundantly announce the SVG element or fail to prioritize the localized label, leading to a confusing audio experience.
**Action:** Always verify that icon-only buttons have an explicitly defined `aria-label` (preferably translated) and that the internal decorative element (icon or loading spinner) is hidden from assistive technologies using `aria-hidden="true"`.
