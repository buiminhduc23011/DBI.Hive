## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## $(date +%Y-%m-%d) - [Missing aria-labels on Lucide Icons]
**Learning:** Icon-only buttons using `lucide-react` frequently lack `aria-label`s across the application's components. Since these buttons carry no visual text, screen readers announce them poorly or skip them.
**Action:** When working with or adding new icon-only buttons, always destruct `t` from `useI18nStore` and provide a translated `aria-label` to ensure cross-language accessibility. Also add `aria-hidden="true"` to the SVG icons themselves to prevent redundant screen reader announcements.
