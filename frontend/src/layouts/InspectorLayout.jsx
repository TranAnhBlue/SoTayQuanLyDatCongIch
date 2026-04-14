import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Divider, Space, Input } from 'antd';
import { 
  AppstoreOutlined, 
  FileSearchOutlined,
  AuditOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  BellFilled,
  SettingFilled,
  SafetyOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const InspectorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userKey, setUserKey] = useState(Date.now());

  useEffect(() => {
    const handleUserUpdate = () => {
      setUserKey(Date.now());
    };
    
    window.addEventListener('user-updated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const getSelectedKey = () => {
    return location.pathname;
  };

  const handleBottomMenuClick = (e) => {
    if (e.key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#002e42', 
        padding: '0 24px',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        height: '64px',
        lineHeight: 'initial'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Text style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            Quản lý Đất công ích
          </Text>
          
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Tài liệu</a>
            <a href="#/" style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', position: 'relative' }}>
              Kế hoạch
              <div style={{ position: 'absolute', bottom: '-22px', left: 0, width: '100%', height: '2px', backgroundColor: 'white' }}></div>
            </a>
            <a href="#/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Dữ liệu</a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Input 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
            placeholder="Tìm kiếm hồ sơ, tọa độ..." 
            variant="filled"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', width: '250px' }}
          />

          <Space size={16} style={{ display: 'flex', alignItems: 'center' }}>
            <BellFilled style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }} />
            <SettingFilled style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }} />
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px', height: '32px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', lineHeight: '1.2' }}>
                {user?.name || 'Thanh tra viên'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.2', marginTop: '2px' }}>
                THANH TRA VIÊN
              </div>
            </div>
            <Avatar 
              key={userKey}
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Inspector'}`} 
              size={32} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={260} theme="light" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <div style={{ padding: '24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Logo Part */}
            <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ 
                width: '40px', height: '40px', 
                backgroundColor: '#d9363e', 
                borderRadius: '8px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center' 
              }}>
                <SafetyOutlined style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div style={{ marginLeft: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2', color: '#002e42' }}>
                  Thanh tra Viên
                </div>
                <div style={{ fontSize: '10px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SỐ TÀI NGUYÊN & MÔI TRƯỜNG
                </div>
              </div>
            </div>

            {/* Main Menu */}
            <Menu 
              mode="inline" 
              selectedKeys={[getSelectedKey()]} 
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
              items={[
                { key: '/inspector/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/inspector/inspections', icon: <FileSearchOutlined />, label: 'Lịch sử kiểm tra' },
                { key: '/inspector/audits', icon: <AuditOutlined />, label: 'Công đối soát' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/inspector/violations', icon: <FileTextOutlined />, label: 'Lập biên bản vi phạm' }
              ]}
            />

            {/* Alert Button */}
            <div style={{ padding: '0 16px', marginTop: '16px' }}>
              <div style={{
                background: '#d9363e',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                <span style={{ fontSize: '16px' }}>⚠</span>
                Báo cáo khẩn cấp
              </div>
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

        {/* MAIN CONTENT AREA */}
        <Layout style={{ backgroundColor: '#f4f6f8' }}>
          <Content style={{ padding: '32px 32px 0 32px', overflow: 'initial' }}>
            <Outlet />
          </Content>
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#8c8c8c', fontSize: '12px' }}>
            Hệ thống Đất Việt Core v2.4.0 <br/>
            © 2024 Trung tâm Chuyển đổi số Quản lý Đất đai
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
              <a href="#" style={{ color: '#8c8c8c' }}>Điều khoản</a>
              <a href="#" style={{ color: '#8c8c8c' }}>Bảo mật</a>
              <a href="#" style={{ color: '#8c8c8c' }}>Liên hệ</a>
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default InspectorLayout;
