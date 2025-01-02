import React from 'react';
import {
  Flex,
  Splitter,
  Tag,
  Select,
  Form,
  Card,
  Button,
  Descriptions,
  Divider,
  Input,
  notification,
} from 'antd';
import { Table, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import '../../assets/css/admin.css';
import { listAcc, findAcc, updateAcc , deleteAcc } from '../../service/account.service';
import { getCategory } from '../../service/category.service';
import { RoleName } from '../../components/RoleProtected/RoleProtected';
import { openNotification , notifySuccess } from '../../helper/notification';



const { Column } = Table;
const { Text } = Typography;
const Account = () => {
  const [sizes, setSizes] = useState(['60%', '40%']);
  const [userDetails, setUserDetails] = useState();
  const [isEdit, setEdit] = useState(false);
  const [listTable, setListTable] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [listCategory, setCategories] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [form] = Form.useForm();
  const [api, contextNoti] = notification.useNotification();
  const [isDelete, setDeleteState] = useState(false);
  const getDatafromBE = async () => {
    const res = await listAcc();
    const response = await getCategory();

    setListTable(res.data.accounts);
    setCategories(response);
  };

  const roleList = Object.keys(RoleName).map((role) => {
    const value = RoleName[role];
    if (value) {
      return { name: role, value: value };
    }
    return null;
  });

  useEffect(() => {
    getDatafromBE();
  }, [isUpdate || isDelete]);

  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue({
        categoryId: userDetails.categoryId?._id,
        role: userDetails.role,
        _id: userDetails._id,
      });
    }
  }, [userDetails, form]);

  const handleClick = async (record) => {
    const res = await findAcc(record._id);
    setUserDetails(res.data.Result);
    setEdit(false);
  };

  const onFinish = async (values) => {
    try {
      await updateAcc(values._id, values);
      openNotification(api, 'Success', 'Update Account successfully');
      setEdit(false);
      setUpdate(!isUpdate);
    } catch {
      openNotification(api, 'Failed', 'Failed to Update Account');
    }
  };
 
  const handleDelete = async (id) => {
   deleteAcc(id)
   setDeleteState(!isDelete);
   notification.destroy();
   notifySuccess();
  }
  const notifyCancel =  (id) => {
    notification.open({
      message: (
        <Flex justify="space-between" align="center"  >
          <div
            style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px'  }}
          >
            {' '}
            Warning!!!
            <div style={{ fontSize: '13px', color: '#e74748' }}>
              You Are Deleting The Account...
              <Flex justify="space-between" style={{ marginTop: '16px' }}>
                <Button
                  onClick={() => notification.destroy()}
                  style={{ width: '48%' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(id)}
                  style={{
                    color: '#e74748',
                    border: '0.8px solid #e74748',
                    width: '48%',
                  }}
                >
                  Confirm
                </Button>
              </Flex>
            </div>
          </div>
        </Flex>
      ),
      icon: (
        <WarningOutlined
          style={{
            color: '#108ee9',
          }}
        />
      ),
    });
  };

  return (
    <Flex vertical gap="middle">
      {contextNoti}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    <Input.Search
      className="custom-search-input"
      style={{ maxWidth: '400px' , padding : "16px 20px"}} 
      onChange={(e) => setSearchText(e.target.value)}
    />
    </div>
      <Splitter
        onResize={false}
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Splitter.Panel size={sizes[0]} resizable={false}>
          <Table
            dataSource={listTable}
           bordered
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              fontSize: '16px',
            
            }}
            onRow={(record) => ({ onClick: () => handleClick(record) })}
            className='custom-table'
          >
            <Column filteredValue={[searchText]} onFilter=
            {(value, record) =>String(record.email).toLowerCase().includes(value.toLowerCase()) 
            ||String(record.role).toLowerCase().includes(value.toLowerCase()) 
            ||String(record.fullname).toLowerCase().includes(value.toLowerCase())
            ||String(record.categoryId?.name).toLowerCase().includes(value.toLowerCase()) } title="Email" style={{ borderRight: '2px solid #02509a' }}dataIndex="email" key="email" />
            <Column
              title="Role"
              dataIndex="role"
              key="role"
            
              render={(role) => (
                <Tag
                  className="tag"
                  style={{
                    backgroundColor:
                      role == 'admin'
                        ? '#ffaf52'
                        : role == 'staff'
                        ? '#26b15c'
                        : '#034fa0',
                    color: 'white',
                  }}
                >
                  {role}
                </Tag>
              )}
            />
            <Column
              title="Full Name"
              dataIndex="fullname"
              key="fullname"
              render={(fullname) => (
                <div style={{ textTransform: 'capitalize' }}>{fullname}</div>
              )}
            />
            <Column
              title="Category"
              dataIndex={['categoryId', 'name']}
              key="fullname"
              render={(role) => (
                <Tag
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                  }}
                  className="tag"
                >
                  {role}
                </Tag>
              )}
            />
          </Table>
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]}>
        <div style={{ textAlign: 'center', width: '100%' }}>
        <Typography.Title level={4}  style={{ color: '#02509a' , padding : 0  }} > USER INFO</Typography.Title>
    
          {userDetails ? (
            <Card>
              <Descriptions
                bordered
                column={1}
                style={{ gap: '16px' }}
              >
                <Descriptions.Item label="Full Name" className='label'>
                  {' '}
                  {userDetails.fullname}{' '}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  {' '}
                  <Tag className="tag" style={{ }}>{userDetails.role}</Tag>{' '}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {' '}
                  <Tag className="tag">
                    {' '}
                    {userDetails.categoryId?.name}{' '}
                  </Tag>{' '}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {' '}
                  {userDetails.email}{' '}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {' '}
                  {userDetails.phone || 'N/A'}{' '}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {' '}
                  {userDetails.address || 'N/A'}{' '}
                </Descriptions.Item>
              </Descriptions>
              <Divider className={isEdit ? 'divider' : 'divider'}>
                {isEdit ? 'UPDATE' : 'ACTION'}
              </Divider>
              {isEdit ? (
                <Form onFinish={onFinish} form={form}>
                  <Form.Item name="_id" hidden>
                    {' '}
                    <Input hidden />
                  </Form.Item>
                  <Flex
                    wrap
                    gap="large"
                    justify="space-between"
                    align="center"
                    style={{ width: '100%' }}
                  >
                    <Text strong>Category</Text>
                    <Form.Item name="categoryId" style={{ marginBottom: 0 }}>
                      <Select
                        style={{ width: 200 }}
                        options={listCategory.map((category) => ({
                          label: category.name,
                          value: category._id,
                        }))}
                        className='custom-select'
                      />
                    </Form.Item>
                  </Flex>

                  <Flex
                    wrap
                    gap="large"
                    justify="space-between"
                    align="center"
                    style={{
                      width: '100%',
                      marginTop: '32px',
                      marginBottom: '32px',
                    }}
                  >
                    <Text strong>Role</Text>
                    <Form.Item name="role" style={{ marginBottom: 0 }}>
                      <Select
                        style={{ width: 200 }}
                        options={roleList.map((role) => ({
                          label: role.name,
                          value: role.value,
                        }))}
                         className='custom-select'
                      />
                    </Form.Item>
                  </Flex>
                  <Flex>
                    <Button className="cancel" onClick={() => setEdit(!isEdit)}>
                      Cancel
                    </Button>
                    <Button className="submit" type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Flex>
                </Form>
              ) : (
                <Flex>
                   <Button
                  className="editing"
                  type="primary"
                  onClick={() => setEdit(!isEdit)}
                >
                  Edit
                </Button>
                <Button
                  className="danger"
                  type="primary"
                  danger
                  onClick={() => notifyCancel(userDetails._id)}
                >
                  Delete
                </Button>
                </Flex>
               
                
              )}
            </Card>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              {' '}
              Select a user to view details.{' '}
            </p>
          )}

</div>
        </Splitter.Panel>
      </Splitter>
      <Flex gap="middle" justify="space-between"></Flex>
    </Flex>
  );
};

export default Account;
