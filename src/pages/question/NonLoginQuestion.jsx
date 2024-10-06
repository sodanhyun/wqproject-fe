import { Button } from "../../components/common/Button.jsx";
import { Container } from "../../components/common/Container.jsx";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  QUESTION_PUBLISH, QUESTION_SUBSCRIBE,
} from "../../constants/api_constants.js";
import { QUESTION_LIMIT_API } from "../../constants/api_constants.js";
import * as StompJS from "@stomp/stompjs";
import { toast } from "react-toastify";
import fetcher from "../../fetcher.js";
const { VITE_REACT_APP_API_WS_URL } = import.meta.env;

function SwirlyDoodle(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  );
}

export default function NonLoginQuestion() {
  const textareaRef = useRef(null);
  const { lCode } = useParams();
  const client = useRef({});
  const localStorageToken = window.localStorage.getItem("access_token");

  // ---------질문 등록 마지막 시간 로컬스토리지 저장 후 5분 타이머---------- //
  const [lastQuestionTime, setLastQuestionTime] = useState(null); // 마지막으로 질문을 등록한 시간을 저장
  const [buttonDisabled, setButtonDisabled] = useState(true); // 새로운 질문하기 버튼 활성/비활성 상태를 저장
  const [buttonText, setButtonText] = useState("새로운 질문하기"); // 새로운 질문하기 버튼에 표시될 텍스트 저장
  const [active, setActive] = useState(false);
  const [limitMin, setLimitMin] = useState(0); // 제한시간
  const [lectureTitle, setLectureTitle] = useState("");
  
  useEffect(() => {
    fetchLectureInfo();
    connect();
    return () => disconnect();
  }, []);

  const fetchLectureInfo = () => {
    fetcher.get(`${QUESTION_LIMIT_API}/${lCode}`).then((res) => {
      setLectureTitle(res.data.title);
      setActive(res.data.active);
      setLimitMin(res.data.limitMin);
      console.log(res.data)
    });
  };

  useEffect(() => {
    let timer;
    let limitTime = localStorage.getItem("limitMin");
    if (lastQuestionTime) {
      timer = setInterval(() => {
        const timePassedInMinutes = Math.floor(
          (new Date() - lastQuestionTime) / (1000*60)
        );
        if (timePassedInMinutes >= limitTime) {
          setButtonDisabled(false);
          setButtonText("새로운 질문하기");
          clearInterval(timer);
        } else {
          setButtonDisabled(true);
          const timeLeftInMinutes = Math.ceil(limitTime - timePassedInMinutes);
          setButtonText(`다시 질문 가능까지 ${timeLeftInMinutes}분 남음`);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lastQuestionTime]);
  //----------------------------------------------------------//

 

  const connect = () => {
    client.current = new StompJS.Client({
      brokerURL: `${VITE_REACT_APP_API_WS_URL}`,
      connectHeaders: {
        Authorization: "Bearer " + localStorageToken,
      },
      onWebSocketError: (frame) => {
        console.log(frame);
      },
      onConnect: () => {
        console.log("연결 성공 ^_^");
        subscribe(); // 연결 성공 시 구독
      },
    });
    client.current.activate();
  };
  // 연결 끊김
  const disconnect = () => {
    client.current.deactivate().then(() => console.log("연결 끊김 ㅠ.ㅠ"));
  };

  const subscribe = () => {
    const handleSubscribe = (api, callback) => {
      client.current.subscribe(api, callback);
    };
    // 질문
    handleSubscribe(`${QUESTION_SUBSCRIBE}/${lCode}`, (message) => {
      if (message.body == "해당 강의는 비활성화 상태입니다.") {
        toast.warning("비활성화된 강의에는 질문을 등록할 수 없습니다", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }else {
        toast.success("질문이 성공적으로 전송되었습니다!", {
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  }

  // -----------질문 전송-----------
  const handlePublish = (destination, payload) => {
    if (!client.current.connected) {
      toast.warning("연결이 끊어졌습니다 새로고침으로 재접속 바랍니다", {
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      localStorage.removeItem("lastQuestionTime");
      return false;
    } // 연결되지 않았을 경우 보내지 않음
    client.current.publish({
      destination: destination,
      body: JSON.stringify(payload),
    });
    return true;
  };

  const questionPublish = (message) => {
    if(handlePublish(QUESTION_PUBLISH, { lCode: lCode, content: message })) {
      return true;
    }
    return false;
  };

  const handleQuestionSubmit = () => {
    if (!client.current) return;

    const content = textareaRef.current.value; // content 값은 질문 내용으로 설정

    if (content.trim() === "") {
      // 입력값이 비어있는지 확인
      toast.warning("질문을 입력해주세요.", {
        // 알림 띄우기
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    console.log("질문:", content);

    if(questionPublish(content)) {
      // 입력창 초기화
      textareaRef.current.value = "";

      const currentTime = new Date();
      // 현재 시간 저장
      setLastQuestionTime(currentTime);
      localStorage.setItem("lastQuestionTime", currentTime.toISOString());
      localStorage.setItem("limitMin", limitMin);
    } // 질문 내용 전송
  };

  // 페이지 접속시 토큰 저장
  useEffect(() => {
    const savedLastQuestionTime = new Date(
      localStorage.getItem("lastQuestionTime")
    );
    if (savedLastQuestionTime.toString() !== "Invalid Date") {
      setLastQuestionTime(savedLastQuestionTime);
    }
  }, []);


  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className=" py-20 sm:py-32 bg-slate-50 h-screen"
    >
      <Container>
        <div className="text-center">
          {/* <h2 className="font-display text-3xl tracking-tight text-black sm:text-3xl mb-10">
            코드하우스 면접 특강
          </h2> */}
          <h1 className="font-display text-4xl tracking-tight text-black font-bold sm:text-4xl text-center mb-6">{lectureTitle}</h1>
          <h2 className="font-display text-2xl tracking-tight text-black sm:text-3xl text-center">
            <span className="relative whitespace-nowrap">
              <SwirlyDoodle className="absolute left-0 top-1/2 h-[1em] w-full fill-blue-400" />
              <span className="relative text-black">궁금한점을</span>
            </span>{" "}
            질문해주세요
          </h2>
          <p className="mt-4 text-lg text-slate-400 text-center">
            소셜 로그인을 하지 않으면 다른 사람이 등록한 질문을 볼 수 없습니다.
          </p>
        </div>
        <div className=" mt-10 grid grid-cols-1 lg:grid-cols-1 justify-center">
          <section className="flex flex-col  px-6 sm:px-8 order-first rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10-8 lg:order-nonelg:py-8">
            <div className="mt-5 font-display text-lg text-black">
              <div>
                <div className="mt-2">
                  <textarea
                    ref={textareaRef}
                    rows={4}
                    name="comment"
                    id="comment"
                    placeholder="질문을 보내고 나면 제한시간 동안 전송할 수 없습니다."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>

            <p className="order-first font-display text-xl font-base tracking-tight text-black text-center">
              질문을 입력해주세요
            </p>

            <Button
              color={buttonDisabled ? "gray" : "blue"}
              className="mt-8"
              onClick={handleQuestionSubmit}
              disabled={buttonDisabled}
            >
              {active ? buttonText : "종료되었거나 예정인 강의입니다."}
            </Button>
          </section>
        </div>
      </Container>
    </section>
  );
}
