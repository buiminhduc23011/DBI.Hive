import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { KanbanBoard } from './pages/KanbanBoard';
import { useAuthStore } from './stores/authStore';
import { useProjectStore } from './stores/projectStore';
import { useNotificationStore } from './stores/notificationStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Placeholder pages
const Projects: React.FC = () => <div className="text-2xl font-bold">Projects Page</div>;
const Backlog: React.FC = () => <div className="text-2xl font-bold">Backlog Page</div>;
const Calendar: React.FC = () => <div className="text-2xl font-bold">Calendar Page</div>;
const Settings: React.FC = () => <div className="text-2xl font-bold">Settings Page</div>;

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchProjects } = useProjectStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, []);

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
    </BrowserRouter>
  );
}

export default App;
