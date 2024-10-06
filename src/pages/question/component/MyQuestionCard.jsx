import {HeartIcon} from "@heroicons/react/20/solid/index.js";
import {useState} from "react";
import UpdateQuestionModal from "../modal/UpdateQuestionModal.jsx";
import MyQuestionDeleteModal from "../modal/MyQuestionDeleteModal.jsx";

const MyQuestionCard = ({data, role, questionUpdate, questionDelete}) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <li key={data.qCode}>
      <figure className="relative rounded-2xl bg-blue-100 p-6 shadow-xl shadow-slate-900/10">
        <blockquote className="relative">
          <figcaption className="relative  flex items-center justify-between border-slate-100">
            <div className="flex">
              <div className="font-display text-base text-slate-900 mr-2">
                {role==="ADMIN" ? data.name : "익명 사용자"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {data.updateTime === data.regTime ? data.regTime?.split("T")[1] : data.updateTime?.split("T")[1]}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <HeartIcon className="w-6 mr-1 text-red-300" />
              <p>{data.likesCount}</p>
            </div>
          </figcaption>
          <p className="text-lg tracking-tight text-slate-900">
            {data.content}
          </p>
        </blockquote>

        <div className="flex items-center justify-end">
          <button
            onClick={()=>setUpdateModalOpen(true)}
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm mr-3 font-semibold text-blue-500 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
          >
            수정
          </button>
          {updateModalOpen && <UpdateQuestionModal
            qcode = {data.qcode}
            data = {data.content}
            onClose={() => setUpdateModalOpen(false)}
            questionUpdate={questionUpdate}
          />}
          <button
            onClick={()=>setDeleteModalOpen(true)}
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
          >
            삭제
          </button>
          {deleteModalOpen && <MyQuestionDeleteModal
            qcode={data.qcode}
            onClose={()=>setDeleteModalOpen(false)}
            questionDelete={questionDelete}
          />}
        </div>
      </figure>
    </li>
  )
}
export default MyQuestionCard