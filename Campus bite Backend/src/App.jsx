import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import HistoryPage from './pages/HistoryPage';
import MenuPage from './pages/MenuPage';
import PaymentsPage from './pages/PaymentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminFeesPage from './pages/admin/AdminFeesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCredentialsPage from './pages/admin/AdminCredentialsPage';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={user.role === 'super_admin' ? '/admin' : '/store'} replace />
          : <LoginPage />
      } />

      {/* Super Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="super_admin">
          <AdminProvider>
            <AdminLayout />
          </AdminProvider>
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="stores" element={<AdminStoresPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="fees" element={<AdminFeesPage />} />
        <Route path="credentials" element={<AdminCredentialsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Store Owner Routes */}
      <Route path="/store" element={
        <ProtectedRoute role="store_owner">
          <DashboardProvider>
            <DashboardLayout />
          </DashboardProvider>
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={
        isAuthenticated
          ? <Navigate to={user.role === 'super_admin' ? '/admin' : '/store'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
