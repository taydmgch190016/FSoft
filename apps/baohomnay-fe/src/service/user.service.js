import { httpClient } from '../utils/Httpclient';

export const getUserById = async (userId) => {
  const response = await httpClient.get(`/api/user/findProfile/${userId}`);
  return response.data;
};

export const updateUser = async (id, values) => {
  const response = await httpClient.put(`/api/user/updateProfile/${id}`, values);
  return response;
};

export const deleteUser = async (userId) => {
  const response = await httpClient.delete(`/api/user/delete/${userId}`);
  return response.data;
};
export const createQR = async (userId) => {
  const response = await httpClient.get(`/api/user/createBill/${userId}`);
  return response
};

export const createLog = async (body) => {
  const response = await httpClient.post(`/api/createLogPayment` , body);
  return response
};
export const findAllPayment = async () => {
  const response = await httpClient.get(`/api/findAllPayment`);
  return response.data
};