## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-22 - Keyboard Shortcut OS Detection
**Learning:** When checking navigator.platform in React components for OS-specific keyboard shortcuts, checking typeof navigator !== 'undefined' first prevents SSR/build errors. Wrapping setState in a local helper function inside useEffect prevents cascading render warnings.
**Action:** Use a local helper function in useEffect for setting OS-specific modifier state and ensure navigator is defined before accessing its platform.
