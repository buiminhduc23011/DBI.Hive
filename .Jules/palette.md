## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-03-11 - [NotificationDropdown Accessibility]
**Learning:** When converting interactive `div` elements to `button`s for better accessibility, always ensure to add `type="button"` to prevent them from acting as submit buttons inside forms. Also, when an element has a visually hidden notification badge (or a visual badge that doesn't make sense as text for screen readers), add an `aria-label` on the parent interactive element and `aria-hidden="true"` on the decorative or visual badge child elements.
**Action:** Audit all interactive `onClick` divs and `icon-only` buttons across the application to ensure they are using proper semantic tags and have adequate `aria-labels` and `aria-hidden` attributes.
