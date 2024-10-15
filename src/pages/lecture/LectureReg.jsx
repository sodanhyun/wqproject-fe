import { useRef, useState } from "react";
import fetcher from "../../fetcher.js";
import { REGISTER_LECTURE_API } from "../../constants/api_constants.js";
import { LECTURE_LIST_COMPONENT } from "../../constants/component_constants.js";
import { Header } from "../../components/common/Header.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LectureReg = () => {
  const navigate = useNavigate();
  const imgRef = useRef();
  const [reqData, setReqData] = useState({
    title: "",
    speaker: "",
    sdate: "",
    edate: "",
    location: "",
    etc: "",
    limitMin: 0,
  });
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState("");

  const registerLecture = async (e) => {
    e.preventDefault();
    if (!reqData.title || !reqData.speaker || !reqData.sdate || !reqData.edate || !reqData.location || !reqData.limitMin) {
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
    formData.append("data", new Blob([JSON.stringify(reqData)], {type: "application/json"}));
    formData.append("image", imgFile);
    try {
      await fetcher.post(REGISTER_LECTURE_API, formData);
      toast.success("등록이 완료되었습니다.");
      navigate(LECTURE_LIST_COMPONENT);
    } catch (error) {
      console.error("강의 등록 오류:", error);
    }
  };

  const onChangeHandler = (e) => {
    const {value, name} = e.target;
    if(name==="edate" || name==="sdate") {
      const edate = name==='edate' ? new Date(value) : new Date(reqData.edate);
      const sdate = name==='sdate' ? new Date(value) : new Date(reqData.sdate);
      if (edate!=new Date("") && sdate!=new Date("") && edate < sdate) {
        toast.error("강의 종료 날짜는 강의 시작 날짜보다 이후여야 합니다.", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    setReqData({ ...reqData, [name]: value});
  };

  const onEtcChange = (e) => {
    const {value, name} = e.target;
    if (value.length > 250) {
      toast.warn("기타는 최대 250자까지 입력 가능합니다.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setReqData({ ...reqData, [name]: value.slice(0, 250)});
    } else {
      setReqData({ ...reqData, [name]: value});
    }
  }; 

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgFile(file);
      setImgPreview(reader.result);
    };
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
            <div className="space-y-10 divide-y divide-gray-900/10 flex justify-center">
            <div className="place-items-center max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <form
                  className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2"
                  onSubmit={registerLecture}
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
                            value={reqData.title}
                            onChange={onChangeHandler}
                            type="text"
                            name="title"
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
                            value={reqData.speaker}
                            onChange={onChangeHandler}
                            type="text"
                            name="speaker"
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
                        <div className="mt-2">
                          <div>
                            <label
                              htmlFor="starttimepicker"
                              className="inline-block text-sm font-medium leading-6 text-gray-900">
                              시작
                              <input
                                value={reqData.sdate}
                                onChange={onChangeHandler}
                                name="sdate"
                                type="datetime-local"
                                id="starttimepicker"
                                className="sm:min-w-8 inline-block ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-1.5 sm:"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </label>
                          </div>
                          <div className="mt-3">
                            <label
                              htmlFor="endtimepicker"
                              className="inline-block text-sm font-medium leading-6 text-gray-900">
                              종료
                              <input
                                value={reqData.edate}
                                onChange={onChangeHandler}
                                name="edate"
                                type="datetime-local"
                                id="endtimepicker"
                                className="inline-block ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-1.5"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </label>
                          </div>
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
                            value={reqData.location}
                            onChange={onChangeHandler}
                            type="text"
                            name="location"
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
                            name="limitMin"
                            id="Place"
                            onChange={onChangeHandler}
                            value={reqData.limitMin}
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
                            value={reqData.etc}
                            onChange={onEtcChange}
                            type="text-area"
                            name="etc"
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
                          {imgPreview && <img src={imgPreview} alt="강의 이미지" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
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
