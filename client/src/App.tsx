import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { KanbanBoard } from './pages/KanbanBoard';
import { Projects } from './pages/Projects';
import { Backlog } from './pages/Backlog';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { InteractiveOnboarding, useOnboarding } from './components/InteractiveOnboarding';
import { ToastContainer } from './components/Toast';
import { useAuthStore } from './stores/authStore';
import { useProjectStore } from './stores/projectStore';
import { useNotificationStore } from './stores/notificationStore';
import { useThemeStore } from './stores/themeStore';
import { useI18nStore } from './stores/i18nStore';
import { useToastStore } from './stores/toastStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();
  const { fetchProjects } = useProjectStore();
  const { fetchNotifications } = useNotificationStore();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { isDarkMode, setDarkMode } = useThemeStore();
  const { setLanguage } = useI18nStore();
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Apply user preferences from backend when user is loaded
  useEffect(() => {
    if (user) {
      // Sync theme from user preferences
      const isDark = user.theme === 'dark';
      setDarkMode(isDark);
      
      // Sync language from user preferences
      if (user.language === 'en' || user.language === 'vi') {
        setLanguage(user.language);
      }
    }
  }, [user]);

  // Apply theme whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {isAuthenticated && showOnboarding && (
        <InteractiveOnboarding onComplete={completeOnboarding} />
      )}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </BrowserRouter>
  );
}

export default App;
