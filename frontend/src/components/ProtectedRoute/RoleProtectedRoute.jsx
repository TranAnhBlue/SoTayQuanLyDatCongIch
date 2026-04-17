import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Forbidden from '../../pages/Error/Forbidden';

/**
 * Component để bảo vệ route dựa trên role
 * Nếu user không có role được phép, sẽ hiển thị trang 403
 * 
 * @param {React.ReactNode} children - Component con
 * @param {string|string[]} allowedRoles - Role(s) được phép truy cập
 * @param {boolean} redirectToLogin - Có redirect đến login nếu chưa đăng nhập (default: true)
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectToLogin = true 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Đang load authentication state
  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Đang tải...</div>;
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return redirectToLogin ? <Navigate to="/login" replace /> : <Forbidden />;
  }

  // Kiểm tra role
  const userRole = user?.role;
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Nếu user không có role được phép
  if (rolesArray.length > 0 && !rolesArray.includes(userRole)) {
    return <Forbidden />;
  }

  // Có quyền truy cập
  return children;
};

export default RoleProtectedRoute;
