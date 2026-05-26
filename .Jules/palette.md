## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Hints in Inputs]
**Learning:** Adding dynamic keyboard shortcut hints (like Ctrl K / ⌘K) inside search inputs greatly enhances discoverability. Using an absolutely positioned `<kbd>` element that hides when the input contains text provides a clean, native feel without overlapping with the actual input text or clear buttons.
**Action:** Always consider adding keyboard shortcuts for primary search interactions and display clear visual hints using `<kbd>` elements, ensuring they are visually hidden when not needed to avoid clutter.
