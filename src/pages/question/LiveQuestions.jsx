import { Container } from "../../components/common/Container.jsx";
import { Button } from "../../components/common/Button.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import Toggle from "./component/Toggle.jsx";
import Sort from "./component/Sort.jsx";
import CreateQuestionModal from "./modal/CreateQuestionModal.jsx";
import { useParams } from "react-router-dom";
import * as StompJS from "@stomp/stompjs";
import fetcher from "../../fetcher.js";
import {
  DELETE_QUESTION_PUBLISH,
  DELETE_QUESTION_SUBSCRIBE,
  LIKE_PUBLISH,
  LIKE_SUBSCRIBE,
  PICK_PUBLISH,
  PICK_SUBSCRIBE,
  QUESTION_LIST_API,
  QUESTION_PUBLISH,
  QUESTION_SUBSCRIBE,
  UPDATE_QUESTION_PUBLISH,
  UPDATE_QUESTION_SUBSCRIBE,
  QUESTION_ACTIVE_API,
  QUESTION_LIMIT_API,
} from "../../constants/api_constants.js";
import MyQuestionCard from "./component/MyQuestionCard.jsx";
import PickedCard from "./component/PickedCard.jsx";
import QuestionCard from "./component/QuestionCard.jsx";
import {toast} from "react-toastify";
import { USER_ID, USER_ROLE } from "../../constants/localstorage_constants.js";
import LogoutLink from "../auth/component/LogoutLink.jsx";

