## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Keyboard Accessibility and Pointer Events]
**Learning:** When layering decorative icons over interactive inputs, the icons can block clicks. Also, focus states on small interior buttons (like 'X' clear buttons) are easy to miss.
**Action:** Use `pointer-events-none` on decorative overlapping icons and explicitly add `focus-visible` ring classes to interior buttons.
