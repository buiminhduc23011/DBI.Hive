## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Playwright Auth Bypass in Localized Apps]
**Learning:** Bypassing login through direct `localStorage` injection of user/token often fails due to complex auth context validation or routing races on mount. Furthermore, explicitly mocking endpoints is necessary, but wildcard routing (`*/**/api/...`) may not correctly match the Vite proxy or API base URL depending on exact path setups, leading to missing API responses and subsequent component crashes (e.g. `projects.some is not a function`).
**Action:** When performing Playwright UI testing, testing the genuine login flow via UI interaction (while intercepting the `login` endpoint) is generally more stable than mocking purely in `localStorage`. Additionally, ensure mocking exact routes matches network behavior precisely, avoiding wildcard patterns unless explicitly configured to match.
