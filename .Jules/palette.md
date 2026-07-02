## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-02-01 - [Loading States for Async Operations]
**Learning:** Submit buttons for forms executing async requests (like login or register) should provide immediate visual feedback (e.g., a loading spinner) inside the button itself, keeping the user informed of the ongoing process and preventing confusion or double-submissions.
**Action:** Always include an `isLoading` check and conditionally render a loading indicator (like `<Loader2 className="animate-spin" />`) next to the text in primary submit buttons for critical async forms.
