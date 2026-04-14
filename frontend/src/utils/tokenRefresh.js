/**
 * Token Refresh Utility
 * Tự động refresh token khi gần hết hạn
 */

import { getSession, refreshSession, isSessionValid, clearSession } from './auth';
import { message } from 'antd';

let refreshTimer = null;
let isRefreshing = false;

/**
 * Bắt đầu auto refresh token
 */
export const startTokenRefresh = (onExpired) => {
  stopTokenRefresh(); // Dừng timer cũ nếu có
  
  const checkAndRefresh = () => {
    const session = getSession();
    if (!session || !isSessionValid()) {
      if (onExpired) onExpired();
      return;
    }

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const timeUntilExpiry = expiresAt - now;
    
    // Refresh khi còn 7 ngày (7 * 24 * 60 * 60 * 1000 ms)
    const refreshThreshold = 7 * 24 * 60 * 60 * 1000;
    
    if (timeUntilExpiry <= refreshThreshold && !isRefreshing) {
      performTokenRefresh();
    }
  };

  // Kiểm tra ngay lập tức
  checkAndRefresh();
  
  // Kiểm tra mỗi giờ
  refreshTimer = setInterval(checkAndRefresh, 60 * 60 * 1000);
};

/**
 * Dừng auto refresh token
 */
export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

/**
 * Thực hiện refresh token
 */
const performTokenRefresh = async () => {
  if (isRefreshing) return;
  
  isRefreshing = true;
  
  try {
    const newSession = refreshSession();
    if (newSession) {
      console.log('Token refreshed successfully');
      message.success('Phiên đăng nhập đã được gia hạn', 2);
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    message.error('Không thể gia hạn phiên đăng nhập');
    clearSession();
  } finally {
    isRefreshing = false;
  }
};

/**
 * Refresh token thủ công
 */
export const manualRefreshToken = () => {
  return performTokenRefresh();
};

/**
 * Kiểm tra xem có cần refresh không
 */
export const shouldRefreshToken = () => {
  const session = getSession();
  if (!session) return false;
  
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const timeUntilExpiry = expiresAt - now;
  
  // Cần refresh khi còn < 7 ngày
  return timeUntilExpiry <= 7 * 24 * 60 * 60 * 1000;
};

/**
 * Lấy thời gian còn lại trước khi cần refresh
 */
export const getTimeUntilRefresh = () => {
  const session = getSession();
  if (!session) return null;
  
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const refreshTime = new Date(expiresAt.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return Math.max(0, refreshTime - now);
};

export default {
  startTokenRefresh,
  stopTokenRefresh,
  manualRefreshToken,
  shouldRefreshToken,
  getTimeUntilRefresh,
};