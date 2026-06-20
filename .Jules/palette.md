## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-06-20 - [Accessible Loading States for Submit Buttons]
**Learning:** Icon-only submit buttons often lack accessible names, and during async operations, users need clear visual feedback (like a spinning loader) without cluttering the screen reader experience with redundant icon announcements.
**Action:** Always add bilingual `aria-label`s to icon-only buttons, replace the default icon with an animated loader (`Loader2 className="animate-spin"`) during submission, and apply `aria-hidden="true"` to both icons to maintain clean accessibility tree.
