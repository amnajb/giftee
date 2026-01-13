import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Cashier Pages
import CashierHome from './pages/cashier/CashierHome';

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';

// Placeholder components for other roles (to be implemented)
const AdminHome = () => (
  <div className="placeholder-page">
    <h1>Admin Dashboard</h1>
    <p>Coming soon...</p>
  </div>
);

const NotFound = () => (
  <div className="placeholder-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ color: 'var(--color-primary)' }}>Go Home</a>
  </div>
);

// Role-based redirect component
const RoleBasedRedirect = () => {
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Root redirect */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Cashier Routes */}
            <Route
              path="/cashier"
              element={
                <ProtectedRoute role={["cashier"]}>
                  <CashierHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashier/*"
              element={
                <ProtectedRoute role={["cashier"]}>
                  <CashierHome />
                </ProtectedRoute>
              }
            />

            {/* Customer Routes - accepts both "user" and "customer" roles */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute role={["user", "customer"]}>
                  <CustomerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute role={["user", "customer"]}>
                  <CustomerHome />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role={["admin"]}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role={["admin"]}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
