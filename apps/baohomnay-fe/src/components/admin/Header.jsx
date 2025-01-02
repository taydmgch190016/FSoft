import React from 'react';
import { LogoutOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar , Space , Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/image/tooc.jpg'
const { Header } = Layout;

const HeaderComponents = () => {
    const nav = useNavigate()
    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const handleLogout = () => {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('accessToken')
      nav('/')
    }
    const menuProps = {
      items: [
        {
          label: `${user.fullname}`
        },
          {
            type : 'divider'
          },
        {
          key: 'profile',
          label: 'Profile',
          onClick: () => nav('/user'),
          icon: <UserOutlined />
        },
        {
          key: 'logout',
          label: 'Log Out',
          onClick : handleLogout,
          icon: <LogoutOutlined />
        },
      ],
    };
  return (
    <Header style={{ background: '#fff' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
     <div>
        
        </div>
      <Space>
       
      <Dropdown menu={menuProps} trigger={['click']} placement="bottomRight" >
         <div >
          <Avatar
            src={avatar}
            size={42}
            icon={<UserOutlined />}
          />
          <span
            style={{
              marginLeft: '10px',
              color: "whitesmoke",
            }}
          >
     
          </span>
         </div>
       </Dropdown>
      </Space>
    </div>
  </Header>
  );
};
export default HeaderComponents;