## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-02-01 - [Internationalization in React]
**Learning:** Using variables like `language` in ternary expressions for accessibility labels inside components (e.g. `language === 'vi' ? 'A' : 'B'`) can break the application if the variable is not properly scoped or if it violates best practices for i18n rendering.
**Action:** Always use the dedicated translation function (e.g., `t('key')`) to dynamically set accessible labels, rather than hardcoding ternary logic for languages in the UI layer.
