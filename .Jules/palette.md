## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-05-07 - [Interactive Icon and Menu Accessibility]
**Learning:** Decorative icons in interactive elements (like `lucide-react` icons in buttons) can cause screen readers to announce redundant or confusing information if not properly hidden. Additionally, complex UI patterns like command palettes or dropdowns often miss focus states, making keyboard navigation difficult.
**Action:** Always add `aria-hidden="true"` to decorative inner icons within buttons that already have `aria-label`s. Ensure all interactive custom elements (like divs acting as lists or buttons) are converted to native `<button>` elements, and use `focus-visible` outline utilities to provide clear keyboard focus indicators without compromising mouse interactions.
