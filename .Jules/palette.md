## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-20 - Global Search Keyboard Shortcut Hinting
**Learning:** When implementing global keyboard shortcuts (like `Cmd+K`/`Ctrl+K` for search), users benefit immensely from inline visual `<kbd>` hints directly within the input's resting state. However, ensuring cross-platform clarity requires dynamically detecting the OS (`navigator.platform`) to display '⌘' for Mac and 'Ctrl' for Windows/Linux, preventing user confusion.
**Action:** Always check `navigator.platform` when displaying modifier keys in UI elements. Combine this with hiding the hint when the input is focused or has value to keep the interface clean during active use.
