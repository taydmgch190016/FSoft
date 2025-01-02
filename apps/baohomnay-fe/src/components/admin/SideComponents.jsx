import React, { useState, useEffect } from 'react';
import avatar from '../../assets/image/headerImg.png';
import { ConfigProvider, Layout, Menu, Avatar } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  FileSearchOutlined ,
  ShoppingCartOutlined
} from '@ant-design/icons';
import {   useNavigate } from 'react-router-dom';
import { getCategory } from '../../service/category.service';
const {  Sider } = Layout;

const SideComponents = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();

  const handleClick = (e) => {
    nav(e.key);
  };
  useEffect(() =>{
    getCategory().then((res) =>{
      setCategories(res);
    });
  }, [categories]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            colorItemBg: 'transparent',
            colorItemText: '#fff',
            borderRadius: 10,
            colorItemBgHover: '#1890ff',
            colorItemBgSelected: '#096dd9',
            colorItemTextSelected: '#fff',
            itemHeight: 60,
            itemMarginInline: 17,
          },
        },
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={280}
        style={{
          
          color: '#fff',
        }}
      >
        {collapsed ? '' : <div
          style={{
            fontFamily: "'DM Serif Text', serif",
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#e4e0e0',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            padding: '20px',
            marginLeft: '20px',
            marginBottom: '180px',
          }}
        >
            <Avatar
            src={avatar}
            size={55}
            icon={<UserOutlined />}
            style={{ marginRight: 'px' }}
          />
          Newspapers
        </div>}
        

        <Menu theme="light" mode="vertical" onClick={handleClick}  >
          <Menu.Item key="account" icon={<UserOutlined />}>
            Account
          </Menu.Item>
          <Menu.Item key="category" icon={<FileSearchOutlined />}>
            Category
          </Menu.Item>
          
          <Menu.SubMenu key="sub1" icon={<UploadOutlined />} title="Articles" onClick={handleClick}>
    {categories.map((category) => (
      <Menu.Item
        key={`categories/${category?._id}`}
        style={{ color: "black" }}
        
      >
        {category.name}
      </Menu.Item>
      
    ))}
  </Menu.SubMenu>
              <Menu.Item key="payment" icon={<ShoppingCartOutlined />}>
            Payment
          </Menu.Item>
          
        </Menu>
      </Sider>
    </ConfigProvider>
  );
};

export default SideComponents;
