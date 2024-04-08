import "./App.css";
import { Route, Routes } from "react-router-dom";
import {
  LECTURE_LIST_COMPONENT,
  REGISTRATION_COMPONENT,
  LOGIN_COMPONENT,
  SIGNUP_COMPONENT,
  SIGNUP_SOCIAL,
  REDIRECT_COMPONENT,
  LIVE_QUESTIONS_COMPONENT,
  QR_CODE_COMPONENT,
  ERROR_COMPONENT,
  PICK_QUESTIONS_COMPONENT,
  NON_LOGIN_QUESTION_COMPONENT,
  AUTH_MANAGEMENT_COMPONENT,
  MAIN_COMPONENT
} from "./constants/component_constants.js";
import LectureReg from "./pages/LectureReg.jsx";
import LectureList from "./pages/LectureList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./app/(auth)/login/page";
import Register from "./app/(auth)/register/page";
import LectureQR from "./pages/LectureQR";
// 소셜로그인
import LoginHandeler from "./components/LoginHandeler";
import Social from "./app/(auth)/login/socialpage";
import Test from "./testComponent/test";
import {QuestionCollection} from "./pages/AnswerQuestions/QuestionCollection.jsx";
import LiveQuestions from "./pages/LiveQuestions/LiveQuestions.jsx";
import NotFound from "./app/not-found";
import NonLoginQuestion from "./pages/NonLoginQuestion";
import AuthorityManagement from "./pages/AuthorityManagement";
import Main  from "./pages/Main";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path={REGISTRATION_COMPONENT} element={<LectureReg />} />
        <Route path={LECTURE_LIST_COMPONENT} element={<LectureList />} />
        <Route path={LOGIN_COMPONENT} element={<Login />} />
        <Route path={SIGNUP_COMPONENT} element={<Register />} />
        <Route path={LIVE_QUESTIONS_COMPONENT} element={<LiveQuestions />} />

        {/* 소셜로그인*/}
        <Route path={REDIRECT_COMPONENT} element={<LoginHandeler />} />
        <Route path={SIGNUP_SOCIAL} element={<Social />} />
        <Route path="/test" element={<Test />} />
        {/* 테스트페이지 -> 실시간질문 페이지연동 예정 */}
        <Route
          path={PICK_QUESTIONS_COMPONENT} element={<QuestionCollection />}
        />
        <Route path={QR_CODE_COMPONENT} element={<LectureQR />} />
        <Route
          path={NON_LOGIN_QUESTION_COMPONENT} element={<NonLoginQuestion />}
        />
        <Route
          path={AUTH_MANAGEMENT_COMPONENT} element={<AuthorityManagement />}
        />
        <Route
          path={MAIN_COMPONENT} element={<Main/>}
        />

        {/* 접근권한이 없는경우 뜨는 페이지 */}
        <Route path={ERROR_COMPONENT} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
