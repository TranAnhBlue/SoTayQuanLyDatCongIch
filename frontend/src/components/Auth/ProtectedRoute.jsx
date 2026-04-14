import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const { isAuthenticated, user, loading } = useAuth();

    // Hiển thị loading khi đang kiểm tra session
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
            }}>
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    // Chưa đăng nhập -> redirect về login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền truy cập theo role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect về dashboard phù hợp với role
        const fallback = user.role === 'admin' || user.role === 'officer' 
            ? '/admin/dashboard'
            : user.role === 'finance'
            ? '/finance/dashboard'
            : '/renter/dashboard';
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;
