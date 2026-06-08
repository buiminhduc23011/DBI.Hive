## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-06-08 - [Icon-Only Buttons A11y & Loading State]
**Learning:** Icon-only buttons (like Edit, Delete, Close, Send Comment) in modals are frequently inaccessible to screen readers without `aria-label`, and the inner SVG icons need `aria-hidden="true"`. Also, async actions (like adding a comment) on icon-only buttons need visual loading states (e.g., `<Loader2 className="animate-spin" />`) instead of just disabling the button, for better UX.
**Action:** When creating or modifying icon-only buttons, always apply an `aria-label` to the `<button>` and `aria-hidden="true"` to the inner SVG. For buttons triggering async operations, implement a loading state to replace the icon with a spinner.
