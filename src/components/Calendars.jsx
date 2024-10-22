import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect, Fragment } from "react";
import fetcher from "../fetcher";
import { LECTURE_LIST_API } from "../constants/api_constants";
import { Dialog, Transition } from "@headlessui/react";
import DetailModal from "../pages/lecture/modal/DetailModal";
import useStore from "../store";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendars() {
  const lectureColors = ["#6B33FF", "#FF33B9", "#33A8FF", "#33E0E8"]; // 강의 컬러
  const { setShowDetailForm } = useStore((state) => state);
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalDataId, setModalDataId] = useState("");
  const [listOffset, setListOffset] = useState(1);

  useEffect(() => {
    const fetchLectures = async (days) => {
      setLoading(true);
      const url = `${LECTURE_LIST_API}?date=${convertDateFormat(new Date(currentYear, currentMonth))}`;
      await fetcher.get(url).then((res) => {
        setLectures(res.data);
        for (let i = 0; i < res.data.length; i++) {
          let lecture = res.data[i];
          let sdate = new Date(lecture.sdate);
          let edate = new Date(lecture.edate);
          for ( let d = new Date(lecture.sdate); d <= edate; d.setDate(d.getDate() + 1)) {
            let dateString = 
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            // 해당 날짜를 찾아 이벤트 추가
            let dayIndex = days.findIndex((day) => day.date === dateString);
            if (dayIndex !== -1) {
              days[dayIndex].events.push({
                id: lecture.lcode,
                name: lecture.title,
                datetime: sdate.toISOString(),
                time: `${sdate.getHours().toString().length < 2 ? ('0' + sdate.getHours().toString()) : sdate.getHours().toString()}:${sdate.getMinutes().toString().length < 2 ? ('0' + sdate.getMinutes().toString()) : sdate.getMinutes().toString()}`,                color: lectureColors[i % lectureColors.length], // 색상 할당
              });
            }
          }
        }
        setFilteredLectures(days);
        setLoading(false);
      }).catch((err) => {
        console.error("Error:", err);
      });
    };
    fetchLectures(initDays());
  }, [currentMonth, currentYear]);

  const initDays = () => {
    const currentDate = new Date(currentYear, currentMonth);
    // 이번 달의 첫 번째 날과 마지막 날 가져오기
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // 일자 배열 초기화
    let days = new Array();
    // 이전 달의 마지막 날을 가져옴
    const lastDayOfLastMonth = new Date(lastDay.getFullYear(), lastDay.getMonth(), 0);
    const firstDayOfNextMonth = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 1);
    // 이전 달의 마지막 날짜부터 시작하여 이번 달 첫 날의 요일만큼 날짜를 추가
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      let day = {
        date: 
        `${lastDayOfLastMonth.getFullYear()}-${String(lastDayOfLastMonth.getMonth() + 1).padStart(2, "0")}-${String(lastDayOfLastMonth.getDate() - i).padStart(2, "0")}`,
        isCurrentMonth: false,
        events: [],
      };
      days.push(day);
    }
    // 이번 달의 모든 일자를 배열에 추가하기
    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      let day = {
        date: 
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        isCurrentMonth: true,
        events: [],
      };
      days.push(day);
    }
    // 달력의 남은 토요일까지 다음 달의 일자를 배열에 추가하기
    for (let i = lastDay.getDay(); i < 6; i++) {
      let day = {
        date: 
        `${firstDayOfNextMonth.getFullYear()}-${String(firstDayOfNextMonth.getMonth() + 1).padStart(2, "0")}-${String(firstDayOfNextMonth.getDate() ).padStart(2, "0")}`,
        isCurrentMonth: false,
        events: [],
      };
      firstDayOfNextMonth.setDate(firstDayOfNextMonth.getDate() + 1);
      days.push(day);
    }
    return days;
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

  // 이전 월로 이동하는 함수
  const previousMonth = () => {
    setListOffset(1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  // 다음 월로 이동하는 함수
  const nextMonth = () => {
    setListOffset(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  // 모달용
  const showMoreEvents = (day) => {
    setSelectedDay(day);
    setOpen(true);
  };

  const handleDetailClick = (lCode) => {
    setIsDetailModalOpen(true);
    setModalDataId(lCode);
  }

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime={`${new Date(currentYear, currentMonth).getFullYear()}-${currentMonth + 1}`}>
            {new Date(new Date(currentYear, currentMonth).getFullYear(), currentMonth).toLocaleString(
              "kr",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={previousMonth} // 이전 월로 이동하는 함수 호출
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={() => {
                // 클릭 이벤트 핸들러 추가
                const today = new Date();
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
            >
            {new Date(new Date(currentYear, currentMonth).getFullYear(), currentMonth).toLocaleString("kr",{month: "long"})}
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={nextMonth} // 다음 월로 이동하는 함수 호출
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center"></div>
        </div>
      </header>
      {loading ? <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div> : 
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>
        <div className="flex  bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className={`hidden w-full lg:grid lg:grid-cols-7 ${filteredLectures.length > 35 ? 'lg:grid-rows-6' : 'lg:grid-rows-5'} lg:gap-px`}>
            {filteredLectures.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "relative px-3 py-2"
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.date === new Date().toISOString().split("T")[0]
                      ? "flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-semibold text-white" // 오늘이면 동그라미로 표시
                      : undefined
                  }
                >
                  {day.date.split("-").pop().replace(/^0/, "")}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a onClick={() => handleDetailClick(event.id)} className="group flex rounded-full cursor-pointer hover:bg-gray-100">
                          <p
                            className="ml-2 flex-auto truncate font-medium text-gray-900 group-hover:text-blue-600"
                            style={{ color: event.color }} // 색상 적용
                          >
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="mr-2 hidden flex-none text-gray-500 group-hover:text-blue-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li
                        className="rounded-full text-gray-500 cursor-pointer focus-within:bg-gray-100 hover:bg-gray-100"
                        onClick={() => showMoreEvents(day)}
                      >
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className={`isolate grid w-full grid-cols-7 ${filteredLectures.length > 35 ? 'lg:grid-rows-6' : 'lg:grid-rows-5'} gap-px lg:hidden`}>
            {filteredLectures.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => showMoreEvents(day)}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday) && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected && day.isToday && "text-blue-600",
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-900",
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-500",
                  "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected &&
                      "flex h-6 w-6 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && "bg-blue-600",
                    day.isSelected && !day.isToday && "bg-gray-900",
                    "ml-auto"
                  )}
                >
                  {day.date.split("-").pop().replace(/^0/, "")}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.slice(0, 6).map((event) => (
                      <span
                        key={event.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>}

      
        <div className="px-4 py-10 sm:px-6">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {lectures.length > 0 ? (lectures
              .filter((lecture) => {
                const lectureStartMonth = new Date(lecture.sdate).getMonth();
                const lectureEndMonth = new Date(lecture.edate).getMonth();
                return (
                  lectureStartMonth <= currentMonth &&
                  lectureEndMonth >= currentMonth
                );
              })
              .sort((l1, l2) => l1.sdate < l2.sdate ? -1 : 1)
              .slice(0, listOffset*5)
              .map((lecture) => (
                <li
                  key={lecture.lcode}
                  onClick={() => handleDetailClick(lecture.lcode)}
                  className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
                >
                  <div className="flex-auto">
                    <p className="font-semibold text-gray-900">
                      {lecture.title}
                    </p>
                    <time className="mt-2 flex items-center text-gray-700 ">
                      <ClockIcon
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {new Date(lecture.sdate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="mx-2">~</span>
                      {new Date(lecture.edate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </li>
              ))) : (
                <div>
                  <li className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                    <div className="flex-auto">
                      <p className="font-semibold text-gray-400">
                        해당 달에 등록된 강의가 없습니다.
                      </p>
                    </div>
                  </li>
                </div>
              )}
          </ol>
          {lectures.filter((lecture) => {
            const lectureStartMonth = new Date(lecture.sdate).getMonth();
            const lectureEndMonth = new Date(lecture.edate).getMonth();
            return (
              lectureStartMonth <= currentMonth &&
              lectureEndMonth >= currentMonth
            );
          }).length > listOffset*5  && <button 
            className="mt-2 text-blue-500"
            onClick={() => setListOffset(listOffset+1)}
            >더보기
          </button>}
        </div>
    {/*  more 버튼 클릭시 모달 */}
    {isDetailModalOpen && (
      <DetailModal
        lCode={modalDataId}
        onClose={() => {
          setShowDetailForm(true);
          setIsDetailModalOpen(false);
        }}
      />
    )}
    {selectedDay && 
      <ScheduleModal 
      selectedDay={selectedDay} 
      handleDetailClick={handleDetailClick}
      open={open} 
      setOpen={setOpen} 
      />
    }
    </div>
  );
}
function ScheduleModal({ selectedDay, handleDetailClick, open, setOpen }) {
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-100 overflow-y-auto" onClose={setOpen}>
        <div className="flex justify-center items-center min-h-screen text-center sm:block sm:p-0">
          {/* <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" /> */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 sm:translate-y-0 sm:scale-95"
          >
            <div className="pt-3 ring-slate-200 ring-1 inline-block lg:w-1/6 w-1/2 bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all align-middle max-w-lg px-6">
            <div className="flex items-center justify-end">
              <button onClick={() => setOpen(false)} className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 font-bold hover:bg-slate-400 focus:outline-none">&times;</button>
            </div>
              <div>
                <Dialog.Title as="h3" className="text-center text-lg leading-6 font-medium text-gray-900">
                  {`${selectedDay.date.split('-')[1]}월 ${selectedDay.date.split('-')[2]}일`}
                </Dialog.Title>
                <ul className="text-sm text-gray-500">
                  {selectedDay.events.map((event) => (
                    <li key={event.id}>
                    <a onClick={() => {
                      handleDetailClick(event.id);
                    }
                    } 
                      className="mt-2 group flex rounded-full cursor-pointer hover:bg-gray-100"
                    >
                      <p
                        className="truncate ml-2 flex-auto font-medium text-gray-900 group-hover:text-blue-600"
                        style={{ color: event.color }} // 색상 적용
                      >
                        {event.name}
                      </p>
                      <time
                        dateTime={event.datetime}
                        className="ml-2 mr-2 flex-none text-gray-500 group-hover:text-blue-600 xl:block"
                      >
                        {event.time}
                      </time>
                    </a>
                  </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 sm:mt-6">
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
