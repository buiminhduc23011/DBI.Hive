## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-06-14 - [Keyboard Accessibility Hints]
**Learning:** Adding global keyboard shortcuts improves UX, but OS-agnostic keys fail to reflect the native experience (e.g. Mac users expect `Cmd+K` while Windows expect `Ctrl+K`).
**Action:** Always wrap `navigator.platform` checks safely in a `useEffect` to avoid SSR/hydration errors, and show an OS-specific hint in `<kbd>` tags formatted with `pointer-events-none` so they don't block clicks on underlying inputs.
