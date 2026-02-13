## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Keyboard Navigation in Search]
**Learning:** Dropdowns with search results require explicit keyboard navigation (ArrowUp/Down, Enter, Escape) to be usable by keyboard-only users.
**Action:** Implement `onKeyDown` handlers for common navigation keys and manage focus state using ARIA attributes like `aria-activedescendant`.
