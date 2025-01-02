// src/components/Footer.js
import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';
import {
  FacebookOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;

const FooterComponent = () => {
  const navToAppStore = () => {
    window.open('https://www.apple.com/app-store/', '_blank');
  };
  const navToGGPlay = () => {
    window.open('https://play.google.com/store/apps/', '_blank');
  };
  const navToMCStore = () => {
    window.open('https://apps.microsoft.com/', '_blank');
  };
  const navToFB = () => {
    window.open('https://www.facebook.com/', '_blank');
  };
  const navToYTB = () => {
    window.open('https://youtube.com/', '_blank');
  };
  const navToTW = () => {
    window.open('https://x.com/', '_blank');
  };
  const navToIG = () => {
    window.open('https://www.instagram.com/accounts/login/?hl=en', '_blank');
  };
  return (
    <Footer style={{ backgroundColor: '#ffff' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#008000', marginBottom: '10px' }}>
            Báo Hôm Nay
          </h3>
          <p>Cơ quan của: Báo Hôm Nay</p>
          <p>Tổng biên tập: Bùi Đức Cảnh</p>
          <p>Giấy phép hoạt động: ISO-090</p>
          <p>Địa chỉ: Hà Nội</p>
        </Col>

        <Col
          xs={24}
          md={12}
          lg={8}
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          <h4 style={{ color: '#000', marginBottom: '10px' }}>Liên hệ</h4>
          <p>Hotline: 09-123-213-23</p>
          <p>Email: info@baohomnay.com</p>
          <Divider />
          <h4 style={{ color: '#000', marginBottom: '10px' }}>
            Liên kết nhanh
          </h4>
          <p>RSS | Chính sách bảo mật</p>
        </Col>

        <Col
          xs={24}
          md={12}
          lg={8}
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          <h4 style={{ color: '#000', marginBottom: '10px' }}>Tải ứng dụng</h4>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/16566/16566128.png"
              alt="App Store"
              style={{ height: '40px', objectFit: 'contain' }}
              onClick={() => {
                navToAppStore();
              }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/3128/3128279.png"
              alt="Google Play"
              style={{ height: '40px', objectFit: 'contain' }}
              onClick={() => {
                navToGGPlay();
              }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/888/888865.png"
              alt="Microsoft Store"
              style={{ height: '40px', objectFit: 'contain' }}
              onClick={() => {
                navToMCStore();
              }}
            />
          </div>
          <Divider />
          <h4 style={{ color: '#000', marginBottom: '10px' }}>
            Theo dõi chúng tôi
          </h4>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FacebookOutlined
              style={{ fontSize: '24px', color: '#4267B2' }}
              onClick={() => {
                navToFB();
              }}
            />
            <YoutubeOutlined
              style={{ fontSize: '24px', color: '#FF0000' }}
              onClick={() => {
                navToYTB();
              }}
            />
            <TwitterOutlined
              style={{ fontSize: '24px', color: '#1DA1F2' }}
              onClick={() => {
                navToTW();
              }}
            />
            <InstagramOutlined
              style={{ fontSize: '24px', color: '#C13584' }}
              onClick={() => {
                navToIG();
              }}
            />
          </div>
        </Col>
      </Row>
      <Divider />
      <p style={{ textAlign: 'center', margin: '10px 0', color: '#888' }}>
        © 2024 Bản quyền thuộc về Báo điện tử Báo Hôm Nay. Cấm sao chép dưới mọi
        hình thức nếu không có sự chấp thuận bằng văn bản.
      </p>
    </Footer>
  );
};

export default FooterComponent;
