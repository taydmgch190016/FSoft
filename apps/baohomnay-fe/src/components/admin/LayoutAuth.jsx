import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import SideComponents from './SideComponents'
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderComponent from '../admin/Header';


const { Header, Content, Footer } = Layout;

const LayoutAuth = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const nav = useNavigate();
  const OnClick = ({ key }) => {
    return nav(key);
  };
  return (
    
    <Layout style={{ minHeight: '100vh'  }}>
        <SideComponents OnClick={OnClick}/>
      <Layout>
       <HeaderComponent/>
        <Content
          style={{
            margin: '24px 16px 0', }}>
          <div style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >

            <Outlet/>
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};
export default LayoutAuth;