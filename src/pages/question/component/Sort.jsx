
export default function Sort({setSortSelect}) {
  const changeSelect = (e)=> {setSortSelect(e.target.value);}

  return (
    <div>
      <select
        onChange={changeSelect}
        id="location"
        name="location"
        defaultChecked="time"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-9 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="시간순">시간순</option>
        <option value="공감순">공감순</option>
      </select>
    </div>
  )
}
