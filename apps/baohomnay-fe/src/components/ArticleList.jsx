import React from 'react';
import { extractImageFromContent } from '../helper/extractImage';
import { Divider } from 'antd';

const ArticleList = ({ articles, renderActions }) => {
  return (
    <div style={{ margin: '20px', borderRadius: '5px' }}>
      {articles.map((article) => (
        <div>
          <div
            key={article._id}
            className="article-item"
            style={{ display: 'flex' }}
          >
            <img
              alt={article.title}
              src={extractImageFromContent(article.content)}
              style={{
                width: '200px',
                minWidth: '200px',
                height: '150px',
                minHeight: '150px',
                marginRight: '20px',
                borderRadius: '5px',
                border: '1px solid green',
              }}
            />
            <div>
              <h3 style={{ color: 'green' }}>{article.title}</h3>
              <p>{article.description}</p>
              {renderActions && renderActions(article)}{' '}
            </div>
          </div>
          <Divider style={{ borderColor: '#7cb305' }}></Divider>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
