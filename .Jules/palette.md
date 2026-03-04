## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-03-04 - [Dynamic ARIA Labels on Status Badges]
**Learning:** When interactive elements like notification bells contain dynamic status indicators (like unread counts), applying the `aria-label` to the parent button and setting `aria-hidden="true"` on the children creates a much cleaner screen reader experience than relying on the inner text. Screen readers otherwise read "Bell image, 3" instead of "Notifications, 3 unread".
**Action:** Apply dynamic `aria-label`s describing the full state to parent interactive elements and hide decorative children.
