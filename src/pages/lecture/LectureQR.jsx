import { useState, useEffect, useCallback } from "react";
import QrCode from "qrcode.react";
import fetcher from "../../fetcher";
import backgroundImage from "/assets/background/background-faqs.jpg";
import baseImage from "/assets/codehows.png";
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
  const [qrSize, setQrSize] = useState(700);

  const updateQrSize = () => {
    const newSize = Math.min(window.innerWidth * 0.3, 700); // 화면의 80% 또는 최대 700
    setQrSize(newSize);
    console.log(newSize)
  };

  useEffect(() => {
    updateQrSize();
    window.addEventListener('resize', updateQrSize);
    return () => {
      window.removeEventListener('resize', updateQrSize); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, [])

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

  const onSelected = (lcode) => {
    setLCode(lcode);
    setNoImage(false);
  }

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
              <LectureSelect onSelected={onSelected} />
            </div>
            <div className="flex justify-end">
              {lCode && (<LectureToggle onToggle={handleToggle} isActive={isActive}/>)}
            </div>
            <div>
              {lectureDetails && (
                <h2
                  id="faq-title"
                  className=" font-extrabold text-9xl lg:text-7xl mid:text-3xl sm:text-2xl tracking-tight text-slate-900 my-10 text-center "
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
                  <div className="grid grid-cols-10">
                    <div className="flex items-center col-span-2 sm:hidden">
                      {!noImage && <img
                        src={VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}`}
                        className="mb-4"
                        onError={() => {setNoImage(true)}}
                      />}
                    </div>
                    <div className="flex col-span-4 items-center justify-center sm:hidden rounded-xl bg-blue-100 ">
                      <div className="h-fit w-fit grid-cols-1 grid-rows-5 p-5">
                        <p className="xl:text-6xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-7xl lg:text-3xl mid:text-xl sm:text-sm">
                            강사
                          </span>
                          {lectureDetails.speaker}
                        </p>
                        <p className="xl:text-5xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-7xl lg:text-3xl mid:text-xl sm:text-sm">
                            시작
                          </span>
                          {getFormattedDate(lectureDetails.sdate)}
                        </p>
                        <p className="xl:text-5xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-7xl lg:text-3xl mid:text-xl sm:text-sm">
                            종료
                          </span>
                          {getFormattedDate(lectureDetails.edate)}
                        </p>
                        <p className="xl:text-6xl mid:text-xl lg:text-3xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-7xl lg:text-3xl mid:text-xl sm:text-sm">
                            장소
                          </span>
                          {lectureDetails.location}
                        </p>
                        {lectureDetails.etc &&
                        <p className="max-w-3xl break-words xl:text-5xl lg:hidden mid:hidden sm:hidden m-2">
                          <span className="font-extrabold mr-5 xl:text-7xl lg:text-3xl mid:text-xl sm:text-sm">
                            기타
                          </span>
                          {lectureDetails.etc}
                        </p>}
                      </div>
                    </div>
                    <div className="flex col-span-4 justify-center sm:col-span-10">
                      {lCode && (
                        <>
                          {isActive && (
                            <div>
                              <div className="flex justify-center">
                                <QrCode
                                  value={`${VITE_REACT_APP_API_FRONT_URL}/social/${lCode}`}
                                  size={qrSize}
                                />
                              </div>
                              <p className="text-center font-bold mt-2 text-3xl mid:text-xl sm:text-sm">QR로 접속해서 궁금한 점을 질문하세요!</p>
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