const { VITE_REACT_APP_API_WS_URL } = import.meta.env;
const LiveQuestions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [lectureTitle, setLectureTitle] = useState(null);
  const [questionsList, setQuestionsList] = useState([]); // 질문 리스트
  const [sortSelect, setSortSelect] = useState("시간순"); // 시간순, 공감순 선택상태 (true : 시간순)
  const [toggle, setToggle] = useState(false); // 내 질문 보기 토글
  const { lCode } = useParams(); // 강의 식별자 URL 파라미터로 받아오기
  const client = useRef({});
  const myId = localStorage.getItem(USER_ID);
  const [active, setActive] = useState(false);
  const [limitMin, setLimitMin] = useState(null); // 제한시간
  // ---------질문 등록 마지막 시간 로컬스토리지 저장 후 5분 타이머---------- //
  const [lastQuestionTime, setLastQuestionTime] = useState(null); // 마지막으로 질문을 등록한 시간을 저장
  const [buttonDisabled, setButtonDisabled] = useState(true); // 새로운 질문하기 버튼 활성/비활성 상태를 저장
  const [buttonText, setButtonText] = useState("새로운 질문하기"); // 새로운 질문하기 버튼에 표시될 텍스트 저장
  
  useEffect(() => {
    // 선택한 강의정보 불러와서 제목 지정
    const fetchLectureInfo = () => {
      fetcher.get(`${QUESTION_LIMIT_API}/${lCode}`).then((res) => {
        setLectureTitle(res.data.title);
        setLimitMin(res.data.limitMin);
      });
    };
    // 강의의 active 상태를 설정
    const fetchActive = () => {
      fetcher.get(`${QUESTION_ACTIVE_API}/${lCode}`).then((res) => {
        setActive(res.data); 
      });
    };
    // 처음 렌더링 할 떄 질문리스트 받아오기
    const fetchQuestionList = () => {
      fetcher.get(`${QUESTION_LIST_API}/${lCode}`).then((res) =>
        setQuestionsList(res.data)
      );
    };
    fetchLectureInfo();
    fetchActive();
    fetchQuestionList();
    connect();
    return () => disconnect();
  }, []);

    // 페이지 새로고침 후 마지막 질문 시간 복구 기능
  useEffect(() => {
    const savedLastQuestionTime = new Date(localStorage.getItem("lastQuestionTime"));
    if (savedLastQuestionTime) setLastQuestionTime(savedLastQuestionTime);
  }, []);

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

  useEffect(() => {
    // 질문리스트 정렬
    sortQuestionList();
  }, [sortSelect]);

  const sortQuestionList = useCallback(() => {
    const newArray = [...questionsList];
    const sortedArray =
      sortSelect === "시간순"
        ? newArray.sort((a, b) => {
            const aNumber = parseInt(a.qcode.split("Q")[1]);
            const bNumber = parseInt(b.qcode.split("Q")[1]);
            return bNumber - aNumber;
          }) // 시간순 정렬
        : newArray.sort((a, b) => {
            if (b.likesCount === a.likesCount) {
              const aNumber = parseInt(a.qcode.split("Q")[1]);
              const bNumber = parseInt(b.qcode.split("Q")[1]);
              return bNumber - aNumber;
            }
            return b.likesCount - a.likesCount;
          }); // 공감순 정렬
    setQuestionsList(sortedArray);
  });

  // 웹소켓 연결
  const connect = () => {
    client.current = new StompJS.Client({
      brokerURL: `${VITE_REACT_APP_API_WS_URL}`,
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

  // --------------------- 구독 하기 --------------------- //
  const subscribe = () => {
    const handleSubscribe = (api, callback) => {
      client.current.subscribe(api, callback);
    };
    // 질문
    handleSubscribe(`${QUESTION_SUBSCRIBE}/${lCode}`, (message) => {
      if(message.body=="해당 강의는 비활성화 상태입니다.") {
        toast.warning("비활성화된 강의에는 질문을 등록할 수 없습니다", {
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }else {
        const jsonMessage = JSON.parse(message.body);
        setQuestionsList((list) => [jsonMessage, ...list]);
      }
    });
    // 질문 수정
    handleSubscribe(UPDATE_QUESTION_SUBSCRIBE, (message) => {
      const { qCode, content } = JSON.parse(message.body);
      setQuestionsList((list) =>
        list.map((question) =>
          question.qcode === qCode ? { ...question, content } : question
        )
      );
    });
    // 질문 삭제
    handleSubscribe(DELETE_QUESTION_SUBSCRIBE, (message) => {
      const { qCode } = JSON.parse(message.body);
      setQuestionsList((list) =>
        list.filter((question) => question.qcode !== qCode)
      );
    });
    // 좋아요
    handleSubscribe(LIKE_SUBSCRIBE, (message) => {
      const { qCode, like } = JSON.parse(message.body);
      setQuestionsList((list) =>
        list.map((question) =>
          question.qcode === qCode
            ? {
                ...question,
                likesCount: like
                  ? question.likesCount + 1
                  : question.likesCount - 1,
              }
            : question
        )
      );
    });
    // 질문 채택
    handleSubscribe(PICK_SUBSCRIBE, (message) => {
      const { qcode, pick } = JSON.parse(message.body);
      setQuestionsList((list) =>
        list.map((question) =>
          question.qcode === qcode ? { ...question, pick: pick } : question
        )
      );
    });
  };
  // --------------------- 전송 하기 --------------------- //
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
  // 질문 등록
  const questionPublish = (message) => {
    if(handlePublish(QUESTION_PUBLISH, { lCode: lCode, content: message })) {
      const currentTime = new Date();
      setLastQuestionTime(currentTime);
      localStorage.setItem("lastQuestionTime", currentTime.toString());
      localStorage.setItem("limitMin", limitMin);
    }
  };

  // 질문 수정
  const questionUpdate = (code, message) => {
    handlePublish(UPDATE_QUESTION_PUBLISH, { qCode: code, content: message });
  };
  // 질문 삭제
  const questionDelete = (code) => {
    handlePublish(DELETE_QUESTION_PUBLISH, { qCode: code });
  };
  // 좋아요
  const clickLike = (code) => {
    handlePublish(LIKE_PUBLISH, { qCode: code });
  };
  // 질문채택
  const clickPick = (code) => {
    handlePublish(PICK_PUBLISH, { qCode: code });
  };

  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32 pb-96"
    >
      <Container>
        <div className="flex justify-end">
          <LogoutLink>로그아웃</LogoutLink>
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl mb-4">
            {lectureTitle}
          </h2>
          <Button
            color={!active || buttonDisabled ? "gray" : "blue"}
            onClick={() => active && !buttonDisabled && setModalOpen(true)}
            disabled={!active || buttonDisabled}
          >
            {active ? buttonText : "종료되었거나 예정인 강의입니다."}
          </Button>

          <div className="flex justify-between">
            <Sort setSortSelect={setSortSelect} />
            <Toggle enabled={toggle} setEnabled={setToggle} />
          </div>
          {modalOpen && (
            <CreateQuestionModal
              onClose={() => setModalOpen(false)}
              questionPublish={questionPublish}
            />
          )}
        </div>
      </Container>

      <Container>
        <ul
          role="list"
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {toggle ? (
            questionsList.filter((data) => data.userId === myId).length > 0 ? (
              questionsList.filter((data) => data.userId === myId)
                .map((data) =>
                  data.isPicked ? (
                    <PickedCard
                      key={data.qcode}
                      data={data}
                      role={localStorage.getItem(USER_ROLE)}
                      clickLike={clickLike}
                      clickPick={clickPick}
                    />
                  ) : (
                    <MyQuestionCard
                      key={data.qcode}
                      data={data}
                      role={localStorage.getItem(USER_ROLE)}
                      questionUpdate={questionUpdate}
                      questionDelete={questionDelete}
                    />
                  ))
            ) : (
              <div className="col-span-full flex justify-center">
                <p className="text-2xl text-center grid max-w-2xl grid-cols-1 gap-6 text-slate-400">
                  등록된 질문이 없어요!<br></br> 질문을 등록하세요
                </p>
              </div>
            )
          ) : questionsList.length > 0 ? (
            questionsList.map((data) =>
              data.isPicked ? (
                <PickedCard
                  key={data.qcode}
                  data={data}
                  role={localStorage.getItem(USER_ROLE)}
                  clickLike={clickLike}
                  clickPick={clickPick}
                />
              ) : data.userId === myId ? (
                <MyQuestionCard
                  key={data.qcode}
                  data={data}
                  role={localStorage.getItem(USER_ROLE)}
                  questionUpdate={questionUpdate}
                  questionDelete={questionDelete}
                />
              ) : (
                <QuestionCard
                  key={data.qcode}
                  data={data}
                  role={localStorage.getItem(USER_ROLE)}
                  clickLike={clickLike}
                  clickPick={clickPick}
                  questionDelete={questionDelete}
                />
              )
            )
          ) : (
            <div className="col-span-full flex justify-center">
              <p className="text-2xl text-center grid max-w-2xl grid-cols-1 gap-6 text-slate-400">
                등록된 질문이 없어요! <br></br>질문을 등록하세요
              </p>
            </div>
          )}
        </ul>
      </Container>
    </section>
  );
};
export default LiveQuestions;
