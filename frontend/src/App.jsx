import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetail from './pages/customer/ProductDetail';
import CartPage from './pages/customer/CartPage';
import OrdersPage from './pages/customer/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <RegisterPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AppLayout><AdminProducts /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AppLayout><AdminOrders /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AppLayout><AdminUsers /></AppLayout></ProtectedRoute>} />

      {/* Customer routes */}
      <Route path="/dashboard" element={<ProtectedRoute role="customer"><AppLayout><CustomerDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute role="customer"><AppLayout><ProductsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute role="customer"><AppLayout><ProductDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute role="customer"><AppLayout><CartPage /></AppLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="customer"><AppLayout><OrdersPage /></AppLayout></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />

      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem'
              },
              success: { iconTheme: { primary: 'var(--success)', secondary: '#fff' } },
              error: { iconTheme: { primary: 'var(--danger)', secondary: '#fff' } }
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
