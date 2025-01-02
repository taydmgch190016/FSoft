import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Popconfirm,
  notification,
} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../service/category.service';
import { toast } from 'react-toastify';

const NoPaddingButton = styled(Button)`padding: 5px !important;`;
const Category = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    getCategory().then((res) => {
      setCategories(res);
    });
  }, [categories]);
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      align: 'right',
      render: (_, category) => (
        <div className="actions-cell" style={{ textAlign: 'right' }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <NoPaddingButton
              type="primary"
              onClick={() => handleEditButtonClick(category)}
            >
              Edit
            </NoPaddingButton>
            <Popconfirm
              title="Delete this category ?"
              onConfirm={() => handleDeleteCategory(category._id)}
              onCancel={notifyCancel}
              descriptions="Are you sure to delete this category?"
              okText="Yes"
              cancelText="No"
            >
              <NoPaddingButton type="primary" danger>
                Delete
              </NoPaddingButton>
            </Popconfirm>
          </Flex>
        </div>
      ),
    },
  ];
  const handleAddCategory = async (values) => {
    setLoading(true);

    try {
      const { response, err } = await addCategory(values);
      if (response) {
        toast.success('Category added successfully!');
      }

      if (err) {
        toast.error('Error adding category!');
      } else {
        setCategories([...categories, response]);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
    notifyOk();
  };
  const notifyOk = () => {
    notification.open({
      message: 'Delete category successfully',
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
  const notifyCancel = () => {
    notification.open({
      message: 'Delete cancelled!',
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
  const handleEditButtonClick = (category) => {
    form.setFieldsValue(category);
    setModalVisible(true);
  };
  const handleUpdateCategory = async (categoryId, values) => {
    setLoading(true);

    try {
      const { response, err } = await updateCategory(categoryId, values);
      if (response) {
        toast.success('Category updated successfully!');
      }

      if (err) {
        toast.error('Error updating category!');
      } else {
        const updatedCategories = categories.map((category) =>
          category._id === categoryId ? { ...category, ...values } : category
        );
        setCategories(updatedCategories);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <div>
        <NoPaddingButton type="primary" onClick={() => setModalVisible(true)}>
          Add Category
        </NoPaddingButton>
      </div>
      <div>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            total: categories.length,
            onChange: (page, pageSize) => setCurrentPage(page),
          }}
          scroll={{ x: 800, y: 600 }}
        />
        <Modal
          visible={modalVisible}
          title="Category"
          onCancel={handleModalCancel}
          footer={[
            <NoPaddingButton
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    if (form.getFieldValue('_id')) {
                      handleUpdateCategory(form.getFieldValue('_id'), values);
                    } else {
                      handleAddCategory(values);
                    }
                  })
                  .catch((error) => {
                    toast.error('Please fill in all information!');
                  });
              }}
            >
              {form.getFieldValue('_id') ? 'Save' : 'Add'}
            </NoPaddingButton>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="_id" hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter the category name' },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Category;
