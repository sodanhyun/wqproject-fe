import {Fragment, useEffect, useState} from "react";
import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import fetcher from "../../../fetcher";
import {LECTURE_LIST_API} from "../../../constants/api_constants";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LectureSelect({onSelected}) {
  const [lectures, setLectures] = useState([{title: '강의선택', id: null}]);
  const [selected, setSelected] = useState(lectures[0]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetcher.get(LECTURE_LIST_API);
        setLectures(prevLectures => [...prevLectures, ...response.data]);
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  return (
    <Listbox value={selected} onChange={(value) => {
      setSelected(value);
      if (value.lcode && onSelected) onSelected(value.lcode);
    }}>
      {({open}) => (
        <div className="relative mt-2">
          <Listbox.Button
            className="relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
              <span className="block truncate">
              {selected ? selected.title : "강의 선택"}
              </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {lectures.map((lecture) => (
                <Listbox.Option
                  key={lecture.id}
                  className={({active}) =>
                    classNames(
                      active ? "bg-blue-600 text-white" : "text-gray-900",
                      "relative cursor-default select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={lecture}
                >
                  {({selected, active}) => (
                    <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {lecture.title}
                        </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-blue-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                          </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
