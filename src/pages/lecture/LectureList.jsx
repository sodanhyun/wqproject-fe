import { useCallback, useEffect, useState } from "react";
import { Header } from "../../components/common/Header";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LectureDeleteModal from "./modal/LectureDeleteModal.jsx";
import fetcher from "../../fetcher.js";
import { FILTER_LECTURE_LIST_API } from "../../constants/api_constants.js";
import DetailModal from "./modal/DetailModal.jsx";
import useStore from "../../store.js";
import Pagination from "../../components/common/Pagination";
import Logo from "/assets/logo/logo_gray.png"
const ITEMS_PER_PAGE = 5;

const LectureList = () => {
  const { setShowDetailForm } = useStore((state) => state);
  const [keyword, setKeyword] = useState("");
  const [sdate, setSdate] = useState(null); //시작일
  const [edate, setEdate] = useState(null); //종료일
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [lectureData, setLectureData] = useState([]);
  const [modalDataId, setModalDataId] = useState("");
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchingCondTxt, setSearchingCondTxt] = useState(false);

  useEffect(() => {
    fetchLectureData();
  }, [currentPage])

  const searchLectureData = async () => {
    setCurrentPage(1);
    const searchingText = sdate ? getFormattedDate(new Date(sdate), false) + ' 부터 ' + 
    (edate ? getFormattedDate(new Date(edate), false) + ' 까지 ' : '') + '조회된 결과'
    : '';
    setSearchingCondTxt(searchingText);
    fetchLectureData();
  }

  const convertDateFormat = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const fetchLectureData = async () => {
    setLoading(true);
    const url = `${FILTER_LECTURE_LIST_API}/${currentPage-1}?itemsPerPage=${ITEMS_PER_PAGE}`;
    await fetcher.post(url, {
      keyword: keyword,
      sdate: sdate ? convertDateFormat(sdate) : null,
      edate: edate ? convertDateFormat(edate) : null,
    }).then((res) => {
      setLectureData(res.data.content);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    }).catch((err) => {
      console.error("강의 데이터 가져오기 오류:", err);
    });
  };

  const handleDatePickerIconClick = (e) => {
    e.stopPropagation();
    setShowDatePicker(true);
  };

  const handleDetailClick = (lCode) => {
    setIsDetailModalOpen(true);
    setModalDataId(lCode);
  };

  const handleDeleteClick = (lCode) => {
    setIsDeleteModalOpen(true);
    setModalDataId(lCode);
  };

  const getLectureState = useCallback((data) => {
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
  });

  const getFormattedDate = (date, needTime) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    if(!needTime) {
      return `${year}년 ${month}월 ${day}일`;
    }
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <>
      <Header />

      <div className="py-10" onClick={() => setShowDatePicker(false)}>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
              강의목록
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="sticky top-0 z-40 flex h-15 shrink-0 items-center gap-x-6 border-b border-white/5 shadow-sm">
              <div className="flex flex-1 py-2 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1">
                  <div className="relative w-full">
                  <MagnifyingGlassIcon
                      className="pointer-events-none absolute inset-y-0 left-1 h-full w-5 text-gray-500"
                      aria-hidden="true"
                    />
                    <input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                          e.preventDefault();
                          searchLectureData();
                        }
                      }}
                      id="search-field"
                      className="hover:bg-gray-100 focus:bg-gray-100 rounded-3xl block h-full w-full border-0 bg-transparent pl-8 text-gray-900 focus:ring-0 sm:text-sm"
                      placeholder="강의 검색"
                      type="search"
                      name="keyword"
                    />
                  </div>
                </div>
                <div>
                  {showDatePicker ? (
                    <div className="transform -translate-x-56 fixed flex items-center flex-wrap">
                    <dialog 
                      className="flex items-center flex-wrap"
                      onClick={(e) => e.stopPropagation()}>
                      <DatePicker
                        selected={sdate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setSdate(start);
                          setEdate(end);
                        }}
                        startDate={sdate}
                        endDate={edate}
                        selectsRange
                        inline
                      />
                      </dialog>
                    </div>
                  ) : <CalendarDaysIcon
                  className="hover:brightness-50 w-8 ml-2 text-gray-500 cursor-pointer"
                  onClick={handleDatePickerIconClick} 
                />}
                </div>
                <button
                  onClick={searchLectureData}
                  className="inline-block px-4 py-2 ml-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
                >
                  검색
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {searchingCondTxt && <div className="p-4 mx-auto sm:px-6 lg:px-8">
            <p className="text-gray-500 text-sm">{searchingCondTxt}</p>
          </div>}
          {loading ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
            <ul role="list" className="space-y-3">
              {lectureData.length > 0 ? (
                lectureData
                  .map((data) => (
                    <li
                      key={data.lcode}
                      className="hover:bg-gray-50 overflow-hidden bg-postYellow px-4 py-4 shadow rounded-lg sm:px-6"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="bg-lightBlue pr-4 py-1.5 rounded-full mr-2 text-sky-600 font-bold text-sm">
                            {getLectureState(data)}
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
                              시작 : {getFormattedDate(new Date(data.sdate), true)}
                            </p>
                            <p className="text-sm from-stone-600">
                              종료 : {getFormattedDate(new Date(data.edate), true)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-end ssm:flex-col">
                            <button
                              type="button"
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:ring-gray-400 mr-2 ssm:mt-2"
                            >
                              <Link to={`/liveQuestions/${data.lcode}`}>
                                질문리스트
                              </Link>
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:ring-gray-400 mr-2 ssm:my-2"
                            >
                              <Link to={`/pickQuestions/${data.lcode}`}>
                                답변리스트
                              </Link>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetailClick(data.lcode)}
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:ring-gray-400 mr-2 ssm:mb-2"
                            >
                              상세
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(data.lcode)}
                              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:ring-gray-400 mr-2"
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
            </ul>}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
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
