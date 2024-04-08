import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LectureDeleteModal from "../modal/LectureDeleteModal.jsx";
import fetcher from "../fetcher.js";
import { FILTER_LECTURE_LIST_API } from "../constants/api_constants.js";
import DetailModal from "../modal/DetailModal.jsx";
import useStore from "../store.js";
import Pagination from "../components/Pagination";
import Logo from "../assets/logo_gray.png"

const ITEMS_PER_PAGE = 6;

const LectureList = () => {
  const { setShowDetailForm } = useStore((state) => state);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState(null); //시작일
  const [endDate, setEndDate] = useState(null); //종료일
  const [showDatePicker, setShowDatePicker] = useState(false); //아이콘 클릭상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태 추가
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [lectureData, setLectureData] = useState([]);
  const [modalDataId, setModalDataId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLectureData = async () => {
    const sdate = startDate ? startDate.toISOString().slice(0, -8) : null;
    const edate = endDate ? endDate.toISOString().slice(0, -8) : null;

    try {
      const res = await fetcher.post(FILTER_LECTURE_LIST_API, {
        keyword: searchKeyword,
        sdate: sdate,
        edate: edate,
      });
      setLectureData(res.data);
    } catch (error) {
      console.error("강의 데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchLectureData();
  }, [startDate, endDate, searchKeyword]);

  const lectureState = (data) => {
    const today = new Date();
    const startDate = new Date(data?.sdate);
    const endDate = new Date(data?.edate);
    if (startDate > today) {
      return <span className="text-gray-500">예정</span>;
    }
    if (startDate <= today && endDate >= today) {
      return <span className="text-blue-600">진행중</span>;
    }
    if (endDate < today) {
      return <span className="text-red-500">종료</span>;
    }
  };

  // 데이트피커 핸들러
  const handleDatePickerIconClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDetailClick = (lCode) => {
    setIsDetailModalOpen(true);
    setModalDataId(lCode);
  };

  const handleDeleteClick = (lCode) => {
    setIsDeleteModalOpen(true); // 삭제 버튼 클릭 시 모달 열도록 상태 업데이트
    setModalDataId(lCode);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <>
      <Header />

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
              강의목록
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form
                  className="flex flex-1"
                  action="#"
                  method="GET"
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchLectureData();
                  }}
                >
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                      aria-hidden="true"
                    />
                    <input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      id="search-field"
                      className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-gray-900 focus:ring-0 sm:text-sm"
                      placeholder="강의 검색"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
                <CalendarDaysIcon
                  className="w-8 ml-2 text-gray-500 cursor-pointer"
                  onClick={handleDatePickerIconClick} // 달력아이콘 클릭 -> 데이트피커 토글
                />
                {showDatePicker && (
                  <div className="flex items-center flex-wrap">
                    <DatePicker
                      selected={startDate}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                      }}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                    />
                  </div>
                )}
                <button
                  onClick={fetchLectureData}
                  className="inline-block px-4 py-2 ml-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul role="list" className="space-y-3">
              {lectureData.length > 0 ? (
                lectureData
                  .slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE
                  )
                  .map((data) => (
                    <li
                      key={data.lcode}
                      className="overflow-hidden bg-postYellow px-4 py-4 shadow rounded-lg sm:px-6"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="bg-lightBlue pr-4 py-1.5 rounded-full mr-2 text-sky-600 font-bold text-sm">
                            {lectureState(data)}
                          </span>
                          <p className="font-extrabold text-lg">{data.title}</p>
                          {data.active && (
                            <>
                            <span className="relative flex h-3 w-3 ml-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            </>
                            
                          )}
                        </div>
                        <div className="flex my-2 justify-between items-center">
                          <div>
                            <p className="text-sm from-stone-600">
                              시작 : {formatDate(new Date(data.sdate))}
                            </p>
                            <p className="text-sm from-stone-600">
                              종료 : {formatDate(new Date(data.edate))}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-end ssm:flex-col">
                            <button
                              type="button"
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2 ssm:mt-2"
                            >
                              <Link to={`/liveQuestions/${data.lcode}`}>
                                질문리스트
                              </Link>
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2 ssm:my-2"
                            >
                              <Link to={`/pickQuestions/${data.lcode}`}>
                                답변리스트
                              </Link>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetailClick(data.lcode)}
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2 ssm:mb-2"
                            >
                              상세
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(data.lcode)}
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
              ) : (
                <div className="flex justify-center flex-col items-center">
                  <img src={Logo} className="w-32 opacity-60"></img>
                  <p className="flex justify-centerfont-semibold mt-2">등록된 강의가 없습니다.</p>
                </div>
              )}
            </ul>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={lectureData.length}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </main>
        {/* 모달 */}
        {isDeleteModalOpen && (
          <LectureDeleteModal
            lCode={modalDataId}
            fetchLectureData={fetchLectureData}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
        {isDetailModalOpen && (
          <DetailModal
            lCode={modalDataId}
            fetchLectureData={fetchLectureData}
            onClose={() => {
              setShowDetailForm(true);
              setIsDetailModalOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};
export default LectureList;
