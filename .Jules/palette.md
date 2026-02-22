## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-22 - [Notification Center Accessibility]
**Learning:** Notification panels with complex interactive content (lists, actions) should use role="dialog" or "menu" and ensure all icon-only action buttons (mark read, delete) have explicit aria-labels.
**Action:** Audit all dropdown/popover components for missing ARIA roles and icon button labels.
