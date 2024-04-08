import { useState, useEffect } from "react";
import fetcher from "../fetcher";
import { ROLE_API } from "../constants/api_constants";
export default function SelectPermission({ onChange, initialRole }) {
  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState(initialRole);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetcher.get(ROLE_API);
        setAuthorities(response.data.authorities);

        // 만약 initialRole이 authorities 내부에 없다면 첫 번째 권한으로 선택
        if (!response.data.authorities.includes(initialRole)) {
          setSelectedAuthority(response.data.authorities[0]);
        }
        
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [initialRole]);

  const handleChange = (event) => {
    setSelectedAuthority(event.target.value);
    if (onChange) onChange(event.target.value); // 부모 컴포넌트로 변경사항 전달
  };

  return (
    <div>
      <select
        id="location"
        value={selectedAuthority}
        onChange={handleChange}
        className="mt-2 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        {authorities.map((authority, index) => (
          <option key={index} value={authority}>
            {authority}
          </option>
        ))}
      </select>
    </div>
  );
}
