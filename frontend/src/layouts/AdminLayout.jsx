import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Divider, Space, Input } from 'antd';
import { 
  AppstoreOutlined, 
  CheckSquareOutlined, 
  SafetyCertificateOutlined,
  BarChartOutlined,
  HeatMapOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  BellFilled,
  SettingFilled,
  BankFilled,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const getSelectedKey = () => {
    return location.pathname;
  };

  const handleBottomMenuClick = (e) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
          <Text style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Sổ tay Quản lý Đất công</Text>
          
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
          {location.pathname.includes('heatmap') || location.pathname.includes('reports') ? (
             <Input 
             prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
             placeholder="Tìm kiếm dữ liệu..." 
             variant="filled"
             style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', width: '250px' }}
           />
          ) : null}

          <Space size={16} style={{ display: 'flex', alignItems: 'center' }}>
            <BellFilled style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }} />
            <SettingFilled style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }} />
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px', height: '32px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', lineHeight: '1.2' }}>Lãnh đạo UBND</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.2', marginTop: '2px' }}>Phê duyệt & Điều hành</div>
            </div>
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" size={32} />
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
                backgroundColor: '#002e42', 
                borderRadius: '8px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center' 
              }}>
                <BankFilled style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div style={{ marginLeft: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2', color: '#002e42' }}>Đất Việt Core</div>
                <div style={{ fontSize: '10px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HỆ THỐNG QUẢN TRỊ</div>
              </div>
            </div>

            {/* Main Menu */}
            <Menu 
              mode="inline" 
              selectedKeys={[getSelectedKey()]} 
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
              items={[
                { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/admin/approvals', icon: <CheckSquareOutlined />, label: 'Phê duyệt hồ sơ' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/admin/sop', icon: <SafetyCertificateOutlined />, label: 'Kiểm soát SOP' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/admin/reports', icon: <BarChartOutlined />, label: 'Báo cáo thống kê' },
                { type: 'divider', style: { margin: '8px 0', backgroundColor: 'transparent' } },
                { key: '/admin/heatmap', icon: <HeatMapOutlined />, label: 'Bản đồ nhiệt' }
              ]}
            />
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

export default AdminLayout;
