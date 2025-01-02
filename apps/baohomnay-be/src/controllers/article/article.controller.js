import Article from '../../models/article.model';
import { getTimeFilter } from '../../helper/getFilterTime';

export const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate('accountId')
      .populate('categoryId');
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('accountId')
      .populate('categoryId');
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

export const getArticleByCategoryId = async (req, res, next) => {
  try {
    const response = await Article.find({ categoryId: req.params.catId });

    return res.json({
      response: response,
    });
  } catch (error) {
    next(error);
  }
};
export const createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article(req.body.article);
    await newArticle.save();
    res.status(201).json('New articles has been created!');
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle)
      return res.status(404).json({ message: 'Article not found' });
    return res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle)
      return res.status(404).json({ message: 'Article not found' });
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getArticlesByAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const articles = await Article.find({ accountId });
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const searchArticles = async (req, res, next) => {
  try {
    const { category, time, searchText } = req.body.query;

    const searchConditions = [];

    if (searchText && searchText.trim() !== '') {
      searchConditions.push({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { description: { $regex: searchText, $options: 'i' } },
        ],
      });
    }

    if (category && category.trim() !== '') {
      searchConditions.push({ categoryId: category });
    }

    if (time && time.trim() !== '') {
      const timeFilter = getTimeFilter(time);
      if (timeFilter) {
        searchConditions.push({ createdAt: timeFilter });
      }
    }

    const finalQuery =
      searchConditions.length > 0 ? { $and: searchConditions } : {};

    const articles = await Article.find(finalQuery)
      .populate('categoryId')
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};
export const getTags = async (req, res) => {
  try {
    const articles = await Article.find({}, 'tags');
    const uniqueTags = new Set();
    articles.forEach((article) => {
      article.tags.forEach((tag) => uniqueTags.add(tag.toLowerCase()));
    });
    const tagsArray = Array.from(uniqueTags);
    res.status(200).json({
      success: true,
      tags: tagsArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tags',
    });
  }
};

export const getArticlesByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    if (!tag) {
      return res.status(400).json({
        success: false,
        message: 'Tag is required',
      });
    }
    const articles = await Article.find({
      tags: { $in: [new RegExp(`^${tag}$`, 'i')] },
    });
    res.status(200).json({
      success: true,
      articles: articles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to get articles by tag',
    });
  }
};

export const getCommentsByArticleId = async (req, res, next) => {
  try {
    const comment = await Article.findById({ _id: req.params.articleId });
    return res.status(200).json(comment.totalComment);
  } catch (error) {
    next(error);
  }
};

export const createComments = async (req, res, next) => {
  try {
    if (req.body.commentStatus == 'normal') {
      const article = await Article.findById(req.params.articleId);
      if (!article.totalComment) {
        article.totalComment = [];
        article.totalComment.push(req.body.comment);
        await article.save();
        return res.json({
          message: 'Create comment successfully',
        });
      }
      article.totalComment.push(req.body.comment);
      await article.save();
      return res.json({
        message: 'Create comment successfully',
      });
    } else {
      const article = await Article.findById(req.params.articleId);
      const respond = article.totalComment.map((items) => {
        if (items.id == req.body.commentParentId) {
          items.children.push(req.body.comment);
        }
        return items;
      });
      await Article.updateOne(
        { _id: req.params.articleId },
        { totalComment: respond }
      );
      return res.json({
        message: 'Create comment successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};
