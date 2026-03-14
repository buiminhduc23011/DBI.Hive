## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-03-14 - [Notification Dropdown Accessibility]
**Learning:** When adding `aria-label` to icon-only buttons with dynamic content (e.g., an unread count badge), use a dynamically updated `aria-label` on the parent to describe the full state (e.g., 'Notifications, 3 unread') rather than relying on inner spans for screen readers. Ensure inner decorative elements (e.g., Lucide React SVGs) and spans have `aria-hidden="true"` to prevent redundant screen reader announcements.
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels, and hide their internal content from screen readers.
