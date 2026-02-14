## 2024-05-22 - Authentication Initialization Pattern
**Learning:** The application redirects to `/login` on initial load even if a valid token exists in `localStorage`, causing a flash of unauthenticated state or failed deep linking. This is because `checkAuth` runs in `useEffect` (asynchronously) while `ProtectedRoute` runs synchronously during initial render.
**Action:** Initialize `isAuthenticated` state synchronously in the Zustand store by reading `localStorage` directly during store creation, rather than waiting for `useEffect`.

## 2024-05-22 - Modal Accessibility & Data Dependency
**Learning:** `TaskDetailModal` lacked basic accessibility features (Escape key, backdrop click, ARIA roles). Additionally, it has a strong dependency on the `projects` store being populated to determine user permissions (`canEdit`), which can lead to silent failures or UI glitches if the modal is opened before projects are fetched.
**Action:** Ensure modals handle missing data gracefully and implement `useEffect` hooks for keyboard accessibility (`Escape` key) and focus management.
