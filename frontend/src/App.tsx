import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import NewRequestPage from './pages/citizen/NewRequestPage';
import MyRequestsPage from './pages/citizen/MyRequestsPage';
import CitizenRequestDetailPage from './pages/citizen/RequestDetailPage';
import DashboardPage from './pages/staff/DashboardPage';
import StaffRequestDetailPage from './pages/staff/StaffRequestDetailPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const defaultRoute = user.role === 'CITIZEN' ? '/citizen/my-requests' : '/staff/dashboard';

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={handleLogout} />}>
        <Route path="/login" element={<Navigate to={defaultRoute} />} />
        <Route path="/" element={<Navigate to={defaultRoute} />} />
        <Route path="/citizen/new-request" element={<NewRequestPage user={user} />} />
        <Route path="/citizen/my-requests" element={<MyRequestsPage user={user} />} />
        <Route path="/citizen/requests/:id" element={<CitizenRequestDetailPage />} />
        <Route path="/staff/dashboard" element={<DashboardPage user={user} />} />
        <Route path="/staff/requests/:id" element={<StaffRequestDetailPage user={user} />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        <Route path="*" element={<Navigate to={defaultRoute} />} />
      </Route>
    </Routes>
  );
}
