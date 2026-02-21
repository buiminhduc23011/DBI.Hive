## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Internationalization Consistency]
**Learning:** Mixing hardcoded conditional text logic with translation functions (`t()`) creates maintenance issues and potential bugs.
**Action:** Always add new text strings to the centralized `i18nStore` and use `t()` consistently, even for "micro" UI changes.
