## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2025-02-12 - [Modal Accessibility - Icon-Only Buttons]
**Learning:** Icon-only buttons (like Close, Edit, Delete, Send) in custom modal components (`TaskDetailModal.tsx`, `UnassignedTasksModal.tsx`) often lack descriptive `aria-label`s and `aria-hidden` attributes on their inner SVGs. This results in missing or confusing announcements for screen reader users.
**Action:** Consistently add localized `aria-label` attributes to icon-only buttons (e.g., `aria-label={t('common.close')}`) and apply `aria-hidden="true"` to inner declarative elements (like Lucide React `<X />`, `<Trash2 />` icons).
