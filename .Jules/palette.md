## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-15 - Added ARIA Labels to Modal and Guide Buttons
**Learning:** Icon-only close buttons (`X` from Lucide) and icon-only send buttons (`Send` from Lucide) were missing `aria-label`s, making them opaque to screen readers. Hiding the icon itself with `aria-hidden="true"` is just as critical to prevent redundant voiceover behavior.
**Action:** Always add `aria-label` with localized strings (e.g., `t('common.close')`) to `onClick` buttons housing only an icon, and apply `aria-hidden="true"` to the icon SVG element itself.
