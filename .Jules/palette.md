## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-12 - Accessibility improvements for icon-only buttons in modals
**Learning:** Icon-only interactive elements in modals (e.g., "Edit", "Delete", "Close", "Send") often lack implicit context when screen readers announce them, and visual loading states are necessary for actions that may block or delay the UI.
**Action:** When adding or updating icon-only interactive components, explicitly set `aria-label`s on the `<button>`, `aria-hidden="true"` on the inner SVG icon (to prevent redundant announcements), explicitly add keyboard `focus-visible` states, and always use `animate-spin` visual states when waiting on form submission states like `isSubmitting`.

## 2024-05-12 - i18n hook usage consistency
**Learning:** Hardcoded bilingual ternary operators (`language === 'vi' ? 'A' : 'B'`) are an antipattern in components using an internationalization framework.
**Action:** Always add the translation keys to `client/src/stores/i18nStore.ts` and use the `t()` function, particularly when adding new localized string attributes like `aria-label`.
