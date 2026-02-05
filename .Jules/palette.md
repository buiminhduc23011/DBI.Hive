## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Localized ARIA Labels]
**Learning:** Hardcoded English `title` attributes on icon buttons are inaccessible to non-English users and sometimes ignored by screen readers in favor of content.
**Action:** Use localized strings for `aria-label` on all icon-only buttons to ensure both accessibility and internationalization support.
