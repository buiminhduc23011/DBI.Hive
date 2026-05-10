## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2024-05-10 - OS-Aware Keyboard Shortcut Hints
**Learning:** When adding keyboard shortcuts (like search focus) in React, dynamically displaying the OS-specific modifier (e.g., 'Cmd K' on Mac vs 'Ctrl K' on Windows) greatly improves discoverability and prevents confusion. Also, using `kbd` tags within an absolute positioned wrapper inside the input element makes the hint look native and unobtrusive.
**Action:** Use `navigator.platform` inside a `useEffect` to safely check for OS environment ('MAC') and set the state. Ensure the hint is hidden on small screens (using Tailwind's `hidden md:inline-block`) and disappears when input text is present to avoid visual overlap. Also, use `e.key.toLowerCase() === 'k'` with `e.metaKey` or `e.ctrlKey` for robust detection.
