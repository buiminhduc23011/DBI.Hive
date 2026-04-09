## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-04-09 - [TaskDetailModal Icon Accessibility]
**Learning:** Icon-only buttons (like Edit, Delete, Close, Send) frequently lack accessible names. Additionally, decorative SVG icons inside them (like those from `lucide-react`) need `aria-hidden="true"` to prevent screen readers from reading meaningless structural markup.
**Action:** Always add descriptive `aria-label` attributes to icon-only buttons, map them to localization keys (e.g., `t('common.edit')`), and explicitly set `aria-hidden="true"` on inner SVGs.
