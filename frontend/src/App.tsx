import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/routes/LoginPage';
import { MainLayout } from './components/layouts/MainLayout';
import { DashboardPage } from './features/dashboard/routes/DashboardPage';
import { UsersPage } from './features/users/routes/UsersPage';
import { RolesPage } from './features/roles/routes/RolesPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
