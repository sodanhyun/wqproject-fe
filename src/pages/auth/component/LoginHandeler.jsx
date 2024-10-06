import { useEffect } from "react";
import { ACCESS_TOKEN } from "../../../constants/localstorage_constants";

const { VITE_REACT_APP_API_FRONT_URL } = import.meta.env;

const LoginHandeler = () => {
  // 카카오 로그인 후 받은 토큰 값 추출
  const token = new URL(window.location.href).searchParams.get("result");

  useEffect(() => {
    // 로컬 스토리지 저장
    const lCode = localStorage.getItem('lCode');
    const result = JSON.stringify(token);
    localStorage.setItem("role", result.split("role")[1].substring(1).split(",")[0]);
    localStorage.setItem(ACCESS_TOKEN, result.split("accessToken")[1].substring(1).split(",")[0]);
    localStorage.setItem("myId", result.split("memberId")[1].substring(1).split("}")[0]);

    // 다음 페이지
    window.location.href = `${VITE_REACT_APP_API_FRONT_URL}/liveQuestions/${lCode}`;
  }, [token]);

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
