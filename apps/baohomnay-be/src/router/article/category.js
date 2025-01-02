import express from 'express';
import {
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategory,
} from '../../controllers/categories/categories.controller';
import { authorization, verifyToken } from '../../middlewares/auth';
import { RoleName } from '../../models/account.model';
const router = express.Router();
// auth routes
router.post('/api/createCategory', verifyToken, authorization([RoleName.ADMIN]), createCategory);
router.get('/api/getCategorys', getCategory);
router.get('/api/categorybyid/:id', verifyToken, authorization([RoleName.ADMIN]), getCategoryById);
router.put('/api/updateCategorys/:id', verifyToken, authorization([RoleName.ADMIN]), updateCategory);
router.delete('/api/deleteCategorys/:id', verifyToken, authorization([RoleName.ADMIN]), deleteCategory);

export default router;
