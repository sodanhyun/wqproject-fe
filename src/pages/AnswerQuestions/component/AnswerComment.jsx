import AnswerDeleteModal from "../AnswerDeleteModal.jsx";
import {useState} from "react";

const AnswerComment = ({data, answerDelete, answerUpdate}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const AnswerComment = () => {
    return (
      <div key={data.acode}
           className="border rounded-md border-gray-300 p-4 my-3"
      >
        <p> {data.content} </p>
        <div className="flex items-center justify-end">
          <button
            className="rounded-md bg-white px-1 py-1 text-sm mr-3 font-semibold text-gray-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>

          <button
            className="rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            type="button"
            onClick={() => setDeleteModalOpen(true)}
          >
            삭제
          </button>
          {deleteModalOpen && <AnswerDeleteModal
            answerDelete={()=>answerDelete(data.acode)}
            onClose={() => setDeleteModalOpen(false)}
          />}
        </div>
      </div>
    )
  }

  const AnswerEditInput = () => {
    const [editAnswer, setEditAnswer] = useState(data.content);
    const clickUpdateButton = ()=>{
      answerUpdate(data.acode, editAnswer);
      setIsEditing(false);
    }

    return (
      <div key={data.acode}
           className="p-2 my-3 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600"
      >
        <div>
          <textarea
            value={editAnswer}
            onChange={(e) => setEditAnswer(e.target.value)}
            rows={3}
            className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="답변을 입력하세요."
          />
        </div>

        <div className="flex items-center justify-end py-1 pl-3 pr-2">
          <button
            className="rounded-md bg-white px-1 py-1 text-sm mr-3 font-semibold text-blue-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            type="button"
            onClick={clickUpdateButton}
          >
            등록
          </button>

          <button
            className="rounded-md bg-white px-1 py-1 text-sm font-semibold text-red-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <> {isEditing ? <AnswerEditInput/> : <AnswerComment/>} </>
  )
}
export default AnswerComment