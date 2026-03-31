## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Modal & Button Accessibility]
**Learning:** Modals often miss `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. Icon-only buttons (Close, Edit, Delete) frequently lack `aria-label`, making them invisible to screen readers.
**Action:** When working on modals, always ensure the container has proper roles and labels, and check every icon-only button for an accessible label.

## 2026-02-01 - [Dashboard Interaction]
**Learning:** The "Smart Task Display" cards on the Dashboard (Today, Overdue, etc.) are not clickable, unlike tasks in other views (Kanban, Gantt). This creates inconsistent user expectations.
**Action:** Investigate adding `onClick` handlers to these cards to open the TaskDetailModal, matching other views.
