## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-08 - [Custom Combobox Navigation]
**Learning:** Custom search results (comboboxes) built with buttons must implement `ArrowUp`/`ArrowDown` navigation and `aria-activedescendant` to be truly accessible; tabbing alone disrupts flow.
**Action:** When creating search inputs with custom result lists, always wire up keyboard event handlers for list navigation and visual focus management.
