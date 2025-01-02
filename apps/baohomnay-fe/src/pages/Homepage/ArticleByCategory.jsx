import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Splitter,
  Card,
  Divider,
  Skeleton,
  Pagination,
  Result,
} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getArticleByCategoryId } from '../../service/category.service';
import { extractImageFromContent } from '../../helper/extractImage';
const { Meta } = Card;

const ArticleByCategory = () => {
  const [isloading, setIsLoading] = useState(true);
  const [newestArticles, setNewestArticles] = useState([]);
  const [olderArticles, setOlderArticles] = useState([]);
  const { id } = useParams();
  const nav = useNavigate();

  const [currentNewestPage, setCurrentNewestPage] = useState(1);
  const [currentOlderPage, setCurrentOlderPage] = useState(1);
  const [pageSize] = useState(10);
  const startNewestIndex = (currentNewestPage - 1) * pageSize;
  const startOlderIndex = (currentOlderPage - 1) * pageSize;
  const displayedNewestArticles = newestArticles.slice(
    startNewestIndex,
    startNewestIndex + pageSize
  );
  const displayedOlderArticles = olderArticles.slice(
    startOlderIndex,
    startOlderIndex + pageSize
  );

  const getDataFromBE = async () => {
    try {
      const res = await getArticleByCategoryId(id);
      const data = Array.isArray(res.response) ? res.response : [res.response];

      if (data.length > 0) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const newerArticles = data.filter((article) =>
          article.createdAt.startsWith(todayStr)
        );

        const olderArticlesList = data.filter(
          (article) => !article.createdAt.startsWith(todayStr)
        );

        setNewestArticles(newerArticles);
        setOlderArticles(olderArticlesList);

        setIsLoading(false);
      } else {
        setNewestArticles([]);
        setOlderArticles([]);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      nav('/error');
    }
  };
  useEffect(() => {
    getDataFromBE();
  }, [id]);
  const handleClickArticle = (article) => {
    nav('/article/' + article._id);
  };
  return (
    <Flex vertical gap="middle">
      {isloading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : (
        <Splitter>
          <Splitter.Panel
            size={'70%'}
            resizable={false}
            style={{ padding: '10px' }}
          >
            {displayedNewestArticles.length > 0 ? (
              <>
                <Divider style={{ borderColor: '#008000' }}>Mới nhất</Divider>
                {displayedNewestArticles.map((item, index) => (
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
                      />
                    }
                  >
                    <Meta title={item.title} description={item.description} />
                  </Card>
                ))}
                <Pagination
                  align="center"
                  defaultCurrent={1}
                  total={displayedNewestArticles.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(page) => {
                    setCurrentNewestPage(page);
                  }}
                />
              </>
            ) : (
              <Result
                icon={<SmileOutlined />}
                title="Hôm nay hiện không có bài viết mới nào trong danh mục này, hãy quay lại sau nhé !"
              />
            )}
          </Splitter.Panel>
          <Splitter.Panel
            size={'30%'}
            resizable={false}
            style={{ padding: '10px' }}
          >

            {displayedOlderArticles.length > 0 ? (
              <>
                <Divider style={{ borderColor: '#008000' }}>Cũ hơn</Divider>
                {displayedOlderArticles.reverse().map((item, index) => (
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
                      />
                    }
                  >
                    <Meta title={item.title} description={item.description} />
                  </Card>
                ))}
                <Pagination
                  align="center"
                  defaultCurrent={1}
                  total={displayedOlderArticles.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(page) => {
                    setCurrentOlderPage(page);
                  }}
                />
              </>
            ) : (
              <div></div>
            )}
          </Splitter.Panel>
        </Splitter>
      )}
    </Flex>
  );
};

export default ArticleByCategory;
