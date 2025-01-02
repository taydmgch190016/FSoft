import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message, Tag, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from 'verbum';
import {
  createArticle,
  getArticleById,
  updateArticle,
} from '../../service/article.service';

const CreateUpdateArticle = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [content, setContent] = useState({});

  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  const forMap = (tag) => (
    <span
      key={tag}
      style={{
        display: 'inline-block',
      }}
    >
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  );
  const tagChild = tags.map(forMap);
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };

  const handleOnChange = (values) => {
    setContent(values);
  };

  const handleSubmit = () => {
    try {
      const values = form.getFieldsValue();
      const user = JSON.parse(sessionStorage.getItem('userData') || '{}');

      const data = {
        accountId: user._id,
        categoryId: user.categoryId,
        tags: tags,
        title: values.title,
        description: values.description,
        content: content,
      };

      createArticle(data);
      message.success('Article created successfully');
      form.resetFields();
      nav('/');
    } catch {
      message.error('Submit article failed');
    }
  };

  return (
    <>
      <h1>Create Article</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input placeholder="Enter article title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <Input.TextArea placeholder="Enter article description" />
        </Form.Item>

        <>
          <div
            style={{
              marginBottom: 16,
            }}
          >
            <TweenOneGroup
              appear={false}
              enter={{
                scale: 0.8,
                opacity: 0,
                type: 'from',
                duration: 100,
              }}
              leave={{
                opacity: 0,
                width: 0,
                scale: 0,
                duration: 200,
              }}
              onEnd={(e) => {
                if (e.type === 'appear' || e.type === 'enter') {
                  e.target.style = 'display: inline-block';
                }
              }}
            >
              {tagChild}
            </TweenOneGroup>
          </div>
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{
                width: 78,
              }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag onClick={showInput} style={tagPlusStyle}>
              <PlusOutlined /> Thêm Tag
            </Tag>
          )}
        </>

        <EditorComposer>
          <Editor
            hashtagsEnabled={true}
            emojisEnabled={true}
            onChange={(value) => handleOnChange(value)}
          >
            <ToolbarPlugin defaultFontSize="20px">
              <FontFamilyDropdown />
              <FontSizeDropdown />
              <Divider />
              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
              <CodeFormatButton />
              <InsertLinkButton />
              <TextColorPicker />
              <BackgroundColorPicker />
              <TextFormatDropdown />
              <Divider />
              <InsertDropdown enablePoll={true} />
              <Divider />
              <AlignDropdown />
            </ToolbarPlugin>
          </Editor>
        </EditorComposer>

        <Button type="primary" onClick={handleSubmit} htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateUpdateArticle;
