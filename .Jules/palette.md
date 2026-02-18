## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Interactive Elements Semantics]
**Learning:** `div`s with `onClick` handlers are not keyboard accessible by default. This pattern was found in notification dropdowns.
**Action:** Always use `<button>` for interactive elements or add `role="button"` with `tabIndex={0}` and `onKeyDown` handlers if semantic HTML cannot be used.
