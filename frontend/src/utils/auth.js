/**
 * Authentication Utility Functions
 * Quản lý token, session và thông tin người dùng
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const SESSION_KEY = 'session';

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

/**
 * Lưu token vào localStorage
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Lấy token từ localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Kiểm tra xem có token hay không
 */
export const hasToken = () => {
  return !!getToken();
};

// ==========================================
// USER MANAGEMENT
// ==========================================

/**
 * Lưu thông tin user vào localStorage
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Lấy thông tin user từ localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Xóa thông tin user khỏi localStorage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 */
export const isAuthenticated = () => {
  return hasToken() && !!getUser();
};

// ==========================================
// SESSION MANAGEMENT
// ==========================================

/**
 * Tạo session mới khi đăng nhập
 */
export const createSession = (token, user) => {
  const session = {
    token,
    user,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };
  
  setToken(token);
  setUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return session;
};

/**
 * Lấy thông tin session hiện tại
 */
export const getSession = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  try {
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

/**
 * Kiểm tra session có hợp lệ không
 */
export const isSessionValid = () => {
  const session = getSession();
  if (!session) return false;
  
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  
  return now < expiresAt;
};

/**
 * Xóa session (logout)
 */
export const clearSession = () => {
  removeToken();
  removeUser();
  localStorage.removeItem(SESSION_KEY);
};

// ==========================================
// ROLE & PERMISSION CHECKS
// ==========================================

/**
 * Kiểm tra role của user hiện tại
 */
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

/**
 * Kiểm tra xem user có role cụ thể không
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Kiểm tra xem user có một trong các role được chỉ định không
 */
export const hasAnyRole = (roles = []) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

/**
 * Kiểm tra xem user có phải admin không
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Kiểm tra xem user có phải officer không
 */
export const isOfficer = () => {
  return hasRole('officer');
};

/**
 * Kiểm tra xem user có phải renter không
 */
export const isRenter = () => {
  return hasRole('renter');
};

/**
 * Kiểm tra xem user có quyền admin/officer không
 */
export const isAdminOrOfficer = () => {
  return hasAnyRole(['admin', 'officer']);
};

// ==========================================
// USER INFO HELPERS
// ==========================================

/**
 * Lấy tên người dùng
 */
export const getUserName = () => {
  const user = getUser();
  return user?.name || 'Người dùng';
};

/**
 * Lấy email người dùng
 */
export const getUserEmail = () => {
  const user = getUser();
  return user?.email || '';
};

/**
 * Lấy ID người dùng
 */
export const getUserId = () => {
  const user = getUser();
  return user?.id || null;
};

/**
 * Lấy thông tin đầy đủ người dùng
 */
export const getUserInfo = () => {
  const user = getUser();
  const session = getSession();
  
  return {
    ...user,
    loginTime: session?.loginTime,
    expiresAt: session?.expiresAt,
    isValid: isSessionValid(),
  };
};

// ==========================================
// SESSION REFRESH
// ==========================================

/**
 * Làm mới session (gia hạn thời gian)
 */
export const refreshSession = () => {
  const session = getSession();
  if (!session) return null;
  
  const newSession = {
    ...session,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

/**
 * Cập nhật thông tin user trong session
 */
export const updateUserInSession = (updatedUser) => {
  const session = getSession();
  if (!session) return null;
  
  const newUser = { ...session.user, ...updatedUser };
  const newSession = { ...session, user: newUser };
  
  setUser(newUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  
  return newSession;
};

// ==========================================
// REDIRECT HELPERS
// ==========================================

/**
 * Lấy URL redirect mặc định theo role
 */
export const getDefaultRedirectUrl = () => {
  const role = getUserRole();
  
  switch (role) {
    case 'admin':
    case 'officer':
      return '/admin/dashboard';
    case 'renter':
      return '/renter/dashboard';
    default:
      return '/login';
  }
};

/**
 * Kiểm tra xem user có quyền truy cập route không
 */
export const canAccessRoute = (allowedRoles = []) => {
  if (!isAuthenticated()) return false;
  if (allowedRoles.length === 0) return true;
  
  return hasAnyRole(allowedRoles);
};

// ==========================================
// EXPORT ALL
// ==========================================

export default {
  // Token
  setToken,
  getToken,
  removeToken,
  hasToken,
  
  // User
  setUser,
  getUser,
  removeUser,
  isAuthenticated,
  
  // Session
  createSession,
  getSession,
  isSessionValid,
  clearSession,
  refreshSession,
  updateUserInSession,
  
  // Role
  getUserRole,
  hasRole,
  hasAnyRole,
  isAdmin,
  isOfficer,
  isRenter,
  isAdminOrOfficer,
  
  // User Info
  getUserName,
  getUserEmail,
  getUserId,
  getUserInfo,
  
  // Redirect
  getDefaultRedirectUrl,
  canAccessRoute,
};
