import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or dashboard if role not allowed
        const fallback = user.role === 'admin' ? '/admin/dashboard' : '/renter/dashboard';
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;
