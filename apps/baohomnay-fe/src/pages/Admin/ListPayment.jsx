import React from 'react';
import {
  Flex,

  Tag,

  Form,

  Input,
  notification,
} from 'antd';
import { Table, Typography } from 'antd';

import { useEffect, useState } from 'react';
import '../../assets/css/admin.css';
import { findAllPayment } from '../../service/user.service';
import { getCategory } from '../../service/category.service';




const { Column } = Table;
const { Text } = Typography;
const ListPayment = () => {
  const [listTable, setListTable] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [api, contextNoti] = notification.useNotification();

  const getDatafromBE = async () => {
    const res = await findAllPayment();
 
    setListTable(res.result);
 
  };



  useEffect(() => {
    getDatafromBE();
  }, [isUpdate]);




 


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
            {(value, record) =>String(record.id).toLowerCase().includes(value.toLowerCase()) 
            ||String(record.accountId?.email).toLowerCase().includes(value.toLowerCase()) 
            ||String(record.accountId?.fullname).toLowerCase().includes(value.toLowerCase()) } title="ID" style={{ borderRight: '2px solid #02509a' }}dataIndex="id" key="email" />
            <Column
              title="Order Code"
              dataIndex="orderCode"
              key="role"
              render={(role) => (
                <Tag
                  className="tag"
                  style={{
                    backgroundColor:
                    '#034fa0',
                    color: 'white',
                  }}
                >
                  {role}
                </Tag>
              )}
            />
            <Column
              title="Full Name"
              dataIndex={['accountId', 'fullname']}
              key="fullname"
              render={(fullname) => (
                <div style={{ textTransform: 'capitalize' }}>{fullname}</div>
              )}
            />
            <Column
              title="Email Account"
              dataIndex={['accountId', 'email']}
              key="fullname"
              render={(role) => (
                <Tag
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                  }}
              
                >
                  {role}
                </Tag>
              )}
            />
          </Table>

      <Flex gap="middle" justify="space-between"></Flex>
    </Flex>
  );
};

export default ListPayment;
