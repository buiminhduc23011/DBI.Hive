## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Notification Dropdown Accessibility]
**Learning:** Interactive dropdown items designed as `div`s with `onClick` lack keyboard accessibility and semantic meaning. Similarly, icon-only action buttons (e.g., mark as read, delete) within lists often lack visual keyboard focus rings and descriptive labels.
**Action:** Convert clickable `div`s to `<button type="button">`, apply `w-full text-left` to maintain layout, add `aria-hidden="true"` to decorative icons, ensure localized `aria-label`/`title` attributes on icon buttons, and enforce visible focus states (`focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-dbi-primary`).
