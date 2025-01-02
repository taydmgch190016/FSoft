import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Form, Select, Pagination, Flex, Row, Card } from 'antd';
import { getCategory } from '../../service/category.service';
import { searchArticles } from '../../service/article.service';
import { extractImageFromContent } from '../../helper/extractImage';

const { Search } = Input;
const { Option } = Select;

const SearchPage = () => {
  const [category, setCategory] = useState([]);
  const [searchedArticle, setSearchedArticle] = useState([]);
  const [form] = Form.useForm();
  const nav = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedArticles = searchedArticle.slice(
    startIndex,
    startIndex + pageSize
  );

  useEffect(() => {
    getCategory().then((res) => {
      setCategory(res);
    });
  }, []);

  const handleSubmitSearch = (values) => {
    setSearchedArticle([]);
    if (values.searchText.trim() !== '') {
      searchArticles(values).then((res) => {
        setSearchedArticle(res.data);
      });
    }
  };

  const handleSearch = () => {
    form.submit();
  };

  const handleClickArticle = (article) => {
    nav('/article/' + article._id);
  };

  return (
    <Flex vertical style={{minHeight: '70vh'}}>
      <Form form={form} onFinish={handleSubmitSearch}>
        <Form.Item name="searchText">
          <Search
            placeholder="Tìm kiếm tin tức"
            allowClear
            style={{ width: '80%' }}
            onSearch={handleSearch}
          />
        </Form.Item>
        <Row justify={'left'}>
          <Form.Item name="category">
            <Select placeholder="Chọn danh mục" onChange={handleSearch}>
              {category.map((item, index) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="time" style={{ marginLeft: 10 }}>
            <Select placeholder="Chọn thời gian" onChange={handleSearch}>
              <Option value="today">Hôm nay</Option>
              <Option value="last-week">Tuần trước</Option>
              <Option value="last-month">Tháng trước</Option>
            </Select>
          </Form.Item>
        </Row>

        <h3>
          {searchedArticle.length} kết quả tìm kiếm về "
          {form.getFieldValue('searchText')}"
        </h3>
      </Form>
      <div>
        {searchedArticle.length > 0 && (
          <>
            {displayedArticles.map((item, index) => (
              <Card
                style={{
                  width: '80%',
                  margin: '10px 0 10px 0',
                  padding: '0px',
                }}
                onClick={() => {
                  handleClickArticle(item);
                }}
                hoverable
              >
                <Flex justify="space-between">
                  <img
                    style={{ width: '60%', objectFit: 'cover' }}
                    src={extractImageFromContent(item.content)}
                    alt={item.title}
                  />
                  <Flex vertical style={{ padding: 32 }}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Flex>
                </Flex>
              </Card>
            ))}
            <Pagination
              align="left"
              defaultCurrent={1}
              total={searchedArticle.length}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </>
        )}
      </div>
    </Flex>
  );
};

export default SearchPage;
