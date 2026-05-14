## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2023-10-27 - [Keyboard Shortcut Visual Hints]
**Learning:** When implementing global keyboard shortcuts, users may not discover them unless they are explicitly shown in the UI. Furthermore, the modifier key needs to be OS-aware (e.g. Cmd for Mac, Ctrl for Windows/Linux) to avoid confusion.
**Action:** Render a visual `<kbd>` hint dynamically in the input using `navigator.platform` to determine the correct OS-specific modifier, and visually hide the hint when the input contains text to prevent visual overlap.
