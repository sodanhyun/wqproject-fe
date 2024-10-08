import axios from 'axios'
import { LOGIN_COMPONENT } from './constants/component_constants';

const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;

const fetcher = axios.create({
  baseURL :  VITE_REACT_APP_API_BASE_URL ,
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
})

fetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 || error.response.status === 403) {
      window.location.href = LOGIN_COMPONENT;
      const response = await axios.request(error.config);
      return response;
    }
    return Promise.reject(error);
  }
);

export default fetcher;