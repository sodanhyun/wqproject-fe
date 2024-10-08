import { useEffect } from "react";
import { USER_ROLE } from "../../../constants/localstorage_constants";

const { VITE_REACT_APP_API_FRONT_URL,
  VITE_REACT_APP_SUCCESS_REDIRECT_URL
 } = import.meta.env;

const LoginHandeler = () => {
  useEffect(() => {
    const lCode = localStorage.getItem('lCode');
    const searchParams = new URL(window.location.href).searchParams;
    localStorage.setItem(USER_ROLE, searchParams.get("authority"));
    if(lCode) {
      window.location.href = `${VITE_REACT_APP_API_FRONT_URL}/liveQuestions/${lCode}`;
    }else {
      window.location.href = VITE_REACT_APP_SUCCESS_REDIRECT_URL;
    }
  }, []);

  return (
    <div className="LoginHandeler flex h-screen items-center justify-center">
      <div className="notice bg-white rounded-lg p-8 shadow-md">
        <p className="text-xl font-bold mb-4">로그인 중입니다.</p>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
    </div>
  );
};

export default LoginHandeler;
