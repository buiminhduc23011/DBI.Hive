## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Hints]
**Learning:** Adding global keyboard shortcuts (like Cmd+K) provides a significant power-user UX improvement. Rendering a visual `<kbd>` hint inside the input dynamically based on the OS makes it discoverable. Ensure sufficient CSS padding is added to accommodate the hint without text overlapping it, and hide the hint visually when text is entered.
**Action:** Consistently apply OS-aware `<kbd>` hints when introducing global keyboard shortcuts to input fields.
