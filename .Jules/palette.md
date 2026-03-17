## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Dynamic Badge Accessibility]
**Learning:** When adding an `aria-label` to an interactive parent element (like a button) containing a dynamic count badge (e.g., unread notifications), the `aria-label` should comprehensively describe the full state (e.g., "Notifications, 2 unread") to provide screen readers with proper context, rather than relying on inner spans. Additionally, decorative inner SVGs should explicitly use `aria-hidden="true"`.
**Action:** Use a dynamically updated `aria-label` on the parent button for multi-state indicators and mark decorative SVG icons as `aria-hidden`.
