import { useState, useEffect } from "react";
import QrCode from "qrcode.react";
import fetcher from "../fetcher";
import backgroundImage from "../testImages/background-faqs.jpg";
import { Header } from "../components/Header.jsx";
import LectureSelect from "../components/LectureSelect.jsx";
import { LECTURE_IMAGE_API } from "../constants/api_constants";
import LectureToggle from "../components/LectureToggle";
import { LECTURE_HANDLE_API, QRACTIVE_API } from "../constants/api_constants";
const LectureQR = () => {
  const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;
  const { VITE_REACT_APP_API_FRONT_URL } = import.meta.env;

  const [isActive, setIsActive] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [lCode, setLCode] = useState(null);
  const [lectureDetails, setLectureDetails] = useState(null);

  useEffect(() => {
    // 페이지 로드 시 활성화 상태 가져오기
    async function fetchActiveState() {
      try {
        const response = await fetcher.get("/lecture/active"); // 서버에서 활성화 상태 가져오는 API 엔드포인트
        setIsActive(response.data.active); // 가져온 활성화 상태를 상태 변수에 설정
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchActiveState();
  }, []); // 빈 배열을 두 번째 인자로 전달하여 페이지 로드 시 한 번만 실행되도록 설정

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`);
        setLectureDetails(response.data);
        setIsActive(response.data.active); // 활성화 상태 설정
        setShowQrCode(response.data.active); // 큐알 코드 표시 설정
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    if (lCode) {
      fetchData();
    }
  }, [lCode]);

  const handleToggle = async (newActiveState) => {
    try {
      await fetcher.patch(QRACTIVE_API, {
        active: newActiveState,
        lCode: lCode,
      });
      setIsActive(newActiveState); // 새로운 활성화 상태를 상태 변수에 설정하여 화면에 반영
      setShowQrCode(newActiveState);
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  useEffect(() => {
    async function fetchDetails() {
      if (!lCode) return;

      try {
        const response = await fetcher.get(`${LECTURE_HANDLE_API}/${lCode}`);
        setLectureDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchDetails();
  }, [lCode]);

  const imageURL =
    VITE_REACT_APP_API_BASE_URL + `${LECTURE_IMAGE_API}/${lCode}`;

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  let formattedSDate = "";
  let formattedEDate = "";

  if (lectureDetails) {
    formattedSDate = getFormattedDate(lectureDetails.sdate);
    formattedEDate = getFormattedDate(lectureDetails.edate);
  }

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
          // unoptimized="true"
        />
        <div className="relative mx-24">
          <div className="mx-auto">
            <div className="flex justify-center">
              <LectureSelect onSelected={setLCode} />
            </div>
            <div className="flex justify-end">

            {lCode && (
              <LectureToggle onToggle={handleToggle} isActive={isActive} />
            )}
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
                  {imageURL && (
                    <div className=" flex items-center bg-slate-100 w-[400px]">
                      <img
                        src={imageURL}
                        alt=""
                        className="mb-4 w-[400px]"
                        onError="this.style.display='none'"
                      />
                    </div>
                  )}
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
                      {formattedSDate}
                    </p>
                    <p className=" text-5xl mb-6 my-10">
                      <span className="font-extrabold text-5xl mr-3">
                        종료 :
                      </span>
                      {formattedEDate}
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
                    {showQrCode && (
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
