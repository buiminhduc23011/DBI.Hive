## 2026-02-01 - [Search Component Accessibility]
**Learning:** Custom search dropdowns using divs and buttons often lack semantic ARIA roles (combobox/listbox) and accessible labels for icon-only buttons (like Clear/Search).
**Action:** Always verify custom interactive components with ARIA roles and ensure all icon-only buttons have descriptive aria-labels.

## 2026-06-10 - [Keyboard Shortcut Hints]
**Learning:** Implementing explicit, OS-aware visual hints for global keyboard shortcuts makes hidden functionality discoverable, but requires careful handling of absolute positioning and overlapping elements (using pointer-events-none) to avoid interfering with the input's clickable area.
**Action:** Always provide explicit visual kbd hints for global shortcuts, use dynamic OS detection to display the correct modifier key, and apply pointer-events-none to decorative overlays inside inputs.
