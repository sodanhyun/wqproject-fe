import {Header} from "../../components/common/Header.jsx";
import {Container} from "../../components/common/Container.jsx";
import {useEffect, useRef, useState} from "react";
import * as StompJS from "@stomp/stompjs";
import fetcher from "../../fetcher.js";
import {
  ANSWER_PUBLISH,
  DELETE_ANSWER_PUBLISH,
  LECTURE_HANDLE_API,
  PICK_SUBSCRIBE,
  PICKED_QUESTION_LIST_API,
  UPDATE_ANSWER_PUBLISH,
} from "../../constants/api_constants.js";
import AnswerCard from "./component/AnswerCard.jsx";
import {useParams} from "react-router-dom";

const { VITE_REACT_APP_API_WS_URL } = import.meta.env;

export function QuestionCollection() {
  const [pickedList, setPickedList] = useState([]);
  const [lectureTitle, setLectureTitle] = useState("강의를 선택하세요");

  const {lCode} = useParams(); // 강의 식별자 URL 파라미터로 받아오기
  const client = useRef({});
  const localStorageToken = window.localStorage.getItem('access_token');

  useEffect(() => {
    fetchPickedList();
    fetchLectureInfo();
    connect();
    return () => disconnect();
  }, [lCode]);

  // 채택된 질문 리스트
  const fetchPickedList = () => {
    fetcher.get(`${PICKED_QUESTION_LIST_API}/${lCode}`)
      .then((res) => setPickedList(res.data));
  }

  // 선택한 강의정보 불러와서 제목 지정
  const fetchLectureInfo = () => {
    fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`)
      .then((res) => setLectureTitle(res.data.title));
  };

  // 웹소켓 연결
  const connect = () => {
    client.current = new StompJS.Client({
      brokerURL: `${VITE_REACT_APP_API_WS_URL}`,
      connectHeaders: {
        Authorization: 'Bearer ' + localStorageToken
      },
      onWebSocketError: (frame) => {
        console.log(frame);
      },
      onConnect: () => {
        console.log("연결 성공 ^_^");
        subscribePickQuestion();  // 연결 성공 시 구독
      },
    });
    client.current.activate();
  }
  // 연결 끊김
  const disconnect = () => {
    client.current.deactivate()
      .then(() => console.log("연결 끊김 ㅠ.ㅠ"));
  };

  // 질문 채택 구독
  const subscribePickQuestion = () => {
    client.current.subscribe(PICK_SUBSCRIBE, (message) => {
      const jsonMessage = JSON.parse(message.body);
      const {qcode} = JSON.parse(message.body);
      setPickedList((list) => list.some((answer) => answer.qcode === qcode)
        ? list.filter((answer) => answer.qcode !== qcode)
        : [...list, jsonMessage]
      );
    });
  };

  // --------------------- 전송 하기 --------------------- //
  const handlePublish = (destination, payload) => {
    if (!client.current.connected) return; // 연결되지 않았을 경우 보내지 않음
    client.current.publish({
      destination: destination,
      body: JSON.stringify(payload)
    })
  }
  // 답변 등록
  const answerPublish = (qCode, answer) => {
    handlePublish(ANSWER_PUBLISH, {qCode: qCode, content: answer})
  };
  // 답변 수정
  const answerUpdate = (aCode, answer) => {
    handlePublish(UPDATE_ANSWER_PUBLISH, {aCode: aCode, content: answer})
  };
  // 답변 삭제
  const answerDelete = (aCode) => {
    handlePublish(DELETE_ANSWER_PUBLISH, {aCode: aCode})
    console.log("답변 삭제하기", aCode)
  };

  return (
    <>
      <Header/>
      <section
        id="testimonials"
        aria-label="What our customers are saying"
        className="bg-slate-50 sm:py-10 h-screen"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-4xl">
              {lectureTitle}
            </h2>
          </div>
          <ul
            role="list"
            className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
          >
            {pickedList.map((data, index) => {
              return (
                <AnswerCard
                  connect = {connect}
                  disconnect={disconnect}
                  key={data.qcode}
                  data={data}
                  index={index}
                  answerPublish={answerPublish}
                  answerUpdate={answerUpdate}
                  answerDelete={answerDelete}
                />
              )
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
