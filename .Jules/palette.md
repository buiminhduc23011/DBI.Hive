## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-18 - Added Keyboard Shortcut Hint to Task Search
**Learning:** Adding dynamic keyboard shortcut hints (like `Cmd K` or `Ctrl K`) directly inside the input field significantly improves discoverability without requiring an explicit tooltip. However, it requires correctly detecting the OS (`navigator.platform`) in a SSR-safe manner and ensuring the `keydown` event listener is attached globally (or to the correct container) and removed on unmount to prevent memory leaks. Also, when modifying an input to include absolute positioned inner elements (like the hint), we must adjust the input's padding (e.g. `pr-16`) so text doesn't overlap.
**Action:** When adding shortcuts to inputs, position them absolutely inside a relative wrapper and adjust the input's padding. Always wrap `navigator.platform` checks in `typeof navigator !== 'undefined'` and implement both Mac (`Meta`) and Windows/Linux (`Ctrl`) keys for `keydown` listeners.
