const AnswerTextArea = ({answer, setAnswer, clickSubmit}) => {
  return (
    <>
      <div
        className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={2}
            className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="답변을 입력하세요."
          />

        <div className="py-2" aria-hidden="true">
          <div className="py-px">
            <div className="h-9"/>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
        <div className="flex-shrink-0">
          <button
            onClick={clickSubmit}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vlue-600"
          >
            등록
          </button>
        </div>
      </div>
    </>
  )
}
export default AnswerTextArea