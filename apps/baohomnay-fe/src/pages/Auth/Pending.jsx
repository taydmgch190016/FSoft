import React, { useState, useEffect, useRef } from 'react';
import {notification, Spin} from 'antd';
import '../../assets/css/login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {sendCallBack} from '../../service/account.service';
import { notifyFailCustom, notifySuccessCustom } from '../../helper/notification';
const Pending = () => {

  const [spinning, setSpinning] = useState(true);
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();
  const url = useLocation()
  useEffect(() => {
    SendCallBack()
  },[])

  const SendCallBack = async () => {
    const response = await sendCallBack(url.search)
    if(response.data.userData){
      sessionStorage.setItem('accessToken', response.data.accessToken);
      sessionStorage.setItem(
        'userData',
        JSON.stringify(response.data.userData)
      );
      setSpinning(false)
      notifySuccessCustom('Success', 'Return to menu Login on 5 seconds');
      setTimeout(() => {
        navigate('/')
      } , 3000)
    }
    else{
      setSpinning(false)
      notifyFailCustom('Failed', 'Please Try Again!!!');
      setTimeout(() => {
        navigate('/')
      } , 1000)
    }
  }
  return (
   <div>
    <Spin spinning={spinning} percent={percent} fullscreen />
  </div>
  );
};

export default Pending;
