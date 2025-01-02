import { httpClient } from '../utils/Httpclient';

export async function login(username , passwords) {
  const data = await httpClient.post('/api/auth/login', { email: username, password: passwords });
  return data
}

export async function register(values) {

  const data = await httpClient.post('/api/register', values);
  return data
}
export async function getToken(){
    const response = await httpClient.get('/api/getaccessToken');
    return response
  }
  
  

  export async function listAcc(){
    const response = await httpClient.get('/api/user/listAcc');
    return response
  }

  export async function listDataRole(){
    const response = await httpClient.get('/api/user/listRole');
    return response
  }
  
  
  export async function updateAcc(id , values){

    const response = await httpClient.put(`/api/user/update/${id}`, values);
    return response
  }

  export async function deleteAcc(id){
    const response = await httpClient.delete(`/api/user/delete/${id}`);
    return response
  }
  export async function findAcc(id){
    const response = await httpClient.get(`/api/user/find/${id}`);
    return response
  }

  export async function forgotPass(values){
    const response = await httpClient.post('/api/user/forgot' , values);
    return response
  }

  export async function resetPass(token , values){
    const response = await httpClient.post(`/api/user/resetPass/${token}` , values);
    return response
  }
  
  export async function sendCallBack(search){
    const response = httpClient.get(`/api/auth/google/callback/${search}`);
    return response
  }