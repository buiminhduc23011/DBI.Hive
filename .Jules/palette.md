## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-04-17 - Added missing aria-expanded and aria-haspopup to dropdown triggers
**Learning:** Dropdown triggers across the application (like user menus and project action menus) were missing critical ARIA attributes (, ), rendering them opaque to screen readers about their current state and type.
**Action:** Always verify that interactive dropdown triggers define  and , and that inner decorative icons use .

## 2024-04-17 - Added missing aria-expanded and aria-haspopup to dropdown triggers
**Learning:** Dropdown triggers across the application (like user menus and project action menus) were missing critical ARIA attributes (`aria-expanded`, `aria-haspopup`), rendering them opaque to screen readers about their current state and type.
**Action:** Always verify that interactive dropdown triggers define `aria-expanded={isOpen}` and `aria-haspopup="true"`, and that inner decorative icons use `aria-hidden="true"`.
