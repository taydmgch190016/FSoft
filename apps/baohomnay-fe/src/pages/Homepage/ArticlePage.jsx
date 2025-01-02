import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import {
  getArticleByAccountId,
  deleteArticle,
} from '../../service/article.service';
import ArticleList from '../../components/ArticleList';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const accountId = user._id;

  useEffect(() => {
    if (accountId) {
      const fetchArticles = async () => {
        const data = await getArticleByAccountId(accountId);
        setArticles(data);
      };
      fetchArticles();
    }
  }, [accountId]);

  const handleEdit = (articleId) => {
    navigate(`/staff/update-article/${articleId}`);
  };

  const handleDelete = async (articleId) => {
    try {
      await deleteArticle(articleId);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
      message.success('Delete article successfully');
    } catch (error) {
      message.error('Delete article failed');
    }
  };

  return (
    <div>
      <h1 style={{ color: 'green', marginBottom: '50px' }}>
        Article List of {user.fullname}:
      </h1>
      <ArticleList
        articles={articles}
        renderActions={(article) => (
          <div>
            <Button
              onClick={() => handleEdit(article._id)}
              style={{
                marginRight: '10px',
                backgroundColor: 'green',
                width: '70px',
                color: 'white',
              }}
            >
              Edit
            </Button>
            <Button
              className="no-btn"
              style={{
                backgroundColor: 'white',
                color: 'green',
                width: '70px',
              }}
              onClick={() => handleDelete(article._id)}
            >
              Delete
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default ArticlePage;
