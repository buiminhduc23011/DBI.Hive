## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Project Options Dropdown Accessibility]
**Learning:** Icon-only trigger buttons for dropdown menus (like the 'MoreVertical' options icon) are often missing essential ARIA attributes, leaving screen reader users without context about the button's purpose and state.
**Action:** Always ensure icon-only buttons have an `aria-label`, state indicators like `aria-expanded`, relationship attributes like `aria-haspopup="true"`, and `aria-hidden="true"` on the icon itself.
