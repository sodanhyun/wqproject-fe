import { Link, useNavigate } from "react-router-dom";
import { LOGIN_COMPONENT } from "../../../constants/component_constants";
import { SIGNUP_API } from "../../../constants/api_constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

import { Button } from "../../../components/Button";
import { TextField } from "../../../testComponent/Fields";
import { SlimLayout } from "../../../components/SlimLayout";
import WqLogo from "../../../assets/wq2.png"
export const metadata = {
  title: "Sign Up",
};

export default function Register() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [idError, setIdError] = useState("");
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;

  const navigate = useNavigate();


  // 아이디 유효성 검사
  const handleIdChange = (e) => {
    setId(e.target.value);
    if (e.target.value.length < 4) {
      setIdError("아이디는 최소 4자 이상이어야 합니다.");
    } else {
      setIdError("");
    }
  };
  // 비밀번호 유효성 검사
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8 || e.target.value.length > 16) {
      setPasswordError(
        "비밀번호는 최소 8자 이상, 최대 16자 이내로 입력해주세요."
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 재확인 유효성 검사
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    // 비밀번호와 비밀번호 확인이 일치하지 않으면 에러 메시지 띄움
    if (password !== e.target.value) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", password);
    formData.append("name", name);

    try {
      // API 호출
      const response = await axios.post(
        VITE_REACT_APP_API_BASE_URL + SIGNUP_API ,
        formData
      );

      console.log("Response:", response);

      toast.success("회원가입에 성공했습니다!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(LOGIN_COMPONENT);
      
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.status === 405 &&
        error.response.data === "이미 가입되어 있는 유저입니다."
      ) {
        toast.error("이미 가입되어 있는 유저입니다.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error(error);

        toast.error("회원가입에 실패했습니다.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
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
        <h2 className="mt-20 text-lg font-semibold text-gray-900">회원가입</h2>
        <p className="mt-2 text-sm text-gray-700">
          이미 계정이 있으신가요?{" "}
          <Link
            to={`${LOGIN_COMPONENT}`}
            className="font-medium text-blue-600 hover:underline"
          >
            로그인
          </Link>{" "}
          하러가기
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1"
        >
          <TextField
            className="col-span-full"
            label="Name"
            name="name"
            type="text"
            autoComplete="given-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="gap-y-2">
            <TextField
              className="col-span-full"
              label="Id"
              name="id "
              type="text"
              autoComplete="id"
              required
              value={id}
              onChange={handleIdChange}
            />
            {idError && <p className="text-red-500 col-span-full">{idError}</p>}
          </div>

          <div className="gap-y-2">
            <TextField
              className="col-span-full"
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 col-span-full">{passwordError}</p>
            )}
          </div>
          <div className="gap-y-2">
            <TextField
              className="col-span-full"
              label="Confirm password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && (
              <p className="text-red-500 col-span-full">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <div className="col-span-full">
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              <span>
                회원가입 <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
        </form>
      </SlimLayout>
    </div>
  );
}
