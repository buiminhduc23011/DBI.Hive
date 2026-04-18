## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-04-18 - [Icon-Only Button Accessibility in Modals]
**Learning:** Icon-only buttons in modals (like Edit, Delete, Close, Send) often lack accessible names. Adding `aria-label` to the button and `aria-hidden="true"` to the nested SVG icon prevents redundant screen reader announcements while ensuring proper accessibility. Also learned that adding new localized text requires adding keys to the i18n store first.
**Action:** Always add descriptive `aria-label` attributes to icon-only buttons, set `aria-hidden="true"` on their child icons, and use localized strings from the i18n store.
