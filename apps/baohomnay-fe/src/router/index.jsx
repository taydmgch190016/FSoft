import { createBrowserRouter, Navigate } from 'react-router-dom';

import NotFound from '../pages/NotFound/NotFound';

import Layout from '../components/Layout';
import LayoutAuth from '../components/admin/LayoutAuth';
import Home from '../pages/Homepage/Home';
import CreateArticle from '../pages/Homepage/CreateArticle';
import Category from '../pages/Admin/Category';
import ArticleByCategory from '../pages/Homepage/ArticleByCategory';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import ArticleByCat from '../pages/Admin/ArticleByCategory';
import RoleProtected, {
  RoleName,
} from '../components/RoleProtected/RoleProtected';
import Login from '../pages/Auth/Login';
import Account from '../pages/Admin/Account';
import DetailArticle from '../pages/Homepage/DetailArticle';
import ArticlePage from '../pages/Homepage/ArticlePage';
import UpdateArticle from '../pages/Homepage/UpdateArticle';
import SearchPage from '../pages/Homepage/SearchPage';
import UserPage from '../pages/Homepage/UserPage';
import ArticleByTag from '../pages/Homepage/ArticleByTag';
import Pending from '../pages/Auth/Pending';
import Message from '../pages/Homepage/Message';
import ListPayment from '../pages/Admin/ListPayment';

const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'article/:id',
        element: <DetailArticle />,
      },
      {
        path: 'category/:id',
        element: <ArticleByCategory />,
      },
      {
        path: '/tag/:tag',
        element: <ArticleByTag />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: 'user',
        element: (
          <UserPage />
        ),
      },
      {
        path: 'user/success',
        element: ( <UserPage /> ),
      },
      {
        path: '/message',
        element: <Message />,
      },
      {
        path: 'auth/reset-password/:token',
        element: <Login />,
      },
      {
        path: '/google/callback/',
        element: <Pending />,
      },
    ],
  },

  {
    path: '/auth',
    element: (
      <ProtectedRoute allowedRole={[RoleName.ADMIN]}>
        {' '}
        <LayoutAuth />{' '}
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: (
          <RoleProtected allowedRole={[RoleName.ADMIN]}>
            <Account />
          </RoleProtected>
        ),
      },
      {
        path: 'category',
        element: (
          <RoleProtected allowedRole={[RoleName.ADMIN]}>
            <Category />
          </RoleProtected>
        ),
      },
      {
        path: 'account',
        element: (
          <RoleProtected allowedRole={[RoleName.ADMIN]}>
            <Account />
          </RoleProtected>
        ),
      },
      {
        path: 'payment',
        element: (
          <RoleProtected allowedRole={[RoleName.ADMIN]}>
            <ListPayment />
          </RoleProtected>
        ),
      },
      {
        path: 'categories/:id',
        element: (
          <RoleProtected allowedRole={[RoleName.ADMIN]}>
            <ArticleByCat />
          </RoleProtected>
        ),
      },
    ],
  },

  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRole={[RoleName.STAFF]}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'create-article',
        element: (
          <RoleProtected allowedRole={[RoleName.STAFF]}>
            <CreateArticle />
          </RoleProtected>
        ),
      },
      {
        path: 'list-article',
        element: (
          <RoleProtected allowedRole={[RoleName.STAFF]}>
            <ArticlePage />
          </RoleProtected>
        ),
      },
      {
        path: 'update-article/:id',
        element: (
          <RoleProtected allowedRole={[RoleName.STAFF]}>
            <UpdateArticle />
          </RoleProtected>
        ),
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
