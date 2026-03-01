## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2025-03-01 - Interactive Elements Without Semantic Roles
**Learning:** This app frequently uses clickable `<div>` elements with `onClick` handlers for complex interactive areas (like the "Unassigned tasks" alert in the notification dropdown), which breaks keyboard navigation and screen reader support. Additionally, buttons with dynamic badges (unread counts) rely on inner `<span>` labels rather than dynamic parent `aria-label`s.
**Action:** When working on interactive components or alerts, immediately convert `onClick` `<div>` elements to `<button className="w-full text-left">` to preserve layout while gaining native keyboard accessibility. For buttons with dynamic badges, set the `aria-label` on the parent `<button>` to describe the full state (e.g., `aria-label={\`Notifications, ${unreadCount} unread\`}`).
