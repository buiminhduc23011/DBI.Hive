## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-10-24 - API Response Mocks for Auth
**Learning:** When writing tests that mock the `/api/auth/me` and `/api/auth/login` endpoints, if the `user` object is missing the `fullName` property, the `<Header>` component will crash (throwing a `Cannot read properties of undefined (reading 'charAt')` error) because it expects that string for the user avatar fallback rendering.
**Action:** Always include a `fullName: "User Name"` string in any mocked user state representing a logged-in session.
