## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-05 - [Keyboard Shortcuts & Decorative Inputs]
**Learning:** Decorative icons inside input fields (like search icons) can accidentally block mouse events if not properly styled. Additionally, when implementing global keyboard shortcuts (like `Cmd+K`/`Ctrl+K`), visual hints should be dynamically rendered based on the OS and explicitly wrapped in semantic `<kbd>` tags without interfering with the input interaction.
**Action:** Always apply `pointer-events-none` to decorative input icons and visual keyboard shortcut hints positioned over inputs, and dynamically determine OS modifiers when displaying shortcut keys to users. Use `<kbd>` tags for accessibility.
