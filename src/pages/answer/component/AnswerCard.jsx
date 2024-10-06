import {useEffect, useRef, useState} from "react";
import fetcher from "../../../fetcher.js";
import {
  ANSWER_LIST_API,
  ANSWER_SUBSCRIBE,
  DELETE_ANSWER_SUBSCRIBE,
  UPDATE_ANSWER_SUBSCRIBE
} from "../../../constants/api_constants.js";
import {toast} from "react-toastify";
import AnswerComment from "./AnswerComment.jsx";
import AnswerTextArea from "./AnswerTextArea.jsx";
import * as StompJS from "@stomp/stompjs";

const { VITE_REACT_APP_API_WS_URL } = import.meta.env;

const AnswerCard = ({
                      disconnect,
                      data,
                      index,
                      answerPublish,
                      answerUpdate,
                      answerDelete
                    }) => {
  const [answer, setAnswer] = useState(""); // 답변
  const [answerList, setAnswerList] = useState([]); // 답변 리스트
  const [showMore, setShowMore] = useState(false);  // 더보기 상태
  const [showAnswerInput, setShowAnswerInput] = useState(
    Array(data.length).fill(false) // testimonials 배열 길이만큼 빈 배열을 만들어준다음 생성한 빈 배열의 모든 요소를 false로 채운다.
  );

  const client = useRef({});
  const localStorageToken = window.localStorage.getItem('access_token');

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

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
        subscribe();  // 연결 성공 시 구독
      },
    });
    client.current.activate();
  }

// --------------------- 구독 하기 --------------------- //
  const subscribe = () => {
    const handleSubscribe = (api, callback) => {
      client.current.subscribe(api, callback)
    }
    // 채택된 질문에 대한 답변 등록
    handleSubscribe(`${ANSWER_SUBSCRIBE}/${data.qcode}`, (message) => {
      const jsonMessage = JSON.parse(message.body);
      setAnswerList((list) => [...list, jsonMessage]);
    });
    // 답변 수정
    handleSubscribe(UPDATE_ANSWER_SUBSCRIBE, (message) => {
      const {aCode, content} = JSON.parse(message.body);
      console.log("수정", message.body)
      setAnswerList((list) =>
        list.map((answer) => answer.acode === aCode ? {...answer, content} : answer)
      );
    });
    // 답변 삭제
    handleSubscribe(DELETE_ANSWER_SUBSCRIBE, (message) => {
      console.log("삭제" , message.body);
      const {aCode} = JSON.parse(message.body);
      setAnswerList((list) =>
        list.filter((answer) => answer.acode !== aCode)
      );
      console.log("삭제코드", aCode)
    });
  }
  // ------------------------------------------------ //

  // 채택질문에 대한 답변 리스트
  const fetchAnswerList = (qCode) => {
    fetcher.get(`${ANSWER_LIST_API}/${qCode}`)
      .then((res) => setAnswerList(res.data));
    console.log("답변리스트",answerList);
  }
  // 답변 등록
  const clickSubmit = () => {
    if (answer === "") {
      toast.warning('답변을 입력해주세요.');
      return;
    }
    answerPublish(data.qcode, answer);
    toast.success('답변이 등록되었습니다.');
    setAnswer("");
  }
  // "답변" 클릭시 답변 & 입력창 보이기
  const handleAnswerClick = (index, qCode) => {
    const newShowAnswerInput = [...showAnswerInput];
    newShowAnswerInput[index] = !newShowAnswerInput[index];
    setShowAnswerInput(newShowAnswerInput);
    // 해당 질문 답변 리스트 받아오기
    fetchAnswerList(qCode);
  };

  return (
    <li key={data.acode}>
      <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
        <blockquote className="relative">
          <div className="flex justify-between">
            <div className="flex">
              <div className="font-bold text-base text-slate-900">
                {data.name === 'TEMP_WS_USER' ? '익명사용자' : data.name}
              </div>
            </div>
            <button
              className="rounded-md bg-gray-200 px-2 py-1 text-sm mr-3 font-semibold text-gray-600 hover:bg-gray-300 focus-visible:outline"
              onClick={() => handleAnswerClick(index, data.qcode)}
            >
              답변
            </button>
          </div>

          <p className="text-lg tracking-tight text-slate-900">
            {/* 더보기 상태가 true ? 전체 내용 보여주기 : 전체내용중 100자 까지만 보여줌 */}
            {showMore
              ? data.content
              : data.content.substring(0, 100)}
            {data.content.length > 100 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="font-bold"
              >
                {showMore ? "...숨기기" : "...더보기"}
              </button>
            )}
          </p>
        </blockquote>
        <figcaption className="relative mt-6 border-t border-slate-300 pt-2">
          {showAnswerInput[index] && (
            <div className="flex items-start ">
              <div className="min-w-0 flex-1">
                {answerList?.map((data) => {
                  return (
                    <>
                      <AnswerComment
                        key={data.acode}
                        data={data}
                        answerDelete={answerDelete}
                        answerUpdate={answerUpdate}
                      />
                    </>
                  )
                })}

                <AnswerTextArea
                  answer={answer}
                  setAnswer={setAnswer}
                  clickSubmit={clickSubmit}
                />
              </div>
            </div>
          )}
        </figcaption>
      </figure>
    </li>
  )
}
export default AnswerCard