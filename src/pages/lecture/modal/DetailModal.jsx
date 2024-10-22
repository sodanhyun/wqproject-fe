import {Fragment, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import LectureDetail from "./LectureDetail.jsx";
import LectureModifyForm from "./LectureModifyForm.jsx";
import useStore from "../../../store.js";

const DetailModal = ({lCode, onClose}) => {
  const {isShowDetailForm} = useStore(state => state);
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="relative z-101" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative transform overflow-hidden rounded-lg bg-white px-2 pb-2 pt-2 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                  <div className="text-center">
                    <h3  className="text-base font-semibold leading-6 text-gray-900">
                      { isShowDetailForm ? <LectureDetail lCode={lCode} onClose={onClose}/>
                        : <LectureModifyForm lCode={lCode} onClose={onClose}/>
                      }
                    </h3>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  )
}
export default DetailModal