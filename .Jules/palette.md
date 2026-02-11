## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-02 - [Protected Routes Race Condition]
**Learning:** Initializing auth state in `useEffect` (async) creates a race condition with protected routes, causing redirects to login even for authenticated users.
**Action:** Initialize auth state synchronously from `localStorage` in the store creation or ensure the router waits for initial auth check.
