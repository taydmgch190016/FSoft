import { httpClient } from '../utils/Httpclient';

export async function createArticle(article) {
  const data = await httpClient.post('/api/createArticles', {
    article: article,
  });
  return data;
}

export async function getArticle() {
  const data = await httpClient.get('/api/getArticles');
  return data;
}

export async function getArticleById(id) {
  const data = await httpClient.get(`/api/Articlebyid/${id}`);
  return data;
}

export async function getArticleByCategory(catId) {
  const data = await httpClient.get(`/api/getArticleByCatId/${catId}`);
  return data;
}
export async function getArticleByAccountId(id) {
  const response = await httpClient.get(`/api/getArticleByAccountId/${id}`);
  return response.data;
}
export async function getArticleByCatId(id) {
  const response = await httpClient.get(`/api/getArticleByCatId/${id}`);
  return response.data;
}
export const updateArticle = async (id, updatedData) => {
  const response = await httpClient.put(
    `/api/updateArticles/${id}`,
    updatedData
  );
  return response.data;
};

export async function deleteArticle(id) {
  const response = await httpClient.delete(`/api/deleteArticles/${id}`);
  return response.data;
}


export const getCommentsByArticleId = async (id) => {
  const response = await httpClient.get(`/api/getCommentsByArticleId/${id}`);
  return response;
}

export const createComments = async (articleId, comment) => {
  const response = await httpClient.post(`/api/createComments/${articleId}`, comment);
  return response;
}

export const searchArticles = async (query) => {
  const response = await httpClient.post(`/api/searchArticles`,{query});
  return response;
}

export const getTags = async () => {
  const response = await httpClient.get(`/api/getTags`);
  return response;
}

export const getArticleByTag = async (tag) => {
  const response = await httpClient.get(`/api/tag/${tag}`);
  return response;
}