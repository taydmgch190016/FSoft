import bcrypt from 'bcrypt';
import * as _ from 'lodash';

import categoryModel from '../../models/category.model';
import Article from '../../models/article.model';
import account from '../../models/account.model';
import { RoleName } from '../../models/account.model';

export const createCategory = async (req, res, next) => {
  try {
    const response = await categoryModel.create(req.body);
    return res.json({
      message: 'Create Category successfully',
      res: response,
    });
  } catch (err) {
    next(err);
  }
};
export const getCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.find();
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCategory)
      return res.status(404).json({ message: 'Article not found' });
      await Article.deleteMany({ categoryId: req.params.id });
      await account.deleteMany({ categoryId: req.params.id, role: RoleName.STAFF, });
      res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};
