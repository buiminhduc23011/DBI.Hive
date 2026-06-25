## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-02-01 - [Notification Dropdown Accessibility]
**Learning:** Icon-only action buttons in interactive list items (like Mark as read or Delete in a notification dropdown) often lack screen-reader-friendly labels and visible keyboard focus indicators, making them inaccessible to keyboard and assistive tech users.
**Action:** Always ensure icon-only action buttons are equipped with semantic `aria-label`s, `title` attributes (ideally localized), `aria-hidden="true"` on their child SVGs, and clear `focus-visible` styles using standard design system tokens.
