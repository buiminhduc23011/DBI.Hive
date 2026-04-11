## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-18 - Added Global Keyboard Shortcut for Search
**Learning:** Adding a keyboard shortcut (like Cmd+K) to focus a global search input significantly improves the power-user experience. However, when displaying visual hints (`<kbd>Cmd K</kbd>`) inside the input component, it is crucial to dynamically detect the OS using `navigator.platform` to switch between 'Cmd' (Mac) and 'Ctrl' (Windows/Linux) and to wrap this detection in `typeof navigator !== 'undefined'` to avoid hydration or build errors in potential SSR setups.
**Action:** When implementing OS-specific keyboard shortcuts and UI hints in React, always use `typeof navigator !== 'undefined'` to safely determine the platform, and ensure the shortcut's event listener (`keydown`) is properly cleaned up in the `useEffect` return function to prevent memory leaks. Also, visually hide the `<kbd>` hint when the input contains text to prevent overlapping.
