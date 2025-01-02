import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getArticleById,
  getArticleByCategory,
  updateArticle,
  getCommentsByArticleId,
  createComments,
} from '../../service/article.service';
import VirtualList from 'rc-virtual-list';
import {
  Button,
  Flex,
  Splitter,
  Card,
  Divider,
  message,
  Skeleton,
  List,
  Input,
  Form,
  Space,
  Avatar,
  Tree,
} from 'antd';
import {
  HeartFilled,
  ShareAltOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { extractImageFromContent } from '../../helper/extractImage';
import { notifySuccessCustom } from '../../helper/notification';
import { option } from '../../helper/localTime';
import { EditorComposer, Editor } from 'verbum';
import '../../assets/css/comment.css';
import { showLoginModal } from '../../helper/zustand';

const { Meta } = Card;

function DetailArticle() {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState([]);
  const [dataByCategory, setDataByCategory] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [commentStatus, setCommentStatus] = useState('normal');
  const [commentId, setCommentId] = useState(null);
  const [isExpand, setIsExpand] = useState(false);
  const [isUser , setIsUser] = useState(false)
  const { id } = useParams();
  const [sizes, setSizes] = useState(['70%', '30%']);
  const nav = useNavigate();
  const showModal = showLoginModal((state) => state.showModal);
  const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
  
  const [form] = Form.useForm();
  useEffect(() => {
    getArticleById(id).then((res) => {
      const currentArticle = res.data;
      setArticle([currentArticle]);

      const currentArticleId = currentArticle._id;
      const currentCategoryId = currentArticle.categoryId?._id;
      getArticleByCategory(currentCategoryId).then((categoryRes) => {
        const articles = categoryRes.data.response;

        const filteredData = articles.filter(
          (article) => article._id !== currentArticleId
        );
        setDataByCategory(filteredData);
      });
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    getArticleById(id).then((res) => {
      const currentArticle = res.data;
      setArticle([currentArticle]);
    });
  }, [isLike || id]);

  useEffect(() => {
    getCommentFromBE();
  }, [isUpdate || id || commentStatus]);

  const handleClickArticle = (article) => {
    nav('/article/' + article._id);
  };
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('userData'))
    if(user){
      setIsUser(true)
    }
  },[isUser])


  const handleClickShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Đã copy link bài viết vào clipboard');
  };

  const getCommentFromBE = async () => {
    const res = await getCommentsByArticleId(id);
    setCommentList(res.data);
  };

  const handleClickLike = async () => {
    if(isUser == true) {
       if (article[0].likedAccountId.includes(user._id)) {
      await updateArticle(article[0]._id, {
        ...article[0],
        likedAccountId: article[0].likedAccountId.filter(
          (id) => id !== user._id
        ),
      });
      setIsLike(!isLike);
    } else {
      await updateArticle(article[0]._id, {
        ...article[0],
        likedAccountId: [...article[0].likedAccountId, user._id],
      });
      setIsLike(!isLike);
    }
    }
    else{
      showModal()
      notifySuccessCustom('LOGIN FIRST', 'Please Login your Account');
    }
  };

  const handleCommentSubmit = async (values) => {
    if(isUser == true)
    {
      if (commentStatus == 'normal') {
      await createComments(id, {
        commentStatus: 'normal',
        comment: {
          id: Date.now(),
          email: user.email,
          fullname: user.fullname,
          comment: values.comment,
          children: [],
        },
      });
      setIsUpdate(!isUpdate);
      notifySuccessCustom('Success', 'Create comment successfully');
      form.resetFields();
    }
    if (commentStatus == 'reply') {
      await createComments(id, {
        commentStatus: 'reply',
        commentParentId: commentId,
        comment: {
          email: user.email,
          fullname: user.fullname,
          comment: values.comment,
        },
      });
      notifySuccessCustom('Success', 'Create comment successfully');
      form.resetFields();
      setCommentStatus('normal');
    }
    }
    else {
      showModal()
      notifySuccessCustom('LOGIN FIRST', 'Please Login your Account');
    }
    
  };
  const handleClickComment = (item) => {
 
         form.setFieldsValue({ comment: `@${item.fullname} | ` });
    setCommentId(item.id);
    setCommentStatus('reply');
  
  };

  const handleReplyComment = (item) => {
 
       form.setFieldsValue({ comment: `@${item.fullname} | ` });
    setCommentStatus('reply');
 
    
  };
  return (
    <Flex vertical gap="middle">
      {isLoading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : (
        <Splitter onResize={setSizes}>
          <Splitter.Panel
            size={sizes[0]}
            resizable={false}
            style={{ padding: '10px' }}
          >
            {article.map((item, index) => (
              <div>
                <Card
                  key={index}
                  style={{ margin: '0px 0 10px 0' }}
                  title={item.categoryId?.name}
                  extra={
                    <div>
                      {item.accountId?.fullname +
                        ' • ' +
                        new Date(item.createdAt).toLocaleDateString(
                          'vi-VN',
                          option
                        )}
                    </div>
                  }
                  actions={[
                    <div onClick={handleClickLike}>
                      <HeartFilled
                        style={{
                          color: item.likedAccountId.includes(user._id)
                            ? 'red'
                            : '',
                        }}
                      />{' '}
                      {item.likedAccountId.length}
                    </div>,
                    <div onClick={handleClickShare}>
                      <ShareAltOutlined />
                    </div>,
                  ]}
                >
                  <Meta
                    title={
                      <h1 style={{ whiteSpace: 'normal' }}>{item.title}</h1>
                    }
                    description={
                      <>
                        <div>{item.description}</div>
                        <EditorComposer
                          initialEditorState={item.content}
                          key={item.content}
                        >
                          <Editor
                            hashtagsEnabled={true}
                            emojisEnabled={true}
                            isEditable={false}
                          ></Editor>
                        </EditorComposer>
                      </>
                    }
                  />
                </Card>
                <Card title="Comment" className="comment">
                  <List itemLayout="vertical" size="large" >
                    <VirtualList
                      data={commentList}
                      height={600}
                      itemHeight={60}
                  className='scrollable-container'
                    >
                      {(item) => (
                        <List.Item key={item.id}>
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={item.email}
                            description={item.fullname}
                            onClick={() => handleClickComment(item)}
                          />
                          <div style={{ marginBottom: '10px', fontSize: '16px' }}>{item.comment}</div>
                          {item.children.length > 0 && (
                            <div onClick={() => handleClickComment(item)}>
                              {' '}
                              {isExpand == item.id ? (
                                <Tree
                                  showIcon
                                  treeData={item.children}
                                  titleRender={(item) => (
                                    <div
                                      onClick={() => handleReplyComment(item)}
                                      style={{ marginBottom: '10px' }}
                                    >
                                      <Avatar icon={<UserOutlined />} />{' '}
                                      <span style={{ fontWeight: 'bold' }}>
                                        {item.fullname} :
                                      </span>
                                      {item.comment}
                                    </div>
                                  )}
                                ></Tree>
                              ) : (
                                <a onClick={() => setIsExpand(item.id)}>
                                  {' '}
                                  Reply ({item.children.length}){' '}
                                </a>
                              )}{' '}
                            </div>
                          )}
                        </List.Item>
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
                          name="comment"
                        >
                          <Input
                            addonBefore={commentId}
                            placeholder="Leave a comment"
                            allowClear
                            onClear={() => {
                              setCommentId(null);
                              setCommentStatus('normal');
                            }}
                          />
                        </Form.Item>
                        <Button size="large" type="primary" htmlType="submit">
                          <SendOutlined />
                        </Button>
                      </Space.Compact>
                    </Form>
                  </List>
                </Card>
              </div>
            ))}
          </Splitter.Panel>

          <Splitter.Panel
            size={sizes[1]}
            resizable={false}
            style={{ padding: '10px' }}
          >
            <Divider style={{ borderColor: '#008000' }}>
              {article.map((item, index) => (
                <>Liên quan đến {item.categoryId?.name}</>
              ))}
            </Divider>
            {dataByCategory.slice(-3).map((item, index) => (
              <Card
                onClick={() => {
                  handleClickArticle(item);
                }}
                key={index}
                hoverable
                style={{ margin: '0px 0 10px 0' }}
                cover={
                  <img
                    alt={item.title}
                    src={extractImageFromContent(item.content)}
                    style={{ width: '100%' }}
                  />
                }
              >
                <Meta title={item.title} description={item.description} />
              </Card>
            ))}
          </Splitter.Panel>
        </Splitter>
      )}
    </Flex>
  );
}
export default DetailArticle;
