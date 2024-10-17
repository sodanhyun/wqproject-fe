import { Link, useNavigate } from "react-router-dom";
import { LOGIN_COMPONENT } from "../../constants/component_constants";
import { SIGNUP_API } from "../../constants/api_constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "../../components/common/Button";
import { TextField } from "../../components/common/Fields";
import { SlimLayout } from "../../components/common/SlimLayout";
import WqLogo from "/assets/logo/wq2.png"
export const metadata = {
  title: "Sign Up",
};

export default function Regist() {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const navigate = useNavigate();
  const [reqData, setReqData] = useState({
    name: "",
    email: "",
    id: "",
    password: "",
    confirmPassword: ""
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [idError, setIdError] = useState("");
  const [pendding, setPendding] = useState(false);

  const onChangeHandler = (e) => {
    const {value, name} = e.target;
    if(name==="id") {
      if (e.target.value.length < 4) {
        setIdError("아이디는 최소 4자 이상이어야 합니다.");
      } else {
        setIdError("");
      }
    }
    if(name==="password") {
      if (e.target.value.length < 8 || e.target.value.length > 16) {
        setPasswordError(
          "비밀번호는 최소 8자 이상, 최대 16자 이내로 입력해주세요."
        );
      } else {
        setPasswordError("");
      }
    }
    if(name==="confirmPassword") {
      if (reqData.password !== e.target.value) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    }
    setReqData({ ...reqData, [name]: value});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPendding(true);
    const {confirmPassword, ...others} = reqData;
    await axios.post(VITE_REACT_APP_API_BASE_URL + SIGNUP_API ,others)
    .then((res) => {
      toast.success("회원가입에 성공했습니다!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(LOGIN_COMPONENT);
    }).catch((err) => {
      setPendding(false);
      if (err.response &&
        err.response.status === 405 &&
        err.response.data === "이미 가입된 유저입니다."
      ) {
        toast.error("이미 가입된 유저입니다.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("회원가입에 실패했습니다.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    })
  };

  return (
    <div className="h-screen">
      <SlimLayout>
      {pendding && 
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
      }
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
            value={reqData.name}
            onChange={onChangeHandler}
          />
          <TextField
            className="col-span-full"
            label="Email"
            name="email"
            type="text"
            autoComplete="email"
            required
            value={reqData.email}
            onChange={onChangeHandler}
          />
          <div className="gap-y-2">
            <TextField
              className="col-span-full"
              label="Id"
              name="id"
              type="text"
              autoComplete="id"
              required
              value={reqData.id}
              onChange={onChangeHandler}
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
              value={reqData.password}
              onChange={onChangeHandler}
            />
            {passwordError && <p className="text-red-500 col-span-full">{passwordError}</p>}
          </div>
          <div className="gap-y-2">
            <TextField
              className="col-span-full"
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={reqData.confirmPassword}
              onChange={onChangeHandler}
            />
            {confirmPasswordError && <p className="text-red-500 col-span-full">{confirmPasswordError}</p>}
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
