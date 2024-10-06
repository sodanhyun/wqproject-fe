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
import LectureReg from "./pages/lecture/LectureReg.jsx";
import LectureList from "./pages/lecture/LectureList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";
import Regist from "./pages/account/Regist";
import LectureQR from "./pages/lecture/LectureQR";
import LoginHandeler from "./pages/auth/component/LoginHandeler";
import Social from "./pages/auth/Social";
import {QuestionCollection} from "./pages/answer/QuestionCollection.jsx";
import LiveQuestions from "./pages/question/LiveQuestions.jsx";
import NotFound from "./pages/NotFound";
import NonLoginQuestion from "./pages/question/NonLoginQuestion";
import AuthorityManagement from "./pages/account/AuthorityManagement";
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
        <Route path={SIGNUP_COMPONENT} element={<Regist />} />
        <Route path={LIVE_QUESTIONS_COMPONENT} element={<LiveQuestions />} />
        <Route path={REDIRECT_COMPONENT} element={<LoginHandeler />} />
        <Route path={SIGNUP_SOCIAL} element={<Social />} />
        <Route path={PICK_QUESTIONS_COMPONENT} element={<QuestionCollection />}/>
        <Route path={QR_CODE_COMPONENT} element={<LectureQR />} />
        <Route path={NON_LOGIN_QUESTION_COMPONENT} element={<NonLoginQuestion />}/>
        <Route path={AUTH_MANAGEMENT_COMPONENT} element={<AuthorityManagement />}/>
        <Route path={MAIN_COMPONENT} element={<Main/>}/>
        <Route path={ERROR_COMPONENT} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
