## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-05-31 - [Keyboard Shortcuts Accessibility]
**Learning:** Hardcoding "Ctrl" or "Cmd" for shortcut hints causes confusion across different operating systems. Additionally, `event.key` on macOS can return uppercase letters (e.g. 'K') when combined with modifiers, causing strict lowercase comparisons to fail.
**Action:** Use `navigator.platform` to dynamically detect OS and render appropriate visual hints (e.g., Mac vs. PC). Use `.toLowerCase()` when evaluating `event.key` in keyboard event listeners, and wrap the hint text in semantic `<kbd>` tags to improve accessibility and visual presentation.
