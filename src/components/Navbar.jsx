import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const menuRef = useRef(null);

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

  const handleLogout = () => {
    console.log(localStorage.getItem("token"));
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full px-4 py-2 bg-gray-600 flex justify-between items-center gap-4">
      <div className="flex items-center gap-6">
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

      {/* Right Side: Search & Dropdown */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {!hideSearch && (
          <div className="w-auto">
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 bg-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        )}

        {/* 3-Dot Menu (Dropdown) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white text-2xl"
          >
            ⋮
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-28 bg-white text-black rounded shadow-md z-50">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
