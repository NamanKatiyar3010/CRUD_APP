import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { BsSearch } from "react-icons/bs";
// import { useSelector } from "react-redux";
import { useUserStore } from "./zustand/userStore";
import { Toaster, toast } from "react-hot-toast";

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
  const { totalUsers } = useUserStore();

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

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      toast.error("Search cannot be empty or just spaces.");
      return;
    }

    const isValid = /^[a-zA-Z0-9@._-]+$/.test(trimmedSearch);
    if (!isValid) {
      toast.error("Search can only include letters, numbers, @, ., _, and -");
      return;
    }

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("search", trimmedSearch);
    updatedParams.set("page", "1");
    updatedParams.set("limit", "10");

    setSearchParams(updatedParams);
    navigate(`/users?${updatedParams}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/auth");
  };

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
        {/* Left Links */}
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

        <label className="text-lg font-medium hover:text-gray-300 transition hidden sm:inline">
          {`TotalUsers : ${totalUsers}`}
        </label>

        {/* Hamburger */}
        <div className="sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Desktop Search and Menu */}
        <div className="hidden sm:flex items-center gap-4">
          {!hideSearch && (
            <>
              <input
                ref={inputRef}
                type="search"
                placeholder="Search name or email..."
                maxLength={50}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-3 py-2 bg-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <BsSearch
                onClick={handleSearch}
                className="cursor-pointer text-white hover:text-gray-300"
              />
            </>
          )}

          {/* 3-dot menu */}
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

      {/* Mobile Dropdown */}
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
            <>
              <input
                type="search"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-3 py-2 bg-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <BsSearch
                onClick={handleSearch}
                className="cursor-pointer text-white hover:text-gray-300"
              />
            </>
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
