## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-20 - [Notification Dropdown Accessibility]
**Learning:** Interactive divs (like alerts) are not keyboard accessible by default, and icon-only buttons (bell, check, trash) need explicit labels for screen readers.
**Action:** Convert interactive divs to <button> elements and add aria-labels to all icon-only controls using i18n keys.
