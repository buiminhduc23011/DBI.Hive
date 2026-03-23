## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Interactive Parent Component with Visual Badges Accessibility]
**Learning:** When using visual badges (like notification counts) inside interactive parent elements (like a button), screen readers often read out just the generic element type or just the raw number which lacks context.
**Action:** Ensure dynamically updated `aria-label`s are applied to the parent component describing its full state ("Notifications, X unread"), and set `aria-hidden="true"` on the inner icons and notification badge elements to prevent redundant or confusing screen reader announcements.
