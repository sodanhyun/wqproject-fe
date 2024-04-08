import { useRef, useState } from "react";
import fetcher from "../fetcher.js";
import { REGISTER_LECTURE_API } from "../constants/api_constants.js";
import { LECTURE_LIST_COMPONENT } from "../constants/component_constants";
import { Header } from "../components/Header.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LectureReg = () => {
  const [title, setTitle] = useState(""); // 강의제목
  const [speaker, setSpeaker] = useState(""); // 강연자
  const [selectedStartTime, setSelectedStartTime] = useState(""); // 시작 시간
  const [selectedEndTime, setSelectedEndTime] = useState(""); // 종료 시간
  const [location, setLocation] = useState(""); //강의장소
  const [etc, setEtc] = useState(""); // 기타사항
  const [limitMin,setLimitMin] = useState(""); // 제한시간
  const navigate = useNavigate();

  const imgRef = useRef();
  const [imgPreview, setImgPreview] = useState(""); // 이미지 미리보기
  const [imgFile, setImgFile] = useState("");


  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgFile(file);
      setImgPreview(reader.result);
    };
  };


  const resetInput = () => {
    setTitle("");
    setSpeaker("");
    setSelectedStartTime("");
    setSelectedEndTime("");
    setLocation("");
    setEtc("");
    setImgFile("");
    setImgPreview("");
    setLimitMin("");
  };

  const notify = () => toast.success("등록이 완료되었습니다.");

  const registerLecture = async () => {
    // 시작 날짜와 종료 날짜 비교
    if (new Date(selectedEndTime) < new Date(selectedStartTime)) {
      toast.error("강의 종료 날짜는 강의 시작 날짜보다 이후여야 합니다.", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!title || !speaker || !selectedStartTime || !selectedEndTime || !location || !limitMin) {
      toast.error("필수 항목을 모두 입력해주세요", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }


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
      new Blob([JSON.stringify(data)], {type: "application/json"})
    );
    // formData.append("post", JSON.stringify(data));
   
    formData.append("image", imgFile);

    try {
      await fetcher.post(REGISTER_LECTURE_API, formData);
      resetInput();
      notify();
      navigate(LECTURE_LIST_COMPONENT);
      console.log("여기",formData);
    } catch (error) {
      console.error("강의 등록 오류:", error);
    }
  };

  const handleEtcContChange = (e) => {
    const value = e.target.value;
    if (value.length > 300) {
      toast.warn("기타는 최대 250자까지 입력 가능합니다.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setEtc(value.slice(0, 250));
    } else {
      setEtc(value);
    }
  }; 
  return (
    <>
      <Header />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
              강의등록
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-10">
            {/* Your content */}
            <div className="space-y-10 divide-y divide-gray-900/10 flex justify-center">
            <div className="place-items-center max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <form
                  className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="px-4 py-6 sm:p-8 flex justify-center">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="Topic"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          <span className=" text-red-500">*</span>강의제목
                        </label>
                        <div className="mt-2">
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            name="Topic"
                            id="Topic"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="Title"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          <span className=" text-red-500">*</span>강연자
                        </label>
                        <div className="mt-2">
                          <input
                            value={speaker}
                            onChange={(e) => setSpeaker(e.target.value)}
                            type="text"
                            name="Title"
                            id="Title"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <span className="block text-sm font-medium leading-6 text-gray-900">
                        <span className=" text-red-500">*</span>강의시간
                        </span>
                        <div className="mt-2 flex">
                          <input
                            value={selectedStartTime}
                            onChange={(e) =>
                              setSelectedStartTime(e.target.value)
                            }
                            type="datetime-local"
                            id="starttimepicker"
                            className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-1.5"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                          ~
                          <input
                            value={selectedEndTime}
                            onChange={(e) => setSelectedEndTime(e.target.value)}
                            type="datetime-local"
                            id="endtimepicker"
                            className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-1.5"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="Place"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          <span className=" text-red-500">*</span>강의장소
                        </label>
                        <div className="mt-2">
                          <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            type="text"
                            name="Place"
                            id="Place"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          <span className=" text-red-500">*</span>질문 제한시간(분)
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
                            onChange={handleEtcContChange}
                            type="text-area"
                            name="ETC"
                            id="ETC"
                            autoComplete="street-address"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                          ></textarea>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
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
                          {imgPreview ? (
                            <img src={imgPreview} alt="강의 이미지" />
                          ) : (
                            <p>이미지 미리보기</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
                      onClick={registerLecture}
                      type="submit"
                      className="rounded-md bg-lightBlue px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      저장
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default LectureReg;
