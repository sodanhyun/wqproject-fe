import axios from 'axios'
import { LOGIN_COMPONENT } from './constants/component_constants';

const { VITE_REACT_APP_API_BASE_URL,
  VITE_REACT_APP_FAIL_REDIRECT_URL
 } = import.meta.env;

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
      localStorage.clear();
      window.location.href = VITE_REACT_APP_FAIL_REDIRECT_URL;
      const response = await axios.request(error.config);
      return response;
    }
    return Promise.reject(error);
  }
);

export default fetcher;