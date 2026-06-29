## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2025-10-31 - [Keyboard Shortcut Hints & Decorative Elements Accessibility]
**Learning:** Rendering keyboard shortcut visual hints (like `Cmd K`) inside an input field requires preventing interaction blocks, and OS differences mean standardizing isn't enough.
**Action:** Use semantic `<kbd>` tags within an absolutely positioned container and apply `pointer-events-none` to ensure native look without blocking input clicks. Detect OS dynamically to show appropriate hints (e.g., `Cmd` vs. `Ctrl`).
