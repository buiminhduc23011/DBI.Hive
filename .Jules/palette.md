## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-05-04 - [Localization of ARIA Labels]
**Learning:** When adding ARIA labels to components that use a global translation store (like `i18nStore.ts`), ensure that new labels are added as translation keys rather than relying on inline `language === 'vi' ? 'A' : 'B'` checks if the component's existing structure utilizes a `t()` function for translations.
**Action:** Always check how a component manages localization (e.g., destructured `const { t } = useI18nStore()`) before adding new text for screen readers, and append necessary keys to the translation store.
