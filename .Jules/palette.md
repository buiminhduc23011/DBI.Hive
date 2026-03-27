## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-03-27 - NotificationDropdown Accessibility
**Learning:** When making interactive dropdowns accessible, it is critical to address not just the trigger (with `aria-haspopup` and `aria-expanded`) but also the contents: providing a `role="dialog"` and `aria-label` for the popup, hiding decorative icons with `aria-hidden="true"`, converting faux-buttons (like clickable `div`s) into semantic `<button type="button">`, and ensuring all actionable elements have distinct focus states (e.g., `focus-visible:ring-2`).
**Action:** Always check dropdown structures holistically—trigger, container semantics, inner element semantics, keyboard focus states, and redundant screen reader noise.
