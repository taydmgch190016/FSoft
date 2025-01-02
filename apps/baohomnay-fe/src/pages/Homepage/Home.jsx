import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Tag,
  Card,
  Divider,
  Skeleton,
  Pagination,
  Result,
  Timeline,
  Row,
  Col,
} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { getArticle, getTags } from '../../service/article.service';
import { extractImageFromContent } from '../../helper/extractImage';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { colorTags } from '../../helper/colorTags';

const { Meta } = Card;

const Home = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [newestByCategory, setNewestByCategory] = useState([]);
  const nav = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedArticles = articles.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    getTags().then((res) => {
      setTags(res.data.tags);
    });
  }, []);

  useEffect(() => {
    getArticle().then((res) => {
      const data = Array.isArray(res.data) ? res.data : [res.data];
      const newestArticles = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const categoryGroups = data.reduce((acc, article) => {
        const categoryId = article.categoryId?._id;
        if (
          !acc[categoryId] ||
          new Date(acc[categoryId].createdAt) < new Date(article.createdAt)
        ) {
          acc[categoryId] = article;
        }
        return acc;
      }, {});

      const newestCategoryArticles = Object.values(categoryGroups);

      setNewestByCategory(newestCategoryArticles);
      setArticles(newestArticles);
      setIsLoading(false);
    });
  }, []);

  const handleClickArticle = (article) => {
    nav('/article/' + article._id);
  };

  const handleClickTag = (tag) => {
    nav('/tag/' + tag);
  };

  return (
    <Flex gap="middle" vertical>
      {isLoading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : (
        <div>
          <Flex gap="4px 0" wrap justify="left" style={{marginTop:'10px'}}>
            {tags?.map((tag, index) => (
              <Tag
                key={index}
                color={colorTags[index % 10]}
                onClick={() => handleClickTag(tag)}
              >
                <a>{tag}</a>
              </Tag>
            ))}
          </Flex>
          {displayedArticles.length > 0 ? (
            <Row>
              <Divider style={{ borderColor: '#008000' }} orientation="center">
                Tin tức mới nhất
              </Divider>
              <Col span={18} pull={6}>
                <Timeline mode="left">
                  {displayedArticles.map((item, index) => (
                    <Timeline.Item
                      key={index}
                      color="#008000"
                      label={`${formatDistanceToNow(new Date(item.createdAt), {
                        locale: vi,
                        addSuffix: true,
                      })}`}
                      children={
                        <Card
                          style={{ width: '150%' }}
                          onClick={() => {
                            handleClickArticle(item);
                          }}
                          hoverable
                          cover={
                            <img
                              alt={item.title}
                              src={extractImageFromContent(item.content)}
                            />
                          }
                        >
                          <Meta
                            title={item.title}
                            description={item.description}
                          />
                        </Card>
                      }
                    ></Timeline.Item>
                  ))}
                </Timeline>
                <Pagination
                  style={{ marginLeft: '600px' }}
                  align="center"
                  defaultCurrent={1}
                  total={articles.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(page) => {
                    setCurrentPage(page);
                  }}
                />
              </Col>

              <Col span={6}>
                {newestByCategory.map((item, index) => (
                  <>
                    <Divider style={{ borderColor: '#008000' }}>
                      {item.categoryId?.name}{' '}
                      <a
                        style={{ fontSize: '14px' }}
                        href={`/category/${item.categoryId?._id}`}
                      >
                        (xem thêm)
                      </a>
                    </Divider>
                    <Card
                      onClick={() => {
                        handleClickArticle(item);
                      }}
                      key={index}
                      hoverable
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
                  </>
                ))}
              </Col>
            </Row>
          ) : (
            <Result
              icon={<SmileOutlined />}
              title="Hôm nay hiện không có bài viết mới nào, hãy quay lại sau nhé !"
            />
          )}
        </div>
      )}
    </Flex>
  );
};

export default Home;
