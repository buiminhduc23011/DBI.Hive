## 2024-03-09 - OS-aware Keyboard Shortcuts
**Learning:** Adding visual hints for keyboard shortcuts like Cmd+K (Mac) or Ctrl+K (Windows) significantly improves feature discoverability. Using `navigator.platform` allows displaying the correct modifier key symbol (`⌘` vs `Ctrl`), which reduces user confusion. This must be evaluated dynamically on the client side.
**Action:** When adding global search or specific shortcut-driven features, implement OS-aware rendering for the shortcut `<kbd>` hints.

## 2024-03-09 - OS-aware Keyboard Shortcuts
**Learning:** Adding visual hints for keyboard shortcuts like Cmd+K (Mac) or Ctrl+K (Windows) significantly improves feature discoverability. Using `navigator.platform` allows displaying the correct modifier key symbol (`⌘` vs `Ctrl`), which reduces user confusion. This must be evaluated dynamically on the client side.
**Action:** When adding global search or specific shortcut-driven features, implement OS-aware rendering for the shortcut `<kbd>` hints.
