## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.
## 2026-02-01 - [Playwright Keyboard Shortcuts]
**Learning:** In Playwright tests, `page.keyboard.press("Meta+K")` sets `event.key` to uppercase "K". If the component code explicitly checks `event.key === "k"`, the test will fail to trigger the shortcut. Use `page.keyboard.press("Meta+k")` instead.
**Action:** Always align the case of the key in Playwright `keyboard.press` with the exact character case expected by the application logic.
