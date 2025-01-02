import React from 'react';
import { Layout as AntLayout, FloatButton } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import FooterComponent from './Footer';
import HeaderComponent from './Header';
import Login from '../pages/Auth/Login';
import {MessageTwoTone} from '@ant-design/icons';
import { showMessageM } from '../helper/zustand';
import Message from '../pages/Homepage/Message';

const { Content } = AntLayout;

const Layout = () => {
  const nav = useNavigate();
  const OnClick = ({ key }) => {
    return nav(key);
  };
  const setShowMessage = showMessageM((state) => state.showMessage);
  const dotStatus = showMessageM((state) => state.dotStatus);
  const setDot = showMessageM((state) => state.setDot);
  const handleClick = () => {
    setShowMessage();
    setDot();
  }
  return (
    <AntLayout>
      <HeaderComponent OnClick={OnClick} />

      <Login />

      <Content style={{ width: '70%', margin:'20px auto 20px auto'}}>
        <FloatButton badge={{ dot: dotStatus}} shape="circle" onClick ={handleClick}type="primary" size="large" icon={<MessageTwoTone />}/>
        <Message/>
        <Outlet />
      </Content>
      <FooterComponent />
    </AntLayout>
  );
};

export default Layout;
