## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-10-24 - HTML5 Validation Blocking Playwright Login
**Learning:** Even when mocking the API endpoint for login, if the underlying login form relies on native HTML5 `required` attributes, clicking the submit button without filling the input fields will cause the browser to block the submission and show a native "Please fill out this field" tooltip, completely bypassing the mocked network request.
**Action:** When writing Playwright tests that test features *behind* a login wall by clicking the actual login button, always fill the required input fields with dummy data (`page.locator('input[type="text"]').fill("user")`) before clicking submit to satisfy the browser's form validation.
