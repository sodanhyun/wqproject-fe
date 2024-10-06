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
import WqLogo from "../../assets/wq2.png"

export default function Login() {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [reqData, setReqData] = useState({
    id: "",
    password: "",
  });
  
  const onChangeHandler = (e) => {
    const {value, name} = e.target;
    setReqData({ ...reqData, [name]: value});
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    await axios.post(VITE_REACT_APP_API_BASE_URL + LOGIN_API, reqData)
    .then((res) => {
      if(res.data.role.type != "ROLE_ADMIN") {
        toast.warning("관리자 승인 대기중인 계정입니다.", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }else {
        toast.success("로그인에 성공했습니다!", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      if (res.data.tokenDto.accessToken !== undefined) {
        localStorage.setItem("access_token", res.data.tokenDto.accessToken);
        localStorage.setItem("refresh_token", res.data.tokenDto.refreshToken);
        localStorage.setItem("user_role", res.data.role.type);
        localStorage.setItem("myId", res.data.memberId);
      } else {
        alert(res.status);
      }
      navigate(MAIN_COMPONENT);
    }).catch((err) => {
      console.log(err);
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    });
  };

  return (
    <div className="h-screen">
      <SlimLayout>
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
          </div>
        </form>
      </SlimLayout>
    </div>
  );
}
