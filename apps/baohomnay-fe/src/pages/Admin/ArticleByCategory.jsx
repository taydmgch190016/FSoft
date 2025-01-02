import React, { useEffect, useState } from 'react';
import { Table, Button, Flex ,Popconfirm , notification } from 'antd';
import {
  deleteArticle,
  getArticleByCatId
} from '../../service/article.service';
import { SmileOutlined } from '@ant-design/icons';
import { getCategoryById } from '../../service/category.service';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
const {Column} = Table;
const NoPaddingButton = styled(Button)`padding: 5px !important;`;
const ArticleByCategory = () => {


  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState();
  const { id } = useParams();
  
  const getArtByCat = async () => {
    const res = await getArticleByCatId(id);
    setArticles(res.response);
  };
  useEffect(() => {
    getArtByCat();
  },[id, articles ]);

  const getCatById = async () => {
    const res = await getCategoryById(id);
    setCategory(res.name)
  }
   useEffect(() => {
    getCatById();
   }, [id]);
  const handleDelete = async (id) =>{
    await deleteArticle(id);
    notifyOk();
  }
  const notifyOk = () =>{
    notification.open({
    message: 'Delete article successfully',
    icon:<SmileOutlined
    style={{
      color: '#108ee9',
    }}
  />,
    placement: "topLeft"
  });}
  const notifyCancel = () =>{notification.open({
    message: 'Delete cancelled!',
    icon:<SmileOutlined
    style={{
      color: '#108ee9',
    }}
  />,
    placement: "topLeft"
  });}
  
  return (
    <div style={{ padding: 24,
      minHeight: 360,}}>
      <h1 style={{textAlign: "center"}}>{category}</h1>
      <Table dataSource={articles}  bordered >
      <Column dataIndex="title" title ="Title" key="title"/>
      <Column dataIndex="description" title ="Description"key="description"/>
      <Column dataIndex="Actions" title ="Actions" key="actions" render={(_, article) => (
        <div className="actions-cell" style={{ textAlign: 'right' }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Popconfirm
            title="Delete this article ?"
            onConfirm={()=>handleDelete(article._id)}
            onCancel={notifyCancel}
            descriptions ="Are you sure to delete this Article?" 
            okText="Yes"
            cancelText="No">
            <NoPaddingButton
              type="primary"
              danger
            >
              Delete
            </NoPaddingButton>
            </Popconfirm>
           
          </Flex>
        </div>
      )}  />
      
      </Table>
    </div>
  );
};

export default ArticleByCategory;
