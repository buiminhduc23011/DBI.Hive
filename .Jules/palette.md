## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Form Label Association]
**Learning:** Inputs in the Login form are not programmatically associated with their labels (missing `htmlFor` and `id`), causing accessibility failures and breaking label-based test selectors.
**Action:** Always check form inputs for proper label association using `htmlFor`/`id` or nesting, and use `aria-label` or `aria-labelledby` as a fallback.
