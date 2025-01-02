import { httpClient } from '../utils/Httpclient';

export const getCategory = async () => {
  try {
    const response = await httpClient.get('/api/getCategorys');
    return response.data;
  } catch (e) {
    return { e };
  }
};
export const getCategoryById = async (id) => {
  const response = await httpClient.get(`/api/categorybyid/${id}`);
  return response.data;
};
export const getArticleByCategoryId = async (id) => {
  const response = await httpClient.get(`/api/getArticleByCatId/${id}`);
  return response.data;
};
export const addCategory = async ({ name }) => {
  try {
    const response = await httpClient.post('/api/createCategory', { name });

    return response.data;
  } catch (err) {
    return { err };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await httpClient.delete(
      `/api/deleteCategorys/${categoryId}`
    );

    return response.data;
  } catch (err) {
    return { err };
  }
};

export const updateCategory = async (categoryId, { name }) => {
  try {
    const response = await httpClient.put(
      `/api/updateCategorys/${categoryId}`,
      { name }
    );

    return response.data;
  } catch (err) {
    return { err };
  }
};
