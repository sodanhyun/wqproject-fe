
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

export default function Pagination({ currentPage, itemsPerPage, totalItems, setCurrentPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // 전체 페이지 수

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
     <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mb-10 mt-10">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={handlePreviousPage}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>
      {/* 페이지 번호들 */}
      {totalPages > 1 && (
        <div className=" md:-mt-px md:flex">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`${
                pageNum === currentPage
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={handleNextPage}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}