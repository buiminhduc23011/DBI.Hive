## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-05 - [OS-Aware Keyboard Shortcuts]
**Learning:** Displaying dynamic OS-aware keyboard shortcuts (e.g., Mac vs Windows) is challenging because `navigator.platform` may be undefined during SSR or cause React hydration errors. Wrapping the `typeof navigator !== 'undefined'` check within a `useEffect` prevents these issues. Also, visually styling shortcuts with semantic `<kbd>` tags and hiding them dynamically (`!searchText`) is crucial for clean UI.
**Action:** Always wrap OS detection in a client-side `useEffect` block and render shortcuts inside absolute positioned containers using semantic `<kbd>` tags.
