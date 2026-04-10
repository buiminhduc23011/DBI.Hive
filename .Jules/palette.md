## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-04-10 - Adding ARIA labels to icon-only modal close buttons
**Learning:** Found multiple instances (`ProjectMembers`, `TaskDetailModal`, `UnassignedTasksModal`) where `lucide-react` icons were used as the entire content of a `<button onClick={onClose}>` element without any accessible name (`aria-label`).
**Action:** Added `aria-label={t('common.close')}` using the existing `i18nStore` translation to the `<button>` tags, and explicitly added `aria-hidden="true"` to the inner `lucide-react` icon to prevent redundant or confusing screen reader announcements. This should be a standard pattern for all icon-only buttons.
