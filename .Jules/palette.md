## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-07-05 - [Search Component Keyboard Accessibility]
**Learning:** Adding global keyboard shortcuts (like Ctrl+K/Cmd+K) to focus search inputs significantly improves keyboard navigation, but the visual hint must be OS-aware and hidden appropriately (e.g. when typing) to avoid UI clutter. Also, absolutely positioned elements like visual hints need `pointer-events-none` to prevent them from intercepting clicks meant for the underlying input field.
**Action:** Always verify  safely (checking ) when generating OS-specific UI hints, and use `pointer-events-none` on overlay elements within inputs.
## 2024-07-05 - [Search Component Keyboard Accessibility]
**Learning:** Adding global keyboard shortcuts (like Ctrl+K/Cmd+K) to focus search inputs significantly improves keyboard navigation, but the visual hint must be OS-aware and hidden appropriately (e.g. when typing) to avoid UI clutter. Also, absolutely positioned elements like visual hints need `pointer-events-none` to prevent them from intercepting clicks meant for the underlying input field.
**Action:** Always verify `navigator.platform` safely (checking `typeof navigator !== 'undefined'`) when generating OS-specific UI hints, and use `pointer-events-none` on overlay elements within inputs.
