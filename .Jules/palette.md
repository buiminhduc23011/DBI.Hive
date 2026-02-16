## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Button Accessibility & Keyboard Focus]
**Learning:** Interactive `div`s with `onClick` handlers create accessibility barriers for keyboard users. Converting them to `<button>` elements immediately fixes this but requires explicit `focus-visible` styles to ensure the focus state is visually apparent, especially when using Tailwind's `outline-none` reset.
**Action:** When converting `div` to `button`, always add `type="button"`, `text-left` (if needed for layout), and explicit `focus-visible:ring` classes to maintain accessibility and visual consistency.
