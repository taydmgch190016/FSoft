import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleByCategoryId,
  getArticlesByAccount,
  getTags, getArticlesByTag,
  getCommentsByArticleId,
  createComments,
  searchArticles
} from '../../controllers/article/article.controller';
import { verifyToken , authorization } from '../../middlewares/auth';
import { RoleName } from '../../models/account.model';

const router = express.Router();

router.get('/api/getArticles', getArticles);
router.get('/api/Articlebyid/:id', getArticleById);
router.get('/api/getArticleByCatId/:catId', getArticleByCategoryId);
router.post('/api/createArticles',verifyToken , authorization([RoleName.ADMIN , RoleName.STAFF]),  createArticle);
router.put('/api/updateArticles/:id',verifyToken , authorization([RoleName.ADMIN,RoleName.STAFF]), updateArticle);
router.delete('/api/deleteArticles/:id',verifyToken , authorization([RoleName.ADMIN , RoleName.STAFF]), deleteArticle);
router.get('/api/getArticleByAccountId/:id', getArticlesByAccount);
router.get('/api/getTags', getTags);
router.get('/api/tag/:tag', getArticlesByTag);
router.post('/api/searchArticles',searchArticles)

router.get('/api/getCommentsByArticleId/:articleId',verifyToken, getCommentsByArticleId);
router.post('/api/createComments/:articleId',verifyToken, createComments);
export default router;
