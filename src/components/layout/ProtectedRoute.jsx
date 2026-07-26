import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center pt-150 pb-150 text-white">
        <i className="fas fa-spinner fa-spin me-2"></i> Loading session...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && currentUser.email !== 'appifyra@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
