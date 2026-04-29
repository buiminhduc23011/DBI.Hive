## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2025-03-09 - [Search Component Accessibility & Keyboard Shortcuts]
**Learning:** Hardcoding 'Cmd/Ctrl' keyboard shortcuts can confuse users on different operating systems, and relying on `e.key === 'k'` can fail due to Caps Lock.
**Action:** Always verify `navigator.platform` to display the correct modifier key and ensure `e.key.toLowerCase()` is used in shortcut event listeners. Also, properly clean up scratchpad test files after using Playwright.
