## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Form Submissions]
**Learning:** When adding loading states to submit buttons, the visual spinner needs `aria-hidden="true"` to avoid confusing screen readers, while the button itself must have an `aria-label` describing its action.
**Action:** Add `aria-hidden="true"` to visual spinners and ensure icon-only submit buttons have descriptive `aria-label` attributes.
