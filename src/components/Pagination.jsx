import React from "react";
import { useNavigate } from "react-router-dom";

const Pagination = ({ num, setSearchParams, searchParams, limit }) => {
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page") || 1, 10);

  const handleChange = (page) => {
    searchParams.set("page", page + 1);
    setSearchParams(searchParams);
    navigate(`/users?limit=${limit}&page=${page + 1}`);
  };

  return (
    <ul className="flex justify-center gap-2 mt-4">
      {Array.from({ length: num }, (_, i) => {
        const pageIndex = i + 1;
        const isActive = currentPage === pageIndex;

        return (
          <li
            key={i}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              isActive
                ? "bg-blue-500 text-white border border-blue-500"
                : "bg-gray-200 text-gray-700 border border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500"
            }`}
            onClick={() => handleChange(i)}
          >
            {pageIndex}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
