## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcuts UI Overlay]
**Learning:** Adding a native-looking OS-specific keyboard shortcut `<kbd>` block overlaid on an input field requires preventing it from blocking input clicks, preventing it from overlapping typed text (by adding padding to the input), and wrapping platform checks in effect helper functions to prevent cascading sync update errors.
**Action:** Use absolute positioning inside a relative container, add `pointer-events-none` to decorative elements, dynamically check `navigator.platform` inside `useEffect`, and increase `padding-right` of the input field accordingly.
