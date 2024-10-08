import { useCallback, useEffect, useState } from "react";
import fetcher from "../../../fetcher.js";
import {
  LECTURE_HANDLE_API,
  LECTURE_IMAGE_API,
} from "../../../constants/api_constants.js";
import useStore from "../../../store.js";

const LectureDetail = ({ lCode, onClose }) => {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const { setShowDetailForm } = useStore((state) => state);
  const [lectureData, setLectureData] = useState({});
  const [noImage, setNoImage] = useState(false);

  useEffect(() => {
    const fetchLectureInfo = () => {
      fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`).then((res) => {
        setLectureData(res.data);
      });
    };
    fetchLectureInfo();
  }, []);

  const getFormattedDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  });

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-1 px-4">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="Topic"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                강의제목
              </label>
              <div className="mt-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
                  {lectureData.title}
                </h1>
              </div>
            </div>

            <div className="col-span-full">
              {noImage ? (
                <p>첨부된 파일이 없습니다.</p>
              ) : (
                <img 
                src={`${VITE_REACT_APP_API_BASE_URL}${LECTURE_IMAGE_API}/${lCode}`}
                alt="Lecture" 
                onError={() => {setNoImage(true)}} />
              )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="Title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                강연자
              </label>
              <div className="mt-2">
                <p>{lectureData.speaker}</p>
              </div>
            </div>

            <div className="col-span-full">
              <span className="block text-sm font-medium leading-6 text-gray-900">
                강의시간
              </span>
              <div className="mt-2 flex flex-col">
                <p>{getFormattedDate(lectureData.sdate)}</p>~<p>{getFormattedDate(lectureData.edate)}</p>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="Place"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                강의장소
              </label>
              <div className="mt-2">
                <p>{lectureData.location}</p>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="ETC"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                질문 제한시간
              </label>
              <div className="mt-2">
                <p>{lectureData.limitMin}분</p>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="ETC"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                기타사항
              </label>
              <div className="mt-2">
                <p>{lectureData.etc}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mb-3 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 border px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            onClick={() => setShowDetailForm(false)}
          >
            수정
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default LectureDetail;
