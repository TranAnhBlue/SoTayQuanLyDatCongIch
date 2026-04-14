import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import RenterDashboard from './pages/Renter/Dashboard';
import ContractDetail from './pages/Renter/ContractDetail';
import ContractHistory from './pages/Renter/ContractHistory';
import Finance from './pages/Renter/Finance';
import Feedback from './pages/Renter/Feedback';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminApprovals from './pages/Admin/AdminApprovals';
import AdminReport from './pages/Admin/AdminReport';
import AdminHeatmap from './pages/Admin/AdminHeatmap';
import AdminSOPLog from './pages/Admin/AdminSOPLog';
import LandParcels from './pages/Admin/LandParcels';
import LegalDocuments from './pages/Admin/LegalDocuments';
import ChangeHistory from './pages/Admin/ChangeHistory';
import LandRequestManagement from './pages/Admin/LandRequestManagement';
import CreateLandRequest from './pages/Renter/CreateLandRequest';
import CreateLandRequestSimple from './pages/Renter/CreateLandRequestSimple';
import LandRequests from './pages/Renter/LandRequests';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ResetPassword from './pages/Auth/ResetPassword';
import ProfileSettings from './pages/Profile/ProfileSettings';
import FileUploadTest from './pages/Test/FileUploadTest';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import RenterLayout from './layouts/RenterLayout';
import { getToken } from './utils/auth';
import axios from 'axios';
import './App.css';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const token = getToken();
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

          {/* Profile Settings - Available for all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'renter']}>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />

          {/* File Upload Test - Available for all authenticated users */}
          <Route 
            path="/test/file-upload" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'renter']}>
                <FileUploadTest />
              </ProtectedRoute>
            } 
          />

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
            <Route path="contract-history" element={<ContractHistory />} />
            <Route path="land-requests" element={<LandRequests />} />
            <Route path="create-land-request" element={<CreateLandRequest />} />
            <Route path="create-land-request-simple" element={<CreateLandRequestSimple />} />
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
            <Route path="sop-logs" element={<AdminSOPLog />} />
            <Route path="land-parcels" element={<LandParcels />} />
            <Route path="legal-documents" element={<LegalDocuments />} />
            <Route path="change-history" element={<ChangeHistory />} />
            <Route path="land-request-management" element={<LandRequestManagement />} />
            <Route path="reports" element={<AdminReport />} />
            <Route path="heatmap" element={<AdminHeatmap />} />
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