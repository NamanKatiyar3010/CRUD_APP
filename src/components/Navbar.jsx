import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const hideSearch =
    pathname === "/addData" || /^\/users\/[^/]+$/.test(pathname);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search") || "";
    if (location.pathname === "/users") {
      setSearch(currentSearch);
    } else {
      setSearch("");
    }
  }, [location]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/users?search=${search}&page=1&limit=10`);
    }
  };

  return (
    <nav className="w-full px-4 py-2 bg-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <Link
          to="/"
          className="text-white hover:text-gray-300 transition duration-200"
        >
          Home
        </Link>
        <Link
          to="/addData"
          className="text-white hover:text-gray-300 transition duration-200"
        >
          Add Data
        </Link>
      </div>
      {!hideSearch && (
        <div className="w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-[250px] px-3 bg-gray-400 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
