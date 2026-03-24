## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Notification Dropdown Accessibility]
**Learning:** Decorative icons inside icon-only buttons (like `Bell`, `Trash2`, `Check`) need `aria-hidden="true"` to prevent redundant screen reader announcements. Additionally, converting clickable `<div onClick>` alerts to semantic `<button>` elements improves keyboard navigability without changing visual layout when paired with classes like `w-full text-left`.
**Action:** When adding `aria-label` to a button, always verify inner SVG icons have `aria-hidden="true"`. Convert actionable `div`s to `button`s to inherently support keyboard focus and activation.