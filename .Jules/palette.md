## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Interactive Div Anti-Pattern]
**Learning:** Found interactive alerts/notifications implemented as `div` with `onClick`, making them inaccessible to keyboard users (no focus/tab index).
**Action:** Convert these to semantic `<button type="button">` elements to gain native keyboard support and focus states.
