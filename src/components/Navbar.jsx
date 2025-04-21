import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react"; // Optional: For modern icons
import { BsSearch } from "react-icons/bs";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const menuRef = useRef(null);
  const inputRef = useRef(null);

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

  // listen for "X" clear event on input
  useEffect(() => {
    const input = inputRef.current;
    const handleSearchClear = (e) => {
      if (!e.target.value && searchParams.has("search")) {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.delete("search");
        updatedParams.set("page", "1");
        setSearchParams(updatedParams);
      }
    };

    input?.addEventListener("search", handleSearchClear);
    return () => input?.removeEventListener("search", handleSearchClear);
  }, [searchParams, setSearchParams]);

  const handleKeyDown = (e) => {
    console.log(e);
    
    // if (e.key === "Enter") {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.set("search", search);
      updatedParams.set("page", "1");
      updatedParams.set("limit", "10");
      setSearchParams(updatedParams);
      navigate(`/users?${updatedParams}`);
    // }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/auth");
  };

  // Close dropdown when clicking outside
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
    <nav className="w-full bg-gray-600 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - Brand / Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-300 transition"
          >
            Home
          </Link>
          <Link
            to="/addData"
            className="text-lg font-medium hover:text-gray-300 transition hidden sm:inline"
          >
            Add User
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Right - Search & Menu */}
        <div className="hidden sm:flex items-center gap-4">
          {!hideSearch && (
            <>
            
            <input
              ref={inputRef}
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // onKeyDown={handleKeyDown}
              className="px-3 py-2 bg-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <BsSearch onClick={handleKeyDown}/>
            </>
          )}
          {/* 3-dot dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white text-2xl"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown below nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-2">
          <Link
            to="/addData"
            className="text-white px-2 py-1 rounded hover:bg-gray-500 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Add User
          </Link>

          {!hideSearch && (
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 bg-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white px-2 py-2 text-left hover:bg-gray-500 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
