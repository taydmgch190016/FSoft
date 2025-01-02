import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, List, Space, Button, Avatar, Drawer , Timeline } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import socketIOClient from 'socket.io-client';
import VirtualList from 'rc-virtual-list';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import '../../assets/css/message.css';
import { showLoginModal, showMessageM } from '../../helper/zustand';
import { notifyFailCustom } from '../../helper/notification';

const Message = () => {
  const [listMessage, setListMessage] = useState([]);
  const [isRead , setRead] = useState(false);
  const socketRef = useRef();
  const lastRef = useRef();
  const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userD = JSON.parse(sessionStorage.getItem('userData'));
  const isOpen = showMessageM((state) => state.isOpen);
  const openModal = showLoginModal((state) => state.showModal);
  const [scroll , setScroll] = useState(false);
  const setCloseMessage = showMessageM((state) => state.closeMessage);
  const [form] = Form.useForm();
  useEffect(() => {
    if (isOpen) {
      socketRef.current = socketIOClient(import.meta.env.VITE_BASE_URL , {
        path: '/api/socket',
        transports: ['websocket'],
      });

      socketRef.current.emit('getListMessage');
      socketRef.current.on('ListMessage', (dataGot) => {
        setListMessage(dataGot);
      });
      socketRef.current.on('messageSent', (dataGot) => {
        setListMessage((oldMSG) => [...oldMSG, dataGot.result]);
      });
     
      return () => {
        socketRef.current.disconnect();
        setRead(true);
      };
    }
  }, [isOpen]);

  const handleCommentSubmit = async (values) => {
    if(userD)
    {
       const data = {
      fullname: user.fullname,
      email: user.email,
      message: values.message,
    };
    socketRef.current.emit('createMessage', data);
    // socketRef.current.emit('getListMessage');
    form.resetFields();
    setScroll(!scroll);
    }
    else { 
      openModal(true);
      notifyFailCustom('LOGIN FIRST', 'Please Login your Account');
    }

  };

  const virtualListRef = useRef(null);

  useEffect(() => {
    if (virtualListRef.current) {
       virtualListRef.current.scrollTo(lastRef.current?.lastChild?.offsetTop);
    }
  }, [listMessage || scroll]); 

 

  return (

      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={setCloseMessage}
        open={isOpen}
       
      >
        <List itemLayout="vertical" size="large" >
          <VirtualList
            data={listMessage}
            height={700}
            itemHeight={40}
            className="scrollable-container"
            ref={virtualListRef}
          >
            {(item) => (
              <span>
                { isRead ? "" :  <div>
                  <Timeline>
                      <Timeline.Item  label={`${formatDistanceToNow(new Date(item.createdAt), {
                      locale: vi,
                      addSuffix: true,
                    })}`}/>
                  </Timeline>
                  {/* <Divider> {item.createdAt} </Divider> */}
                  </div> 
                }
    
              <List.Item
                key={item.id}
                className={`message-card ${
                  item.fullname == user.fullname ? 'right' : 'left'
                }`}
                ref={lastRef}
              >
                <List.Item.Meta
                  avatar={
                    item.fullname == user.fullname ? (
                      ''
                    ) : (
                      <Avatar
                        className="message-avatar"
                        icon={<UserOutlined />}
                        
                      />
                    )
                  }
                  title={
                    <div className="message-title">
                      {item.email == user.email ? 'Me' : item.email}
                    </div>
                  }
                  description={
                    <div
                      className={`message-content ${
                        item.fullname == user.fullname ? 'mine' : 'other'
                      }`}
                    >
                      {item.message}
                    </div>
                  }
                />
              </List.Item>
              </span>
          
            )}
          </VirtualList>
          <Form form={form} onFinish={handleCommentSubmit}>
            <Space.Compact
              style={{
                width: '100%',
                padding: 24,
              }}
            >
              <Form.Item
                style={{
                  width: '100%',
                }}
                name="message"
              >
                <Input
                  placeholder="Leave a message"
                  allowClear
                  
                />
              </Form.Item>
              <Button size="large" type="primary" htmlType="submit">
                <SendOutlined />
              </Button>
            </Space.Compact>
          </Form>
        </List>
      </Drawer>
 
  );
};

export default Message;
