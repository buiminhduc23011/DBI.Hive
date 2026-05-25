## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-05-25 - [Accessible Icon-Only Modal Actions]
**Learning:** Icon-only action buttons in modals (like close 'X', edit pen, delete trash, or send comment arrows) are frequently missed during accessibility passes, leaving screen reader users without context for these primary interactions.
**Action:** Always verify modal components have `aria-label`s on their icon-only buttons using localized strings (`t('...')`), and add `aria-hidden="true"` to the inner Lucide SVGs to prevent redundant announcements.
