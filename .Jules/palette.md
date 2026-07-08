## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Shortcut Hints Overlays]
**Learning:** When positioning decorative overlays (like keyboard shortcut hints or icons) inside interactive elements like input fields, they can inadvertently block pointer events intended for the input itself.
**Action:** Always apply the Tailwind class `pointer-events-none` to absolute positioned visual overlays over inputs to ensure they don't block clicks.
