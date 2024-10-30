import { useEffect } from "react";
import { USER_ROLE } from "../../../constants/localstorage_constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LOGIN_COMPONENT, MAIN_COMPONENT } from "../../../constants/component_constants";
import { ADMIN } from "../../../constants/user_role";

const LoginHandeler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lCode = localStorage.getItem(LECTURE_CODE);
    const searchParams = new URL(window.location.href).searchParams;
    const userRole = searchParams.get(USER_ROLE);
    console.log(userRole);
    localStorage.setItem(USER_ROLE, userRole);
    if(lCode) {
      toast.success("로그인에 성공했습니다!", {
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(`/liveQuestions/${lCode}`);
    }else if(userRole === ADMIN) {
      toast.success("로그인에 성공했습니다!", {
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(MAIN_COMPONENT);
    }else {
      toast.warning("관리자 승인 대기중인 계정입니다.", {
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(LOGIN_COMPONENT);
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
