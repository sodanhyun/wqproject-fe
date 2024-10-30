import { useEffect, useState } from "react";
import fetcher from "../../../fetcher.js";
import {
  LECTURE_HANDLE_API,
  LECTURE_IMAGE_API,
} from "../../../constants/api_constants.js";
import useStore from "../../../store.js";
import { toast } from "react-toastify";

const LectureModifyForm = ({lCode, fetchLectureData, onClose}) => {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const { setShowDetailForm } = useStore((state) => state);
  const [reqData, setReqData] = useState({
    title: "",
    speaker: "",
    sdate: "",
    edate: "",
    location: "",
    etc: "",
    limitMin: 0,
  });
  const [imageSrc, setImageSrc] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile, setImgFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendding, setPendding] = useState(false);
  const [validErr, setValidErr] = useState(false);
  const [dragging, setDragging] = useState(false);

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

  useEffect(() => {
    const fetchLectureInfo = async () => {
      await fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`).then((res) => {
        fetcher.get(VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}?thumbs=Y`, {
          responseType: 'blob'
        })
        .then((img) => {
          const imgUrl = URL.createObjectURL(img.data);
          setImageSrc(imgUrl);
        }).catch((err) => {
          setImageSrc("");
        }).finally(() => {
          setLoading(false);
        })
        setReqData(res.data);
      });
    };
    fetchLectureInfo();
  }, []);
  
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

  const saveImgFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgFile(file);
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgFile(file);
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivClick = () => {
    document.getElementById('file-upload').click();
  };


  const modifyLecture = () => {
    if(!validateReq()) return;
    const formData = new FormData();
    formData.append("data",
      new Blob([JSON.stringify(reqData)], { type: "application/json" }));
    formData.append("image", imgFile);
    setPendding(true);
    fetcher.patch(`${LECTURE_HANDLE_API}/${lCode}`, formData).then(() => {
      setShowDetailForm(true);
      fetchLectureData && fetchLectureData();
    }).catch((err) => {
      setPendding(false);
    });
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      {pendding && 
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
      }
      {loading ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
      <div className="grid grid-cols-1 gap-y-2 px-2 py-2">
        <form
          className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl px-2 py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="px-4 py-4">
            <div className="grid max-w-2xl grid-cols-6 gap-y-2 gap-x-3 lg:gap-y-6">
            <div className="col-span-full sm:col-span-full">
              <label
              className="block text-sm font-medium leading-6 text-gray-900"
              >
              대표 이미지
              </label>
              <div className="flex justify-center">
                <div className={`border-2 border-dashed rounded-lg mt-2 p-4 w-64 flex justify-center ${
                    dragging ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleDivClick}
                  >
                  {imgPreview ? <img src={imgPreview} alt="업로드 이미지" />
                  : (imageSrc ? <img src={imageSrc} alt="기존 이미지" />
                  : <p className="text-center text-gray-500">이미지를 드래그하거나 클릭하여 사진을 업로드하세요.</p>)}
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    onChange={saveImgFile}
                  />
                </div>
              </div>
            </div>
              <div className="col-span-3">
                <label
                  htmlFor="Topic"
                  className="block text-sm font-black leading-6"
                >
                  강의제목
                </label>
                <div className="mt-2">
                  <input
                    value={reqData.title}
                    onChange={onChangeHandler}
                    type="text"
                    name="title"
                    id="Topic"
                    autoComplete="given-name"
                    className={`${(validErr && !reqData.title) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="Title"
                  className="block text-sm font-black leading-6"
                >
                  강연자
                </label>
                <div className="mt-2">
                  <input
                    value={reqData.speaker}
                    onChange={onChangeHandler}
                    type="text"
                    name="speaker"
                    id="Title"
                    autoComplete="family-name"
                    className={`${(validErr && !reqData.speaker) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div className="col-span-6">
                <span className="block text-sm font-black leading-6">
                  강의시간
                </span>
                <div className="mt-2">
                  <div>
                    <label
                      htmlFor="starttimepicker"
                      className="block text-sm font-black leading-6">
                      시작
                      <input
                        value={reqData.sdate}
                        onChange={onChangeHandler}
                        name="sdate"
                        type="datetime-local"
                        id="starttimepicker"
                        className={`${(validErr && (!reqData.sdate || reqData.edate <= reqData.sdate)) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 ml-2 inline-block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5`}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </label>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="endtimepicker"
                      className="block text-sm font-black leading-6">
                      종료
                      <input
                        value={reqData.edate}
                        onChange={onChangeHandler}
                        name="edate"
                        type="datetime-local"
                        id="endtimepicker"
                        className={`${(validErr && (!reqData.edate || reqData.edate <= reqData.sdate)) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 ml-2 inline-block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5`}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Place"
                  className="block text-sm font-black leading-6"
                >
                  강의장소
                </label>
                <div className="mt-2">
                  <input
                    value={reqData.location}
                    onChange={onChangeHandler}
                    type="text"
                    name="location"
                    id="Place"
                    autoComplete="family-name"
                    className={`${(validErr && !reqData.location) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="ETC"
                  className="block text-sm font-black leading-6"
                >
                  질문 제한시간(분)
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
                    className={`${(validErr && !reqData.limitMin) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="ETC"
                  className="block text-sm font-black leading-6"
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
                    className={`${(validErr && reqData.etc.length > 200) && "ring-red-500 ring-2 focus:ring-red-500 hover:ring-red-300"} hover:brightness-95 hover:ring-blue-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6`}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="lg:mt-1 grid grid-cols-2 grid-flow-row-dense gap-2 lg:gap-4">
          <button
            type="button"
            className="inline-flex w-full py-1 lg:py-2 justify-center rounded-md bg-blue-600 border text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            onClick={() => modifyLecture(lCode)}
          >
            저장
          </button>
          <button
            type="button"
            className="inline-flex w-full py-1 lg:py-2 justify-center rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1"
            onClick={() => setShowDetailForm(true)}
          >
            취소
          </button>
        </div>
      </div>}
    </div>
  );
};
export default LectureModifyForm;
