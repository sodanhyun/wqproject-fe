// import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { Header } from "../components/Header.jsx";
import SelectPermission from "../components/SelectPermission.jsx";
import fetcher from "../fetcher.js";
import { useState, useEffect } from "react";
import {
  ROLE_API,
  ROLE_UPDATE_API,
  ROLE_DELETE_API,
} from "../constants/api_constants.js";

export default function AuthorityManagement() {
  const [members, setMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedRoleForEditMember, setSelectedRoleForEditMember] =
    useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetcher.get(ROLE_API);
        setMembers(response.data.members);
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
      const formData = new FormData();
      formData.append("memberRole", selectedRoleForEditMember);
      await fetcher.patch(`${ROLE_UPDATE_API}/${memberId}`, formData);

      // 수정 후 전체 멤버 목록 불러오기
      const response = await fetcher.get(ROLE_API);
      setMembers(response.data.members);

      setEditingMemberId(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = async (memberId) => {
    try {
      await fetcher.delete(`${ROLE_DELETE_API}/${memberId}`);
      const updatedMembers = members.filter((member) => member.id !== memberId);
      setMembers(updatedMembers);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                                onClick={() => handleDeleteClick(member.id)}
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
    </div>
  );
}
