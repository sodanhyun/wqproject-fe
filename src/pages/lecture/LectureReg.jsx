import { useRef, useState } from "react";
import fetcher from "../../fetcher.js";
import { REGISTER_LECTURE_API } from "../../constants/api_constants.js";
import { LECTURE_LIST_COMPONENT } from "../../constants/component_constants.js";
import { Header } from "../../components/common/Header.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

registerLocale("ko", ko)

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
  const [pendding, setPendding] = useState(false);
  const [validErr, setValidErr] = useState(false);

  const validateReq = () => {
    if (!reqData.title || !reqData.speaker || !reqData.sdate || !reqData.edate || !reqData.location || !reqData.limitMin) {
      toast.error("필수 항목을 모두 입력해주세요", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if(!validErr) setValidErr(true);
      return false;
    }
    if (reqData.edate <= reqData.sdate) {
      toast.error("강의 종료 날짜는 강의 시작 날짜보다 이후여야 합니다.", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if(!validErr) setValidErr(true);
      return false;
    }
    if(reqData.etc.length > 200) {
      toast.warn("기타는 최대 200자까지 입력 가능합니다.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      if(!validErr) setValidErr(true);
      return false;
    }
    setValidErr(false);
    return true;
  }

  const registerLecture = async (e) => {
    e.preventDefault();
    if(!validateReq()) return;
    let data = {...reqData};
    data = { ...data, ["sdate"]: getFormattedDate(reqData.sdate)};
    data = { ...data, ["edate"]: getFormattedDate(reqData.edate)};
    console.log(data)
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], {type: "application/json"}));
    formData.append("image", imgFile);
    setPendding(true);
    await fetcher.post(REGISTER_LECTURE_API, formData).then(() => {
      toast.success("등록이 완료되었습니다.");
      navigate(LECTURE_LIST_COMPONENT);
    }).catch ((err) => {
      console.error("강의 등록 오류:", err);
      setPendding(false);
    })
  };

  const onChangeHandler = (e) => {
    const {value, name} = e.target;
    setReqData({ ...reqData, [name]: value});
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

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <>
      <Header />
      {pendding && 
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
      }
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
              강의등록
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
            <div className="space-y-10 divide-y divide-gray-900/10 flex justify-center">
            <div className="place-items-center max-w-2xl lg:grid-cols-1 gap-x-6 gap-y-8 grid-cols-6">
                <form
                  className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl col-span-2"
                  onSubmit={registerLecture}
                >
                  <div className="px-4 py-6 p-8 flex justify-center">
                    <div className="grid max-w-2xl gap-x-6 gap-y-8 grid-cols-6">
                      <div className="col-span-3">
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
                            className={`${(validErr && !reqData.title) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6`}
                          />
                        </div>
                      </div>

                      <div className="col-span-3">
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
                            className={`${(validErr && !reqData.speaker) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <span className="block text-sm font-medium leading-6 text-gray-900">
                        <span className=" text-red-500">*</span>강의시간
                        </span>
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                        className={`${(validErr && (!reqData.sdate || reqData.edate <= reqData.sdate)) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
                          showTimeSelect
                          dateFormat="yyyy/MM/dd a hh:mm"
                          dateFormatCalendar="yyyy년 MM월"
                          timeFormat="HH:mm"
                          timeCaption="시작시간"
                          placeholderText="시작일을 입력하십시오"
                          selected={reqData.sdate}
                          onChange={(sdate) => {setReqData({ ...reqData, ["sdate"]: sdate})}}
                          locale="ko"
                          timeIntervals={5}
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                        className={`${(validErr && (!reqData.edate || reqData.edate <= reqData.sdate)) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
                          showTimeSelect
                          dateFormat="yyyy/MM/dd a hh:mm"
                          dateFormatCalendar="yyyy년 MM월"
                          timeFormat="HH:mm"
                          timeCaption="종료시각"
                          placeholderText="종료일을 입력하십시오"
                          selected={reqData.edate}
                          onChange={(edate) => {setReqData({ ...reqData, ["edate"]: edate})}}
                          locale="ko"
                          timeIntervals={5}
                        />
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
                            className={`${(validErr && !reqData.location) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
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
                            className={`${(validErr && !reqData.limitMin) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
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
                            onChange={onChangeHandler}
                            type="text-area"
                            name="etc"
                            id="ETC"
                            autoComplete="street-address"
                            className={`${(validErr && reqData.etc.length>200) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm leading-6`}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <label
                          htmlFor="lectureImg"
                          className="cursor-pointer group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900"
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
                      className="rounded-md bg-lightBlue px-3 py-2 text-sm font-semibold text-blue-700 shadow-md hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      등록
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
