import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  SIGNUP_COMPONENT,
  MAIN_COMPONENT
} from "../../constants/component_constants";
import { LOGIN_API } from "../../constants/api_constants";
import { toast } from "react-toastify";
import { Button } from "../../components/common/Button";
import { TextField } from "../../components/common/Fields";
import { SlimLayout } from "../../components/common/SlimLayout";
import WqLogo from "/assets/logo/wq2.png"
import { USER_ID, USER_ROLE, USER_TYPE } from "../../constants/localstorage_constants";
import { ADMIN } from "../../constants/user_role";
import SocialLoginLink from "./component/SocialLoginLink";

export default function Login() {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [reqData, setReqData] = useState({
    id: "",
    password: "",
  });
  const [pendding, setPendding] = useState(false);
  
  const onChangeHandler = (e) => {
    const {value, name} = e.target;
    setReqData({ ...reqData, [name]: value});
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setPendding(true);
    await axios.post(VITE_REACT_APP_API_BASE_URL + LOGIN_API, reqData)
    .then((res) => {
      if(res.data.userRole.type !== ADMIN) {
        toast.warning("관리자 승인 대기중인 계정입니다.", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }else if(res.data.userRole.type === ADMIN) {
        toast.success("로그인에 성공했습니다!", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.clear();
        localStorage.setItem(USER_TYPE, res.data?.userType);
        localStorage.setItem(USER_ROLE, res.data?.userRole.type);
        localStorage.setItem(USER_ID, res.data?.userId);
        navigate(MAIN_COMPONENT);
      }
    }).catch((err) => {
      setPendding(false);
      toast.error("아이디 또는 비밀번호가 잘못되었습니다.", {
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    });
  };

  return (
    <div className="h-screen">
      <SlimLayout>
      {pendding && 
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
      }
        <div className="flex">
          <Link href="/" aria-label="Home">
            <img src={WqLogo} className="w-40"/>
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900">로그인</h2>
        <p className="mt-2 text-sm text-gray-700">
          아직 회원이 아니신가요?{" "}
          <Link
            to={`${SIGNUP_COMPONENT}`}
            className="font-medium text-blue-600 hover:underline"
          >
            회원가입
          </Link>{" "}
          하러가기
        </p>
        <form onSubmit={handleLogin} className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Id"
            name="id"
            type="text"
            autoComplete="text"
            required
            value={reqData.id}
            onChange={onChangeHandler}
          />
          <div className="flex flex-col gap-y-2">
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={reqData.password}
              onChange={onChangeHandler}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              <span>
                로그인 <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
            <SocialLoginLink/>
          </div>
        </form>
      </SlimLayout>
    </div>
  );
}
