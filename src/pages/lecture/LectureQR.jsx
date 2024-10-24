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
  const [imageSrc, setImageSrc] = useState("");
  const [qrSize, setQrSize] = useState(700);
  const [loading, setLoading] = useState(false);
  const [pendding, setPendding] = useState(false);

  const updateQrSize = () => {
    let newSize = 0;
    if(window.innerWidth > 2250) {
      newSize = Math.min(window.innerWidth * 0.5, 1000);
    }else if(window.innerWidth > 1920) {
      newSize = Math.min(window.innerWidth * 0.38, 800);
    }else {
      newSize = Math.min(window.innerWidth * 0.3, 700);
    }
    setQrSize(newSize);
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
        fetcher.get(VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}`, {
          responseType: 'blob'
        })
        .then((img) => {
          const imgUrl = URL.createObjectURL(img.data);
          setImageSrc(imgUrl);
        }).catch((err) => {
          setImageSrc("");
        })
        setLectureDetails(res.data);
        setIsActive(res.data.active);
      }).catch((err) => {
        console.error("서버 요청 오류:", err);
      });
    }
    fetchData();
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [lCode]);

  const handleToggle = async (newActiveState) => {
    if(newActiveState) { 
      setLoading(true);
    }else {
      setPendding(true);
    }

    await fetcher.patch(QRACTIVE_API, {
      active: newActiveState,
      lCode: lCode
    }).then((res) => {
      setIsActive(newActiveState);
      if(newActiveState) {
        setLoading(false);
      }else {
        setPendding(false);
      }
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
              <LectureSelect onSelected={(lcode) => {setLCode(lcode)}} />
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
            {pendding && 
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
            </div>
            }
            {loading ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
            <div className="flex justify-between items-start w-full">
              {lectureDetails && (
                <div
                  key={lectureDetails.id}
                  className="mt-4 text-lg tracking-tight text-slate-700 w-full"
                >
                  <div className="grid grid-cols-10">
                    <div className="flex p-3 items-center col-span-2 sm:hidden">
                      {imageSrc && <img src={imageSrc} alt="Fetched from API" />}
                    </div>
                    <div className="flex col-span-4 items-center justify-center sm:hidden p-3 ">
                      <div className="bg-blue-100 rounded-2xl h-fit w-fit grid-cols-1 grid-rows-5 p-3">
                        <p className="xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm">
                            강사
                          </span>
                          {lectureDetails.speaker}
                        </p>
                        <p className="xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm">
                            시작
                          </span>
                          {getFormattedDate(lectureDetails.sdate)}
                        </p>
                        <p className="xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm">
                            종료
                          </span>
                          {getFormattedDate(lectureDetails.edate)}
                        </p>
                        <p className="xl:text-4xl mid:text-xl lg:text-3xl sm:text-sm m-2">
                          <span className="font-extrabold mr-5 xl:text-4xl lg:text-3xl mid:text-xl sm:text-sm">
                            장소
                          </span>
                          {lectureDetails.location}
                        </p>
                        {lectureDetails.etc &&
                        <p className="mt-10 max-w-xl break-words xl:text-4xl lg:text-3xl mid:hidden sm:hidden m-2">
                          <span className="font-extrabold mr-5 xl:text-4xl lg:text-3xl mid:hidden sm:hidden">
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
            </div>}
          </div>
        </div>
      </section>
    </>
  );
};

export default LectureQR;
