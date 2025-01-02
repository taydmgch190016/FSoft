import React, { useState, useEffect, useRef } from 'react';
import {
  LockOutlined,
  UserOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GoogleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { notifySuccessCustom } from '../../helper/notification';
import { Button, Checkbox, Form, Input, Modal, message , Spin} from 'antd';
import '../../assets/css/login.css';
import { showLoginModal, isLogin } from '../../helper/zustand';
import animationFile from '../../../public/animations/teste_para_login.riv';
import { useRive, useStateMachineInput, Layout, Alignment } from 'rive-react';
import { login, register , forgotPass , resetPass  } from '../../service/account.service';
import { useNavigate, useParams } from 'react-router-dom';



const Login = (riveProps = {}) => {
  const open = showLoginModal((state) => state.isShow);
  const showModal = showLoginModal((state) => state.showModal);
  const closeModal = showLoginModal((state) => state.closeModal);
  var {token} = useParams();
  const setIsLoginState = isLogin((state) => state.setIsLogin);
  const isLoginState = isLogin((state) => state.isLogin);
  const [isForgot, setIsForgot] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [percent, setPercent] = useState(0);
  const stateMachineName = 'State Machine 1';
  const navigate = useNavigate();
  const { rive: riveInstance, RiveComponent } = useRive({
    src: animationFile,
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });

  const [userValue, setUserValue] = useState('');
  const inputRef = useRef(null);
 
  const isCheckingInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    'Check'
  );
  const numLookInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    'Look'
  );
  const trigSuccessInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    'success'
  );
  const trigFailInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    'fail'
  );
  const isHandsUpInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    'hands_up'
  );

  const onUsernameChange = (e) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput.value) {
      isCheckingInput.value = true;
    }
    const numChars = newVal.length;
    numLookInput.value = numChars * 3;
  };

  const onUsernameFocus = () => {
    isCheckingInput.value = true;
    if (numLookInput.value !== userValue.length * 3) {
      numLookInput.value = userValue.length * 3;
    }
  };

  const onPasswordFocus = () => {
    isHandsUpInput.value = true;
  };

  const onFinishLogin = async (values) => {
    try {
      setSpinning(true)
      const response = await login(values.username, values.password);
      sessionStorage.setItem('accessToken', response.data.accessToken);
      sessionStorage.setItem(
        'userData',
        JSON.stringify(response.data.userData)
      );
      const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
      setSpinning(false)
      message.success('Login Successful!', user.fullname);
      window.location.reload();
    } catch {
      //   trigFailInput.value = true;
      setSpinning(false)
      message.error('Login failed. Wrong Email or Password');
    }
  };
  const onFinishRegister = async (values) => {
    try {
      setSpinning(true)
      await register(values);
      setSpinning(false)
      setIsLoginState(true);
      notifySuccessCustom('Success', 'New Account Has Been Created');
    } catch {
      setSpinning(false)
      message.error('Register failed');
    }
  };

  const onFinishForgot = async (values) => {
    try {
      setSpinning(true)
      await forgotPass(values);
      setIsForgot(false);
      setIsVerify(false);
      setIsLoginState(true);
      setSpinning(false)
      notifySuccessCustom('Done', 'Check your email to reset password , the link available in 10 minutes!');
    } catch(error) {
      setSpinning(false)
      message.error('Not Found Email');
    }
  };

  const onFinishVerify = async (values) => {
    try {
      setSpinning(true)
      await resetPass(token,values);
      closeModal()
      setSpinning(false)
      notifySuccessCustom('Success', 'Return to menu Login on 5 seconds');
      setIsForgot(false);
      setIsVerify(false);
      setIsLoginState(true);
      token=''
      setTimeout(() => {
        navigate('/')
      } , 3000)
 
    } catch(error) {
      message.error('Invalid or expired password reset token');
      setIsForgot(false);
      setIsVerify(false);
      setIsLoginState(true);
      token=''
      setTimeout(() => {
        navigate('/')
      } , 3000)
    }
  };

  useEffect(() => {
    if(token){
      showModal()
      setIsForgot(true)
      setIsVerify(true)
    }
  },[token])
  const handlecloseModal = () => {
    closeModal()
    setIsForgot(false);
    setIsVerify(false);
    setIsLoginState(true);
  }

  const handleLoginGoogle = () => {
   window.open(`${import.meta.env.VITE_BASE_URL}/api/auth/google`);
  }
  return (
   <div>
    <Spin spinning={spinning} percent={percent} fullscreen />
    <Modal open={open} onCancel={handlecloseModal} footer={null}>
      <RiveComponent
        style={{
          width: '200px',
          height: '200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      {isForgot ? (
        <div>
          {isVerify ? (   //verify password
            <Form
              className="login-form"
              style={{
                maxWidth: 360,
                margin: '0 auto',
              }}
              onFinish={onFinishVerify}
            >
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  onFocus={onPasswordFocus}
                  onBlur={() => (isHandsUpInput.value = false)}
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Confirm Password"
                  onFocus={onPasswordFocus}
                  onBlur={() => (isHandsUpInput.value = false)}
                />
              </Form.Item>

              <Form.Item>
                <Button block htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ) : ( 
            //forgot password
            <Form
              className="login-form"
              style={{
                maxWidth: 360,
                margin: '0 auto',
              }}
              onFinish={onFinishForgot}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Email!',
                    type: 'email',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  onFocus={onUsernameFocus}
                  value={userValue}
                  onChange={onUsernameChange}
                  onBlur={() => (isCheckingInput.value = false)}
                />
              </Form.Item>

              <Form.Item>
                <Button block htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      ) : (
        <div>
          {' '}
          {isLoginState ? (
            <Form
              name="login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              style={{
                maxWidth: 360,
                margin: '0 auto',
              }}
              onFinish={onFinishLogin}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Username!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  onFocus={onUsernameFocus}
                  value={userValue}
                  onChange={onUsernameChange}
                  onBlur={() => (isCheckingInput.value = false)}
                  ref={inputRef}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  onFocus={onPasswordFocus}
                  onBlur={() => (isHandsUpInput.value = false)}
                />
              </Form.Item>

              <Form.Item>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a onClick={() => setIsForgot(true)}>Forgot password?</a>
                </div>
              </Form.Item>

              <Form.Item>
                <Button block htmlType="submit">
                  Log in
                </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  or{' '}
                  <a href="#" onClick={() => setIsLoginState(false)}>
                    Register now!
                  </a>
                </div>
              </Form.Item>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                }}
              >
                <FacebookOutlined
                  style={{ fontSize: '24px', color: '#4267B2' }}
                />
                <YoutubeOutlined
                  style={{ fontSize: '24px', color: '#FF0000' }}
                />
                <TwitterOutlined
                  style={{ fontSize: '24px', color: '#1DA1F2' }}
                />
                <InstagramOutlined
                  style={{ fontSize: '24px', color: '#C13584' }}
                />
                <GoogleOutlined
                  style={{ fontSize: '24px', color: '#4285F4' }}
                  onClick={() =>handleLoginGoogle()}
                />
              </div>
            </Form>
          ) : (
            <Form
              name="register"
              className="register-form"
              style={{
                maxWidth: 360,
                margin: '0 auto',
              }}
              onFinish={onFinishRegister}
            >
              <Form.Item
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Fullname!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Fullname"
                  onFocus={onUsernameFocus}
                  value={userValue}
                  onChange={onUsernameChange}
                  onBlur={() => (isCheckingInput.value = false)}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Email!',
                    type: 'email',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  onFocus={onUsernameFocus}
                  value={userValue}
                  onChange={onUsernameChange}
                  onBlur={() => (isCheckingInput.value = false)}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  onFocus={onPasswordFocus}
                  onBlur={() => (isHandsUpInput.value = false)}
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Confirm Password"
                  onFocus={onPasswordFocus}
                  onBlur={() => (isHandsUpInput.value = false)}
                />
              </Form.Item>

              <Form.Item>
                <Button className="ant-btn" block htmlType="submit">
                  Register
                </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  or{' '}
                  <a href="#" onClick={() => setIsLoginState(true)}>
                    Log in now!
                  </a>
                </div>
              </Form.Item>
            </Form>
          )}
        </div>
      )}
    </Modal></div>
  );
};

export default Login;
