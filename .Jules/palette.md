## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-04-19 - [OS-Specific Keyboard Shortcuts]
**Learning:** When building global keyboard shortcuts and visual `<kbd>` hints (e.g., Cmd+K vs Ctrl+K), checking `navigator.platform` is necessary to present the correct shortcut hint based on the user's OS. Safely check `typeof navigator !== 'undefined'` first to avoid SSR or build-time errors.
**Action:** Use `navigator.platform` wrapped in a `typeof` check to conditionally render OS-specific shortcut hints to improve the UX context.
