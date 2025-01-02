import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin, Descriptions, DatePicker , Flex , Avatar  , Tag, Image} from 'antd';
import { updateUser, getUserById, createQR, createLog } from '../../service/user.service';
import { useRive, useStateMachineInput, Layout, Alignment } from 'rive-react';
import animationFile from '../../../public/animations/nice.riv';
import '../../assets/css/user.css';
import verified from '../../assets/image/verified.png'
import avatar from '../../assets/image/tooc.jpg';
import { useLocation , useNavigate } from 'react-router-dom';
import { notifySuccessCustom } from '../../helper/notification';

const UserPage = (riveProps = {}) => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSpin , setIsSpin] = useState(false);
  const [isQR, setIsQR] = useState(false);
   
  const url = useLocation()

  const sessionData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const userId = sessionData?._id;
  //rive
  const stateMachineName = 'State Machine 1';
  const { rive: riveInstance, RiveComponent } = useRive({
    src: animationFile,
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        message.error('No user ID found. Please log in again.');
        setLoading(false);
        return;
      }
      try {
        const data = await getUserById(userId);
        const res = data.Result;
        setUserData(res);
        form.setFieldsValue({
          fullname: res.fullname,
          email: res.email,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        message.error('Failed to fetch user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, form]);

  const handleUpdate = async (values) => {
    try {
      await updateUser(userId, {...values, passwordToken : sessionData.password});
      message.success('User information updated successfully');
      setIsEditing(false);
      setUserData({ ...userData, ...values });
   
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      message.error('Failed to update user information');
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if(url.search) {
      setIsSpin(true);
      sendPaymenttoBackEnd();
      setIsSpin(false);
      notifySuccessCustom('Success', 'Thanks for Payments');
      setTimeout(() => {
        navigate('/user')
        window.location.reload();
      },2000)
    }
  }, [isQR]);
  const sendPaymenttoBackEnd = async () => {
      const params = new URLSearchParams(url.search);
      if(params.get('cancel') == "false")
        {
  const body = {
        accountId : userId,
        billCode : params.get('code'),
        id : params.get("id"),
        orderCode : params.get("orderCode")
      }
      await createLog(body);
 }
      
  }

  const handleCreateQR = async () => {
    setIsSpin(true);
    const res = await createQR(userId)
    window.open(res.data.result, '_blank')
    setIsSpin(false);
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return <div>No user data found. Please log in again.</div>;
  }

  return (
    <div style={{   }}>
      <RiveComponent
        style={{
          width: '400px',
          height: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '-200px',
          marginBottom: '-70px',
        }}
      />
      <Flex justify="space-between" align="center" className={isEditing ? 'edit-flex' : ''}>
      {!isEditing ?     <Card  justify="space-between" align="center" style={{ padding : 0 , minHeight : 500  }}>
             
                      
             <Avatar size={200}
             src={avatar} >
         </Avatar>
        <Card style={{ border : 0  }} className="card-profile">   
           <Descriptions column={1} size="middle">
             <Descriptions.Item className='text'  >
     <span style={{fontSize: 20}}>
      {userData.email}
      {''}
      {userData.verify ? <Image preview={false} height={30} src={verified}/> : ""}

     </span>
              
             </Descriptions.Item>
             <Descriptions.Item  >
        
               {userData?.fullname}
          
             </Descriptions.Item>
             <Descriptions.Item  >
               <Tag>
               {userData?.categoryId?.name}
                <Spin spinning={isSpin} percent={0} fullscreen />
               </Tag>
               
             </Descriptions.Item>
             <Descriptions.Item  >
              {userData?.verify ? <Button   type="primary" onClick={handleCreateQR}>
      Donate
               </Button> :<Button   type="primary" onClick={handleCreateQR}>
           Verify Account?
               </Button> }
              

               
               
             </Descriptions.Item>
             </Descriptions>
         </Card>
   
</Card> : "" }
    
         <Card
        title={<span  style={{ color: 'green' , display : "flex" , justifyContent:"center" }}>User Information</span>}
        style={{
          minHeight : 550,
          minWidth : 700,
        
        }}
        className={isEditing ? 'edit-card' : ''}
      >
        {!isEditing ? (
          <>
            <div style={{ marginBottom: '20px'  }}>
              <Descriptions bordered size='large' column={1}>
             
                <Descriptions.Item
                  label={<span style={{ color: 'green' }}>Date of birth</span>}
                >
                  {userData?.dob
                    ? new Date(userData.dob).toLocaleDateString()
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span style={{ color: 'green' }}>Phone</span>}
                >
                  {userData?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span style={{ color: 'green' }}>Address</span>}
                >
                  {userData?.address || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span style={{ color: 'green' }}>Create At</span>}
                >
                  {new Date(userData?.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              style={{ backgroundColor: 'green' }}
            >
              Edit Information
            </Button>
     
          </>
        ) : (
          <Flex justify="center" align="center">

          <Form
            form={form}
            onFinish={handleUpdate}
            initialValues={{
              fullname: userData.fullname,
              email: userData.email,
              // dob : Date(userData.dob).toLocaleString(),
              phone: userData.phone,
              address: userData.address,
            }}
          >
            <Form.Item
              name="fullname"
              label={<span style={{ color: 'green' }}>Username</span>}
              rules={[{ required: true, message: 'Full Name is required' }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
            <Form.Item
              name="dob"
              label={<span style={{ color: 'green' }}>Date of birth</span>}
              rules={[{ required: true, message: 'Date of birth is required' }]}
            >
                <DatePicker/>
            </Form.Item>
            <Form.Item
              name="phone"
              label={<span style={{ color: 'green' }}>Phone</span>}
              rules={[{ required: true, message: 'Phone is required' }]}
            >
              <Input placeholder="Enter your Phone" />
            </Form.Item>
            <Form.Item
              name="address"
              label={<span style={{ color: 'green' }}>Address</span>}
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Input placeholder="Enter your Address" />
            </Form.Item>
            <Form.Item
              name="password"
              label={<span style={{ color: 'green' }}>Confirm Password</span>}
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter Confirm Password"
                type="text"
              />
            </Form.Item>

            <Flex justify='center' style={{marginTop : 100}} >

            <Button
              className="no-btn"
              style={{ marginRight : 20 }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'green' }}
            >
              Save Changes
            </Button>
            </Flex>
          </Form>
          </Flex>
        )}
      </Card>
      </Flex>
     
    </div>
  );
};

export default UserPage;
