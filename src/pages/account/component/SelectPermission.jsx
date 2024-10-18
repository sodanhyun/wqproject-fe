import { useState, useEffect } from "react";

export default function SelectPermission({authorities, onChange, initialRole }) {
  const [selectedAuthority, setSelectedAuthority] = useState(initialRole);

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
        className="text-xs rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-2 focus:ring-2 focus:ring-blue-600"
      >
        {authorities.map((authority, index) => (
          <option key={index} value={authority.type}>
            {authority.name}
          </option>
        ))}
      </select>
    </div>
  );
}
