import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { ROLE_API } from "../../../constants/api_constants";
export default function SelectPermission({authorities, onChange, initialRole }) {
  const [selectedAuthority, setSelectedAuthority] = useState(initialRole);
  
  useEffect(() => {
    if (!authorities.includes(initialRole)) {
      setSelectedAuthority(response.data.authorities[0]);
    }
  }, [initialRole]);

  const handleChange = (event) => {
    setSelectedAuthority(event.target.value);
    if(onChange) onChange(event.target.value);
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
