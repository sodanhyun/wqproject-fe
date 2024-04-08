import { useEffect, useRef, useState } from "react";
import fetcher from "../fetcher.js";
import {
  LECTURE_HANDLE_API,
  LECTURE_IMAGE_API,
} from "../constants/api_constants.js";
import useStore from "../store.js";

const LectureReg = ({lCode, fetchLectureData, onClose}) => {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const { setShowDetailForm } = useStore((state) => state);
  const [title, setTitle] = useState(""); // 강의제목
  const [speaker, setSpeaker] = useState(""); // 강연자
  const [selectedStartTime, setSelectedStartTime] = useState(""); // 시작 시간
  const [selectedEndTime, setSelectedEndTime] = useState(""); // 종료 시간
  const [location, setLocation] = useState(""); //강의장소
  const [etc, setEtc] = useState(""); // 기타사항
  const [limitMin, setLimitMin] = useState(""); // 제한시간

  const imgRef = useRef();
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState("");

  const fetchLectureInfo = () => {
    fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`).then((res) => {
      lectureInfoHandler(res.data);
    });
  };

  const lectureInfoHandler = (lectureInfo) => {
    setTitle(lectureInfo.title);
    setSpeaker(lectureInfo.speaker);
    setSelectedStartTime(lectureInfo.sdate);
    setSelectedEndTime(lectureInfo.edate);
    setLocation(lectureInfo.location);
    setEtc(lectureInfo.etc);
    setLimitMin(lectureInfo.limitMin);
  };

  useEffect(() => {
    fetchLectureInfo();
  }, []);

  const imageURL =
    VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}`;
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgFile(file);
      setImgPreview(reader.result);
    };
  };
  const modifyLecture = () => {
    const formData = new FormData();
    const data = {
      title: title,
      speaker: speaker,
      sdate: selectedStartTime,
      edate: selectedEndTime,
      location: location,
      etc: etc,
      limitMin: limitMin,
    };
    formData.append(
      "post",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("image", imgFile);
    fetcher.patch(`${LECTURE_HANDLE_API}/${lCode}`, formData).then(() => {
      fetchLectureInfo();
      setShowDetailForm(true);
      fetchLectureData();
    });
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1  gap-y-8 pt-10 md:grid-cols-1 px-4">
        <form
          className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="Topic"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  강의제목
                </label>
                <div className="mt-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    name="Topic"
                    id="Topic"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="Title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  강연자
                </label>
                <div className="mt-2">
                  <input
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    type="text"
                    name="Title"
                    id="Title"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <span className="block text-sm font-medium leading-6 text-gray-900">
                  강의시간
                </span>
                <div className="mt-2 flex">
                  <input
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    type="datetime-local"
                    id="starttimepicker"
                    className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  ~
                  <input
                    value={selectedEndTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                    type="datetime-local"
                    id="endtimepicker"
                    className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="Place"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  강의장소
                </label>
                <div className="mt-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    name="Place"
                    id="Place"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="ETC"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  질문 제한시간(분)
                </label>
                <div className="mt-2">
                  <input
                    min="0"
                    type="number"
                    name="Place"
                    id="Place"
                    onChange={(e) => setLimitMin(e.target.value)}
                    value={limitMin}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
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
                  <textarea
                    value={etc}
                    onChange={(e) => setEtc(e.target.value)}
                    type="text-area"
                    name="ETC"
                    id="ETC"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="lectureImg"
                  className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900"
                >
                  이미지 업로드
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    id="lectureImg"
                    onChange={saveImgFile}
                    ref={imgRef}
                  />
                </label>
                <div className="mt-2 w-full">
                  <img
                    src={imageURL ? imgPreview || imageURL : imgPreview || null}
                    alt="강의 관련 이미지"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mb-3 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 border px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            onClick={() => modifyLecture(lCode)}
          >
            저장
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={() => setShowDetailForm(true)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
export default LectureReg;
