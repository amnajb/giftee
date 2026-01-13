import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children, role, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        fullScreen 
        text="Checking authentication..." 
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const allowedRoles = roles || (Array.isArray(role) ? role : (role ? [role] : []));
  
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const roleRedirects = {
        admin: '/admin',
        cashier: '/cashier',
        customer: '/customer',
        user: '/customer',  // 'user' role goes to customer page
      };
      
      const redirectPath = roleRedirects[user.role] || '/customer';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
