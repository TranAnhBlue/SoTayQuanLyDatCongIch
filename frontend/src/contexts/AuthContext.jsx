import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createSession, 
  clearSession, 
  getUser, 
  getToken,
  isSessionValid,
  getUserRole,
  getUserName,
  getUserEmail,
  getUserId,
  updateUserInSession
} from '../utils/auth';

// Tạo Context
const AuthContext = createContext(null);

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khởi tạo: Kiểm tra session khi app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Khởi tạo authentication state
  const initializeAuth = () => {
    try {
      const storedToken = getToken();
      const storedUser = getUser();
      
      if (storedToken && storedUser && isSessionValid()) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // Session hết hạn hoặc không hợp lệ
        logout();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập
  const login = (authToken, userData) => {
    try {
      // Tạo session mới
      createSession(authToken, userData);
      
      // Cập nhật state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  // Đăng xuất
  const logout = () => {
    try {
      // Xóa session
      clearSession();
      
      // Reset state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  // Cập nhật thông tin user
  const updateUser = (updatedData) => {
    try {
      const newUser = { ...user, ...updatedData };
      updateUserInSession(newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  // Kiểm tra role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Kiểm tra nhiều roles
  const hasAnyRole = (roles = []) => {
    return roles.includes(user?.role);
  };

  // Lấy thông tin user
  const getCurrentUser = () => {
    return {
      id: getUserId(),
      name: getUserName(),
      email: getUserEmail(),
      role: getUserRole(),
      ...user,
    };
  };

  // Context value
  const value = {
    // State
    user,
    token,
    loading,
    isAuthenticated,
    
    // Methods
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    getCurrentUser,
    
    // Computed values
    isAdmin: user?.role === 'admin',
    isOfficer: user?.role === 'officer',
    isRenter: user?.role === 'renter',
    isAdminOrOfficer: ['admin', 'officer'].includes(user?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
