## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Dynamic ARIA Labels for Icon Buttons with Badges]
**Learning:** Screen readers often announce icon-only buttons with inner notification badges confusingly (e.g., reading just the number or inner span contents). Adding `aria-hidden="true"` to the decorative icon and providing a dynamic `aria-label` on the parent button (e.g., "Notifications, 3 unread") ensures full state is accurately communicated.
**Action:** Always verify icon-only interactive elements, especially those with badges, use dynamic `aria-label`s and hide decorative inner SVGs using `aria-hidden="true"`.
