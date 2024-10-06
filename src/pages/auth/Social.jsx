import { useParams } from 'react-router-dom';
import { Link} from "react-router-dom";
import { SlimLayout } from "../../components/common/SlimLayout";
import kakao from "../../assets/kakao_login_large_narrow.png";
import WqLogo from "../../assets/wq2.png"
import {useEffect} from "react";
import axios from "axios";
import {TEMP_TOKEN_API} from "../../constants/api_constants.js";

const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
const { VITE_REACT_APP_REDIRECT_URL } = import.meta.env;
const { VITE_REACT_APP_AUTHORIZE_URL } = import.meta.env;
const KAKAO_AUTH_URL = `${VITE_REACT_APP_AUTHORIZE_URL}/kakao?redirect_uri=${VITE_REACT_APP_REDIRECT_URL}`;

export default function Social() {
  const { lCode } = useParams();
  localStorage.setItem("lCode", lCode);

  useEffect(() => {
    handleQuestionRegistration();
  }, []);

  const handleQuestionRegistration = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("memberId");
    localStorage.removeItem("myId");

    await axios.get(VITE_REACT_APP_API_BASE_URL + TEMP_TOKEN_API)
    .then((res) => {
      localStorage.setItem("access_token", res.data.tokenDto.accessToken);
      localStorage.setItem("refresh_token",res.data.tokenDto.refreshToken);
      localStorage.setItem("user_role", res.data.role);
      localStorage.setItem("memberId", res.data.memberId);
    }).catch((err) => {
      console.log(err);
    })
  };

  return (
    <div className="h-screen">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
          <img src={WqLogo} className="w-40"/>
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900 flex justify-center">로그인</h2>
    
        <p className="mt-2 text-sm text-gray-700 flex justify-center ">
          로그인 없이
          <Link
            to={`/question/${lCode}`}
            className="font-medium text-blue-600 hover:underline"
          >
            질문등록
          </Link>{" "}
          하러가기
        </p>

        <a href={KAKAO_AUTH_URL} className="kakaobtn flex justify-center">
          <img src={kakao} className="w-44 mt-2 " />
        </a>
      </SlimLayout>
    </div>
  );
}
