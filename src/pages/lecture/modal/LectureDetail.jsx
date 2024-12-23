import { useCallback, useEffect, useState } from "react";
import fetcher from "../../../fetcher.js";
import {
  LECTURE_HANDLE_API,
  LECTURE_IMAGE_API,
} from "../../../constants/api_constants.js";
import useStore from "../../../store.js";
import Modal from "react-modal";

Modal.setAppElement('#root');
const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;

const LectureDetail = ({ lCode, onClose }) => {
  const {setShowDetailForm } = useStore((state) => state);
  const [lectureData, setLectureData] = useState({});
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  useEffect(() => {
    const fetchLectureInfo = () => {
      fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`).then((res) => {
        fetcher.get(VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}?thumbs=Y`, {
          responseType: 'blob'
        })
        .then((img) => {
          const imgUrl = URL.createObjectURL(img.data);
          setImageSrc(imgUrl);
        }).catch((err) => {
          setImageSrc("");
        })
        setLectureData(res.data);
        setLoading(false);
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
    <div className='space-y-10 divide-y divide-gray-900/10'>
      {loading ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
      <div className="grid grid-cols-1 gap-y-2 px-2 py-2">
          <div className="bg-postYellow shadow-sm ring-1 ring-gray-900/5 rounded-xl px-2 py-2">
            <div className="grid max-w-2xl grid-cols-1 gap-y-2 lg:gap-y-6">
              <div className="col-span-full">
                <label
                  htmlFor="Topic"
                  className="block text-sm font-black leading-6"
                >
                  강의제목
                </label>
                <div className="mt-2">
                  <h1 className="lg:text-3xl sm:text-lg font-normal leading-tight tracking-tight text-gray-900 text-center">
                    {lectureData.title}
                  </h1>
                </div>
              </div>

              <div className="col-span-full flex justify-center">
                {imageSrc ? <img src={imageSrc} alt="Fetched from API" 
                  onClick={() => {setLightBoxOpen(true);}} />
                : <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="Title"
                  className="block text-sm font-black  leading-6 "
                >
                  강연자
                </label>
                <div className="mt-2">
                  <p className="lg:text-lg text-sm font-normal text-gray-900">{lectureData.speaker}</p>
                </div>
              </div>

              <div className="col-span-full">
                <span className="block text-sm font-black leading-6">
                  강의시간
                </span>
                <div className="mt-2 flex flex-col">
                  <p className="lg:text-lg text-sm font-normal text-gray-900">{getFormattedDate(lectureData.sdate)}</p>~<p className="lg:text-lg text-sm font-normal">{getFormattedDate(lectureData.edate)}</p>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="Place"
                  className="block text-sm font-black leading-6"
                >
                  강의장소
                </label>
                <div className="mt-2">
                  <p className="lg:text-lg text-sm font-normal text-gray-900">{lectureData.location}</p>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="ETC"
                  className="block text-sm font-black leading-6"
                >
                  질문 제한시간
                </label>
                <div className="mt-2">
                  <p className="lg:text-lg text-sm font-normal text-gray-900">{lectureData.limitMin}분</p>
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
                  <p className="break-words lg:text-lg text-sm font-normal text-gray-900">{lectureData.etc}</p>
                </div>
              </div>

            </div>
          </div>
        <div className="lg:mt-1 grid grid-cols-2 grid-flow-row-dense gap-2 lg:gap-4">
          <button
            type="button"
            className="inline-flex w-full py-1 lg:py-2 justify-center rounded-md bg-blue-600 border text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            onClick={() => setShowDetailForm(false)}
          >
            수정
          </button>
          <button
            type="button"
            className="inline-flex w-full py-1 lg:py-2 justify-center rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>}
      <ImageModal
        lCode={lCode}
        lightBoxOpen={lightBoxOpen}
        setLightBoxOpen={setLightBoxOpen}
      />
    </div>
  );
};

const ImageModal = ({lCode, lightBoxOpen, setLightBoxOpen}) => {
  const [originImgSrc, setOriginImageSrc] = useState("");

  useEffect(() => {
    fetcher.get(`${VITE_REACT_APP_API_BASE_URL}${LECTURE_IMAGE_API}/${lCode}`, {
      responseType: 'blob'
    })
    .then((img) => {
      const originImgUrl = URL.createObjectURL(img.data);
      setOriginImageSrc(originImgUrl);
    }).catch((err) => {
      setOriginImageSrc("");
    })
  }, []);
  
  return(
  <Modal
    isOpen={lightBoxOpen}
    onRequestClose={() => {setLightBoxOpen(false); setImgOriginLoading(true);}}
    className="fixed inset-0 flex items-center justify-center"
    overlayClassName="fixed inset-0 z-100"
  >
    {!originImgSrc ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
    <div className="w-fit h-fit relative">
      <div className="absolute top-2 right-2">
        <button onClick={() => {setLightBoxOpen(false); setImgOriginLoading(true);}} className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 font-bold hover:bg-slate-400 focus:outline-none">&times;</button>
      </div>
      <img src={originImgSrc} alt="LightBox" className="max-w-full max-h-full" />
    </div>}
  </Modal>)
}

export default LectureDetail;
