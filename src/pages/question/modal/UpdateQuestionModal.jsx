import {Fragment, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ChatBubbleBottomCenterIcon} from "@heroicons/react/24/outline";
import {toast} from "react-toastify";

export default function UpdateQuestionModal({qcode, data, questionUpdate, onClose}) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState(data);

  const cancelButtonRef = useRef(null);
  const clickSubmit = ()=> {
    if(message==="") {
      toast.warning('질문을 입력해주세요.');
      return;
    }
    toast.success('질문이 등록되었습니다.');
    questionUpdate(qcode, message);
    onClose();
  }

  return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
        >
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
                <div
                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <ChatBubbleBottomCenterIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                      >
                        강사님에게 궁금한 점을 질문하세요
                      </Dialog.Title>
                      <div className="mt-2">
                      <textarea
                          rows={4}
                          value={message}
                          onChange={(e)=>setMessage(e.target.value)}
                          name="comment"
                          id="comment"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                        onClick={clickSubmit}
                    >
                      질문 수정
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={onClose}
                        ref={cancelButtonRef}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  );
}
