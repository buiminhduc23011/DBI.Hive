## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2024-03-20 - Accessible Badged Icon Buttons
**Learning:** Adding a badge to an icon-only button creates accessibility challenges. Screen readers may read the badge text separately from the button's purpose, or read the icon name and the badge text out of context (e.g., "Bell, 3").
**Action:** Use a dynamic `aria-label` on the parent `<button>` that conveys the full state (e.g., `aria-label="Notifications, 3 unread"`). Crucially, you must add `aria-hidden="true"` to *both* the decorative SVG icon and the badge `<span>` to prevent screen readers from reading redundant and confusing content.
