## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-05-18 - [Keyboard Shortcut Accessibility]
**Learning:** Adding global keyboard shortcuts (like Cmd+K) provides significant accessibility and power-user benefits, but requires careful implementation to prevent SSR crashes (checking `navigator`), handle OS-specific modifiers (Cmd vs Ctrl), and ensure visual hints do not block interactions (`pointer-events-none`) or overlap input text (adjusting padding).
**Action:** Always test shortcut bindings with `preventDefault()`, use correct OS visual cues with semantic `<kbd>` tags, and implement them safely without causing render cascade warnings.
