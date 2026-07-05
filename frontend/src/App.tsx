import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('./features/auth/routes/LoginPage').then(m => ({ default: m.LoginPage })));
const MainLayout = React.lazy(() => import('./components/layouts/MainLayout').then(m => ({ default: m.MainLayout })));
const DashboardPage = React.lazy(() => import('./features/dashboard/routes/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = React.lazy(() => import('./features/users/routes/UsersPage').then(m => ({ default: m.UsersPage })));
const RolesPage = React.lazy(() => import('./features/roles/routes/RolesPage').then(m => ({ default: m.RolesPage })));

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
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

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
