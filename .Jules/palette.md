## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Notification Dropdown Accessibility]
**Learning:** Notification dropdowns containing interactive elements (like "Mark as read") should be structured as semantic lists (`ul`/`li`) for better screen reader navigation. "Alert" style notifications (like unassigned tasks) must be implemented as `<button>` elements, not `<div>`s with `onClick`, to ensure keyboard focusability and actionability.
**Action:** Convert interactive list items to buttons and use semantic list structures for collections of interactive items.
