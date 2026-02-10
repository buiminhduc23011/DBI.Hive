## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Navigation in Comboboxes]
**Learning:** Adding keyboard navigation (ArrowDown/Up, Enter) to custom search components significantly improves usability for power users and accessibility, but requires careful state management (activeIndex) and ARIA attributes (activedescendant).
**Action:** Implement a standard `useKeyboardNavigation` hook or pattern for all future dropdown/combobox components to ensure consistency.
