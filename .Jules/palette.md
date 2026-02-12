## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Keyboard Navigation in Custom Dropdowns]
**Learning:** Adding ARIA roles to a custom dropdown isn't enough; users expect standard keyboard interactions (Arrow keys to navigate, Enter to select, Escape to close).
**Action:** Implement `activeIndex` state and `onKeyDown` handlers for all custom interactive lists to support keyboard navigation.
