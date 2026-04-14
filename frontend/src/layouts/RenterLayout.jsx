import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography, Divider } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TransactionOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Sider, Footer } = Layout;
const { Text } = Typography;

const RenterLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userKey, setUserKey] = useState(Date.now());

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = () => {
      setUserKey(Date.now());
    };
    
    window.addEventListener('user-updated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  // Top navigation items (header)
  const headerItems = [
    { key: 'hop-dong', label: 'Hợp đồng' },
    { key: 'thanh-toan', label: 'Thanh toán' },
    { key: 'gop-y', label: 'Góp ý' },
    { key: 'huong-dan', label: 'Hướng dẫn' },
  ];

  const handleBottomMenuClick = (e) => {
    if (e.key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  // Sidebar navigation items
  const siderItems = [
    { key: '/renter/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
    { key: '/renter/contract', icon: <FileTextOutlined />, label: 'Hợp đồng của tôi' },
    { key: '/renter/finance', icon: <TransactionOutlined />, label: 'Lịch sử giao dịch' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginRight: '40px', letterSpacing: '1px' }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            ĐẤT VIỆT CORE
          </div>
          <Menu 
            theme="dark" 
            mode="horizontal" 
            defaultSelectedKeys={[]} 
            style={{ width: '400px', backgroundColor: 'transparent', borderBottom: 'none' }}
            items={headerItems}
          />
        </div>
        <Space size="large">
          <BellOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
          <Avatar 
            key={userKey}
            icon={<UserOutlined />} 
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            style={{ backgroundColor: '#ffffff33', cursor: 'pointer' }} 
            onClick={() => navigate('/profile')}
          />
        </Space>
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={260} theme="light" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <div style={{ padding: '24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <Avatar key={userKey} size={40} src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} />
            <div style={{ marginLeft: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.2' }}>{user?.name || 'Người thuê đất'}</div>
              <div style={{ fontSize: '10px', color: '#8c8c8c', textTransform: 'uppercase', marginTop: '4px' }}>{user?.email || 'HỆ THỐNG QUẢN LÝ'}</div>
            </div>
          </div>

          <Menu 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            style={{ borderRight: 0, padding: '0 16px' }}
            onClick={({ key }) => navigate(key)}
            items={siderItems}
          />

          <div style={{ padding: '16px 24px' }}>
            <Button 
              type="primary" 
              block 
              icon={<MessageOutlined />} 
              style={{ backgroundColor: '#1e7e34', marginBottom: 12, height: '40px', borderRadius: '6px' }}
              onClick={() => navigate('/renter/feedback')}
            >
              Gửi phản hồi
            </Button>
            <Button 
              type="primary" 
              block 
              style={{ backgroundColor: '#002e42', height: '40px', borderRadius: '6px' }}
            >
              Tạo yêu cầu mới
            </Button>
          </div>
          </div>

          <div style={{ padding: '0 16px 24px 16px', marginTop: 'auto' }}>
            <Divider style={{ margin: '12px 0' }} />
            <Menu 
              mode="inline" 
              style={{ borderRight: 0 }}
              onClick={handleBottomMenuClick}
              items={[
                { key: 'help', icon: <QuestionCircleOutlined />, label: 'Hỗ trợ' },
                { key: 'logout', icon: <LogoutOutlined />, label: <span style={{ color: '#d9363e' }}>Đăng xuất</span> }
              ]}
            />
          </div>
        </Sider>

        {/* CONTENT */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ margin: 0, minHeight: 280, paddingTop: '24px' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between', padding: '24px 0 0 0', backgroundColor: 'transparent' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              © 2024 Cổng thông tin Thuê đất Quốc gia. Đất Việt Core System.
            </Text>
            <Space size="large">
              <Text type="secondary" style={{ fontSize: '12px', cursor: 'pointer' }}>Điều khoản</Text>
              <Text type="secondary" style={{ fontSize: '12px', cursor: 'pointer' }}>Bảo mật</Text>
              <Text type="secondary" style={{ fontSize: '12px', cursor: 'pointer' }}>Liên hệ</Text>
            </Space>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default RenterLayout;
// Note: We need to import EnvironmentOutlined locally from antd icons above.
