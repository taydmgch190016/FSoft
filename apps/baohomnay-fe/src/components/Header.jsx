import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Space,
  ConfigProvider,
  Button,
  Dropdown,
  Avatar,
  Divider,
  Tooltip
} from 'antd';
import { SearchOutlined, UserOutlined, CloudOutlined, PlusOutlined,UnorderedListOutlined ,SlidersOutlined } from '@ant-design/icons';
import { getCategory } from '../service/category.service';
import { showLoginModal } from '../helper/zustand';
import { getWeather, getCurrentCity } from '../weatherApi/weathherApi';
import { LogoutOutlined, VideoCameraOutlined } from '@ant-design/icons';
import avatar from '../assets/image/tooc.jpg';
import List from 'rc-virtual-list';

const { Header } = Layout;

const HeaderComponent = ({ OnClick }) => {
  const location = useLocation();
  const nav = useNavigate();
  const [selectedKey, setSelectedKey] = useState('');
  const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const [categories, setCategories] = useState([]);
  const [celsius, setCelsius] = useState('29');
  const [city, setCity] = useState('City');
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);
  useEffect(() => {
    getCategory().then((res) => {
      setCategories(res);
    });
  }, []);
  const handleClick = (e) => {
    OnClick(e);
    setSelectedKey(e.key);
  };
  useEffect(() => {
    getCurrentCity().then((res) => {
      setCity(res);
    });
  }, []);
  useEffect(() => {
    getWeather({ city }).then((res) => {
      const celsius = Math.round(res.data.main.temp);
      setCelsius(celsius);
    });
  }, [city]);
  const handLoginModal = showLoginModal((state) => state.showModal);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    nav('/');
  };

  const menuProps = {
    items: [
      {
        label: (
          <div>
            <p>
              {user.fullname} ({user.categoryId?.name})
            </p>
            <p></p>
          </div>
        ),
      },
      {
        type: 'divider',
      },

      {
        key: 'profile',
        label: 'Profile',
        onClick: () => nav('/user'),
        icon: <UserOutlined />,
      },
      {
        key: 'logout',
        label: 'Log Out',
        onClick: handleLogout,
        icon: <LogoutOutlined />,
      },
    ],
  };

  user.role === 'staff' &&
    menuProps.items.push(
      {
        key: 'create-article',
        label: 'Create Article',
        onClick: () => nav('/staff/create-article'),
        icon: <PlusOutlined />,
      },
      {
        key: 'list-article',
        label: 'List Article',
        onClick: () => nav('/staff/List-article'),
        icon: <UnorderedListOutlined/>,
      }
    );

  user.role === 'admin' &&
    menuProps.items.push({
      key: 'admin-dashboard',
      label: 'Go to Admin',
      onClick: () => window.open('/auth/', '_blank'),
      icon: <SlidersOutlined/>,
    });

  return (
    <Header style={{ background: '#fff', padding: '0 10px 0 10px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
        onClick={() => nav('/')}
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#008000',
            marginRight: '20px',
            cursor: 'pointer',
          }}
        >
          Báo Hôm Nay
        </a>
        <CloudOutlined /> {city}, {celsius}°C
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHoverColor: '#008000 !important',
                itemSelectedColor: '#008000 !important',
                horizontalItemSelectedColor: '#008000 !important',
              },
            },
          }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            style={{ flex: 1, width: 100 }}
            onClick={handleClick}
          >
            <Menu.Item key="/">Tin mới nhất</Menu.Item>
            {categories.length > 0 ? (
              categories.map((category) => {
                return (
                  <Menu.Item key={`/category/${category._id}`}>
                    {category.name}
                  </Menu.Item>
                );
              })
            ) : (
              <div>Loading...</div>
            )}
          </Menu>
          <Button icon={<SearchOutlined />} style={{ marginRight: '10px' }} type="text" iconPosition="end" onClick={() => nav('/search')}>
            Tìm kiếm
          </Button>
        </ConfigProvider>
        <Space>
          {user.role ? (
            <Dropdown
              menu={menuProps}
              trigger={['click']}
              placement="bottomRight"
            >
              <div>
                <Avatar src={avatar} size={42} icon={<UserOutlined />} />
                <span
                  style={{
                    marginLeft: '10px',
                    color: 'whitesmoke',
                  }}
                ></span>
              </div>
            </Dropdown>
          ) : (
            <Button onClick={handLoginModal}>Login</Button>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent;
