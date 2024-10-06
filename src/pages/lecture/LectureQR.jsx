import { useState, useEffect, useCallback } from "react";
import QrCode from "qrcode.react";
import fetcher from "../../fetcher";
import backgroundImage from "../../assets/background-faqs.jpg";
import baseImage from "../../assets/codehows.png";
import { Header } from "../../components/common/Header.jsx";
import LectureSelect from "./component/LectureSelect.jsx";
import { LECTURE_IMAGE_API } from "../../constants/api_constants";
import LectureToggle from "./component/LectureToggle";
import { LECTURE_HANDLE_API, QRACTIVE_API } from "../../constants/api_constants";

const LectureQR = () => {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const { VITE_REACT_APP_API_FRONT_URL } = import.meta.env;
  const [isActive, setIsActive] = useState(false);
  const [lCode, setLCode] = useState(null);
  const [lectureDetails, setLectureDetails] = useState(null);
  const [noImage, setNoImage] = useState(false);

  useEffect(() => {
    async function fetchActiveState() {
      await fetcher.get(QRACTIVE_API)
      .then((res) => {
        setIsActive(res.data.active);
      }).catch((err) => {
        console.error("서버 요청 오류:", err);
      });
    }
    fetchActiveState();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!lCode) return;
      await fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`)
      .then((res) => {
        setLectureDetails(res.data);
        setIsActive(res.data.active);
      }).catch((err) => {
        console.error("서버 요청 오류:", err);
      });
    }
    fetchData();
  }, [lCode]);

  const handleToggle = async (newActiveState) => {
    await fetcher.patch(QRACTIVE_API, {
      active: newActiveState,
      lCode: lCode
    }).then((res) => {
      setIsActive(newActiveState);
    }).catch((err) => {
      console.error("서버 요청 오류:", err);
    });
  };

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
    <>
      <Header />
      <section
        id="faq"
        aria-labelledby="faq-title"
        className="relative overflow-hidden bg-slate-50 py-10 min-h-screen"
      >
        <img
          className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
          src={backgroundImage}
          alt=""
          width={1558}
          height={946}
        />
        <div className="relative mx-24">
          <div className="mx-auto">
            <div className="flex justify-center">
              <LectureSelect onSelected={setLCode} />
            </div>
            <div className="flex justify-end">
              {lCode && (<LectureToggle onToggle={handleToggle}/>)}
            </div>
            <div>
              {lectureDetails && (
                <h2
                  id="faq-title"
                  className=" font-extrabold text-9xl tracking-tight text-slate-900 my-10 text-center "
                >
                  {lectureDetails.title}
                </h2>
              )}
            </div>
            <div className="flex justify-between items-start w-full">
              {lectureDetails && (
                <div
                  key={lectureDetails.id}
                  className="mt-4 text-lg tracking-tight text-slate-700 w-full"
                >
                  <div className="flex justify-between w-full">
                    <div className=" flex items-center bg-slate-100 w-[400px]">
                      {noImage ? <img
                        src={baseImage}
                        className="mb-4 w-[400px]"
                      /> : <img
                        src={VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}`}
                        className="mb-4 w-[400px]"
                        onError={() => {setNoImage(true)}}
                      />}
                    </div>
                  <div className="ml-16 max-w-5xl">
                    <p className=" text-5xl my-10">
                      <span className="font-extrabold text-5xl mr-3">
                        강사 :
                      </span>
                      {lectureDetails.speaker}
                    </p>

                    <p className=" text-5xl mb-6">
                      <span className="font-extrabold text-5xl mr-3">
                        시작 :
                      </span>
                      {getFormattedDate(lectureDetails.sdate)}
                    </p>
                    <p className=" text-5xl mb-6 my-10">
                      <span className="font-extrabold text-5xl mr-3">
                        종료 :
                      </span>
                      {getFormattedDate(lectureDetails.edate)}
                    </p>

                    <p className=" text-5xl mb-6 my-10 leading-normal">
                      <span className="font-extrabold text-5xl mr-3">
                        장소 :
                      </span>
                      {lectureDetails.location}
                    </p>

                    <p className=" text-5xl my-10 leading-normal">
                      <span className="font-extrabold text-5xl mr-3">
                        기타 :
                      </span>
                      {lectureDetails.etc}
                    </p>
                  </div>
              <div className="ml-5 flex-shrink-0 flex items-center">
                {lCode && (
                  <>
                    {isActive && (
                      <div className="mt-4">
                        <QrCode
                          value={`${VITE_REACT_APP_API_FRONT_URL}/social/${lCode}`}
                          size={800}
                          style={{ width: "800px", height: "auto" }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LectureQR;
