## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Keyboard Accessibility & Visual Polish]
**Learning:** Decorative icons and dynamic keyboard shortcut hints placed inside input containers can incorrectly block user click events on the input itself if not properly styled.
**Action:** When creating search inputs or similar elements with overlays, always apply `pointer-events-none` to the decorative elements. Additionally, for OS-specific keyboard shortcuts, determine the key using `navigator.platform` within a `useEffect` on mount to avoid SSR issues and provide accurate visual cues to the user.
