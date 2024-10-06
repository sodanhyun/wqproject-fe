// import { Button } from "../components/Button.jsx";
import { Container } from "../../components/common/Container.jsx";
import { Header } from "../../components/common/Header.jsx";
import SelectPermission from "./component/SelectPermission.jsx";
import fetcher from "../../fetcher.js";
import { useState, useEffect, Fragment } from "react";
import {
  ROLE_API,
  ROLE_UPDATE_API,
  ROLE_DELETE_API,
} from "../../constants/api_constants.js";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export default function AuthorityManagement() {
  const [members, setMembers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [modalDataId, setModalDataId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedRoleForEditMember, setSelectedRoleForEditMember] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetcher.get(ROLE_API).then((res) => {
          setMembers(res.data.members);
          setAuthorities(res.data.authorities);
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (memberId, memberRole) => {
    setEditingMemberId(memberId);
    setSelectedRoleForEditMember(memberRole);
  };

  const handleSaveClick = async (memberId, selectedRoleForEditMember) => {
    try {
      await fetcher.patch(ROLE_UPDATE_API, {
        memberId: memberId,
        memberRole: selectedRoleForEditMember
      });
      await fetcher.get(ROLE_API).then((res) => {
        setMembers(Object.assign([], res.data.members));
        setAuthorities(res.data.authorities);
      });
      setEditingMemberId(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = async (memberId) => {
    try {
      await fetcher.delete(`${ROLE_DELETE_API}/${memberId}`);
      await fetcher.get(ROLE_API).then((res) => {
        setMembers(Object.assign([], res.data.members));
        setAuthorities(res.data.authorities);
      });
      setEditingMemberId(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showDeleteModal = (memberId) => {
    setIsDeleteModalOpen(true);
    setModalDataId(memberId);
  }

  return (
    <div>
      <Header />
      <Container className="pb-16 pt-12  lg:pt-12">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className=" font-semibold leading-6 text-gray-900 text-center">
                권한관리
              </h1>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          이름
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          아이디
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          권한
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          수정
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          삭제
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {members.map((member) =>
                        editingMemberId === member.id ? (
                          <tr key={member.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {member.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {member.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <SelectPermission
                                authorities={authorities}
                                initialRole={member.role}
                                onChange={(value) =>
                                  setSelectedRoleForEditMember(value)
                                }
                              />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                              <button
                                onClick={() =>
                                  handleSaveClick(
                                    member.id,
                                    selectedRoleForEditMember
                                  )
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                저장
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={member.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {member.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {member.id}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {member.role}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() =>
                                  handleEditClick(member.id, member.role)
                                } 
                              >
                                수정
                              </button>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => showDeleteModal(member.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {isDeleteModalOpen && (<DeleteModal
        id={modalDataId}
        execFunc={handleDeleteClick}
        onClose={() => setIsDeleteModalOpen(false)}
      />)}
    </div>
  );
}

const DeleteModal = ({ id, execFunc, onClose }) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const execDelete = () => {
    setLoading(true);
    execFunc(id);
    setLoading(false);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      삭제
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        정말 삭제하시겠습니까? 삭제된 내용은 복구되지 않습니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => execDelete()}
                    disabled={loading} // 로딩 중에는 버튼 비활성화
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>삭제 중...</span>
                      </div>
                    ) : (
                      "삭제"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
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
};
