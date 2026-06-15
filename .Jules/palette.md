## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-06-15 - Added proper focus states and semantic HTML to Notification Dropdown
**Learning:** The `NotificationDropdown` contained several unsemantic click handlers (like `<div onClick>`) and icon-only buttons lacking `aria-label`s and focus indicators, which made the component difficult to use via keyboard and screen readers.
**Action:** Always use semantic `<button type="button">` for click handlers, apply `focus-visible:ring-2` for clear keyboard navigation, and ensure icon-only buttons have descriptive `aria-label`s while hiding the internal SVG with `aria-hidden="true"`.
