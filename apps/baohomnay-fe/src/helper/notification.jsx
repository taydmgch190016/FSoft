import { SmileOutlined, WarningOutlined , StopTwoTone } from '@ant-design/icons';
import { notification, Button, Flex } from 'antd';
import { deleteAcc } from '../service/account.service';
import { isDelete2 } from '../helper/zustand';
export const openNotification = (api, message, description) => {
  api.info({
    message: `${message}`,
    description: `${description}`,
    icon: (
      <SmileOutlined
        style={{
          color: '#108ee9',
        }}
      />
    ),
    placement: 'topLeft',
  });
};

export const notifySuccess = (id) => {
  notification.open({
    message: `Delete Successfully`,
    description: "The account was deleted successfully",
    icon: (
      <SmileOutlined
        style={{
          color: '#108ee9',
        }}
      />
    ),
    placement: 'topLeft',
  });
};
export const notifySuccessCustom = (message , description) => {
  notification.open({
    message: `${message}`,
    description: `${description}`,
    icon: (
      <SmileOutlined
        style={{
          color: '#108ee9',
        }}
      />
    ),
    placement: 'topLeft',
  });
};

export const notifyFailCustom = (message , description) => {
  notification.open({
    message: `${message}`,
    description: `${description}`,
    icon: (
      <StopTwoTone 
        twoToneColor={"red"}
      />
    ),
    placement: 'topLeft',
  });
};

