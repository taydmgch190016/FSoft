import { useState, useEffect } from 'react';
import { getArticleByTag, getTags } from '../../service/article.service';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tag,
  Flex,
  Splitter,
  Card,
  Divider,
  Skeleton,
  Pagination,
  Result,
} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { extractImageFromContent } from '../../helper/extractImage';
import { use } from 'react';
import { colorTags } from '../../helper/colorTags';
const { Meta } = Card;

function ArticleByTag() {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const { tag } = useParams();
  const [isloading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const startIndex = (currentPage - 1) * pageSize;
  const nav = useNavigate();

  const displayedArticles = articles.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    getTags().then((response) => {
      setTags(response.data.tags);
    });
  }, []);

  useEffect(() => {
    getArticleByTag(tag).then((response) => {
      setArticles(response.data.articles);
    });
    setIsLoading(false);
  }, [tag]);

  const handleClickArticle = (article) => {
    nav('/article/' + article._id);
  };

  const handleClickTag = (tag) => {
    nav('/tag/' + tag);
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
            {displayedArticles.length > 0 ? (
              <>
                <Divider style={{ borderColor: '#008000' }} orientation="left">
                  Tag về: {tag}
                </Divider>
                {displayedArticles.map((item, index) => (
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
                  total={articles.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(page) => {
                    setCurrentPage(page);
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
            <Flex gap="4px 0" wrap align="center" justify="center">
              <Divider style={{ borderColor: '#008000' }} orientation='center'>
                Những tags phổ biến khác
              </Divider>
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
          </Splitter.Panel>
        </Splitter>
      )}
    </Flex>
  );
}

export default ArticleByTag;
