## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-03-25 - [Dynamic Icon-Only Badges and Dropdowns]
**Learning:** Screen readers struggle with dynamic badge counts when they are visually implemented inside spans within buttons, leading to redundant or confusing announcements.
**Action:** Always add a dynamic `aria-label` to the main trigger button that fully describes the current state (e.g., 'Notifications, 3 unread'). Use `aria-hidden="true"` on inner decorative icons (`lucide-react` components) and the visual badge span itself to prevent redundant announcements. Also, ensure interactive dropdown elements include `aria-expanded={isOpen}` to correctly reflect their state.
