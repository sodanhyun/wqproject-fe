import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  SIGNUP_COMPONENT,
  MAIN_COMPONENT
} from "../../../constants/component_constants";
import { LOGIN_API } from "../../../constants/api_constants";
import { toast } from "react-toastify";

import { Button } from "../../../components/Button";
import { TextField } from "../../../testComponent/Fields";
import { SlimLayout } from "../../../components/SlimLayout";
import WqLogo from "../../../assets/wq2.png"

export const metadata = {
  title: "Sign In",
};

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("password", password);

      const response = await axios.post(
        VITE_REACT_APP_API_BASE_URL + LOGIN_API,
        formData,
        {
          headers: {
            Authorization: `Basic ${btoa(id + ":" + password)}`,
          },
        }
      );
       
      console.log("Response:", response);
      if(response.data.role != "ADMIN") {
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
      if (response.data.tokenDto.accessToken !== undefined) {
        // 로컬스토리지에 access토큰 값 저장
        localStorage.setItem("access_token", response.data.tokenDto.accessToken);
        localStorage.setItem("refresh_token", response.data.tokenDto.refreshToken);
        localStorage.setItem("user_role", response.data.role);
        localStorage.setItem("myId", response.data.memberId);
        
      } else {
        alert(response.status);
      }

      navigate(MAIN_COMPONENT);
    } catch (error) {
      console.error(error);
     
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
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
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <div className="flex flex-col gap-y-2">
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
