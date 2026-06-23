## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-06-23 - [TaskDetailModal Accessibility Improvements]
**Learning:** Icon-only buttons without `aria-label` are widespread in modals like `TaskDetailModal.tsx`. Using translation strings for `aria-label` (e.g. `aria-label={t('common.edit')}`) is highly effective for localized accessibility.
**Action:** Consistently review new or existing icon-only buttons (like delete, edit, or close actions) to ensure they have an `aria-label` and their inner `lucide-react` SVGs have `aria-hidden="true"`.
