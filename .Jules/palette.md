## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Icon-Only Submit Buttons]
**Learning:** Icon-only submit buttons (like 'Send Comment') need visual loading states to provide user feedback during async actions, as users might click repeatedly or think the app is unresponsive. They also often lack semantic labels for screen readers.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes with `aria-hidden="true"` on inner decorative SVGs. For submit buttons, swap the default icon with a loading spinner (e.g., `<Loader2 className="animate-spin" />`) during submission states.
