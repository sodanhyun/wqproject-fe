import { HeartIcon } from "@heroicons/react/20/solid/index.js";
import { useState } from "react";
import CheckPickModal from "../modal/CheckPickModal.jsx";
import MyQuestionDeleteModal from "../modal/MyQuestionDeleteModal.jsx";
import { USER_ROLE } from "../../../constants/localstorage_constants.js";
import { ADMIN } from "../../../constants/user_role.js";

const QuestionCard = ({ data, role, clickLike, clickPick, questionDelete }) => {
  const [myLike, setMyLike] = useState(data.myLike);
  const [pickModalOpen, setPickModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isAdmin = localStorage.getItem(USER_ROLE) === ADMIN;

  const handleClickLike = () => {
    setMyLike(!myLike);
    clickLike(data.qcode);
  };

  return (
    <li key={data.qCode}>
      <figure className="relative rounded-2xl p-6 shadow-xl shadow-slate-900/10 bg-white">
        <blockquote className="relative">
          <figcaption className="relative  flex items-center justify-between border-slate-100">
            <div className="flex">
              <div className="font-display text-base text-slate-900 mr-2">
                {role=="ADMIN" ? data.name : "익명 사용자"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {data.updateTime
                  ? data.updateTime?.split("T")[1]
                  : data.regTime?.split("T")[1]}
              </div>
            </div>
            <div className="flex justify-between items-center">
              {isAdmin && (
                <button
                  onClick={() => setPickModalOpen(true)}
                  type="button"
                  className="rounded-md bg-green-500 px-3 py-2 text-sm mr-3 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                >
                  채택
                </button>
              )}
              {pickModalOpen && (
                <CheckPickModal
                  handleClickPick={() => clickPick(data.qcode)}
                  onClose={() => setPickModalOpen(false)}
                />
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={()=>setDeleteModalOpen(true)}
                  className="rounded-md bg-red-500 px-3 py-2 text-sm mr-3 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  삭제
                </button>
              )}
              {deleteModalOpen && (
                <MyQuestionDeleteModal
                  qcode={data.qcode}
                  onClose={() => setDeleteModalOpen(false)}
                  questionDelete={questionDelete}
                />
              )}
              <HeartIcon
                onClick={handleClickLike}
                className={`w-6 cursor-pointer mr-1
                          ${myLike ? "text-red-500" : "text-gray-300"}`}
              />
              <p>{data.likesCount}</p>
            </div>
          </figcaption>
          <p className="text-lg tracking-tight text-slate-900">
            {data.content}
          </p>
        </blockquote>
      </figure>
    </li>
  );
};
export default QuestionCard;
