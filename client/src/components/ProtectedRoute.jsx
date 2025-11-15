// src/components/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ProtectedRoute = ({ children, roles = [] }) => {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
    error: null
  });

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      // First check if we have a token locally
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAuthStatus({
          loading: false,
          isAuthenticated: false,
          user: null,
          error: 'No token found'
        });
        return;
      }

      // Verify token with backend to get actual user role
      const response = await axiosInstance.get('/api/userRoutes/verify-token');
      
      if (response.data.success) {
        const user = response.data.user;
        
        // Check if user has required role
        if (roles.length > 0 && !roles.includes(user.role)) {
          setAuthStatus({
            loading: false,
            isAuthenticated: true,
            user: user,
            error: 'Insufficient permissions'
          });
          return;
        }

        // Update localStorage with actual user data from backend
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthStatus({
          loading: false,
          isAuthenticated: true,
          user: user,
          error: null
        });
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      
      // Clear invalid tokens
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }

      setAuthStatus({
        loading: false,
        isAuthenticated: false,
        user: null,
        error: error.response?.data?.message || 'Authentication failed'
      });
    }
  };

  // Show loading spinner while verifying auth
  if (authStatus.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span style={{
          fontSize: '16px',
          color: '#6b7280'
        }}>Verifying access...</span>
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authStatus.isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: window.location.pathname }} />;
  }

  // Redirect to unauthorized if role doesn't match
  if (authStatus.error === 'Insufficient permissions') {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render the protected component
  return children;
};

export default ProtectedRoute;