## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-03-20 - Notification Dropdown Accessibility
**Learning:** When dealing with buttons that have dynamic count badges (like the notification bell), it's important to set the `aria-label` dynamically to include the count and set `aria-hidden="true"` on both the inner icon and the inner badge `span`. If we don't do this, screen readers might read the icon description *plus* just the number, losing the context that it's a count of unread notifications.
**Action:** Always test icon buttons with badges using a screen reader mindset. Add dynamic `aria-label`s on the parent and hide the presentational children to provide clear, contextual announcements.
