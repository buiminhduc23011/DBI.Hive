## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2024-05-30 - [Icon-Only Buttons & Submission States]
**Learning:** Decorative SVGs within icon-only buttons need `aria-hidden="true"` to prevent redundant screen reader announcements. Additionally, using translation strings (e.g. `t()`) properly localized button `aria-label`s without causing runtime crashes. Visual feedback for submission states (e.g., using `Loader2` from `lucide-react`) enhances usability.
**Action:** Always add `aria-hidden="true"` to decorative SVGs in interactive elements. Consistently use translation functions for `aria-label`s in localized components. Add spinner feedback for async submit buttons.
