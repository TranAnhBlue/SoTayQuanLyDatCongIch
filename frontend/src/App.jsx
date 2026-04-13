import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import RenterDashboard from './pages/Renter/Dashboard';
import ContractDetail from './pages/Renter/ContractDetail';
import Finance from './pages/Renter/Finance';
import Feedback from './pages/Renter/Feedback';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminApprovals from './pages/Admin/AdminApprovals';
import AdminReport from './pages/Admin/AdminReport';
import AdminHeatmap from './pages/Admin/AdminHeatmap';
import AdminSOPLog from './pages/Admin/AdminSOPLog';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ResetPassword from './pages/Auth/ResetPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import RenterLayout from './layouts/RenterLayout';
import axios from 'axios';
import './App.css';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1e7e34',
          fontFamily: "'Inter', sans-serif",
          borderRadius: 8,
        },
        components: {
          Layout: {
            headerBg: '#002e42',
            headerColor: '#ffffff',
          },
          Menu: {
            itemSelectedBg: '#1e7e34',
            itemSelectedColor: '#ffffff',
          }
        }
      }}
    >
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Renter Routes */}
          <Route 
            path="/renter" 
            element={
              <ProtectedRoute allowedRoles={['renter', 'admin']}>
                <RenterLayout />
              </ProtectedRoute>
            } 
          >
            <Route path="dashboard" element={<RenterDashboard />} />
            <Route path="contract" element={<ContractDetail />} />
            <Route path="finance" element={<Finance />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approvals" element={<AdminApprovals />} />
            <Route path="reports" element={<AdminReport />} />
            <Route path="heatmap" element={<AdminHeatmap />} />
            <Route path="sop-logs" element={<AdminSOPLog />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
