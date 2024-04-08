// 토큰 관리와 갱신
import axios from 'axios'
import { TOKEN_REFRESH_API } from './constants/api_constants';

const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
// 토큰 갱신 함수 (변경)
const tokenRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const accessToken = localStorage.getItem('access_token');
  

  try {
    const response = await fetch(VITE_REACT_APP_API_BASE_URL + TOKEN_REFRESH_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
        accessToken: accessToken,
      })
    });

    if (!response.ok) {
      throw new Error('토큰 갱신에 실패했습니다.');
    }

    const result = await response.json();

    localStorage.setItem('access_token', result.accessToken);
    localStorage.setItem('refresh_token', result.refreshToken);
    // localStorage.setItem('message', result.message);
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    // 에러 처리를 하거나 사용자에게 알리는 것이 좋음
  }
};


const fetcher = axios.create({
  baseURL :  VITE_REACT_APP_API_BASE_URL ,
  headers: { "Content-Type": "multipart/form-data" },

})


// 요청이 전달되기 전에 작업 수행 혹은 요청 오류가 있는 함수를 받음
fetcher.interceptors.request.use(
  //작업 수행
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    // const refreshToken = localStorage.getItem('refresh_token')

    // console.log(`기존 토큰 : ${accessToken}`)
    
    // config.headers['Content-Type'] = 'application/json';
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers.Authorization = `Bearer ${accessToken}`;

    // config.data = {
    //   ...config.data,
    //   accessToken: accessToken,
    //   refreshToken: refreshToken,
    // };

    return config;
  },
  // 요청 오류
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);



fetcher.interceptors.response.use(
  (response) => {
    if (response.status === 404) {
      console.log('404 페이지로 넘어가야 함!');
    }

    return response;
  },
  async (error) => {

    console.log(error.response.status); // 401
    
    if (error.response?.status === 401) {

      // 토큰 갱신 함수
      await tokenRefresh();
      
      const new_accessToken = localStorage.getItem('access_token');

      // console.log(`새로운 토큰 : ${new_accessToken}`);

      error.config.headers['Authorization'] = `Bearer ${new_accessToken}`;
      // error.config.data.token = new_accessToken;


      // 중단된 요청을(에러난 요청)을 토큰 갱신 후 재요청
      const response = await axios.request(error.config);
      return response;
    }

    return Promise.reject(error);
  }
);

export default fetcher;