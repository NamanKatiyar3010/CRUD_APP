import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const hideSearch =
    pathname === "/addData" || /^\/users\/[^/]+$/.test(pathname);
  // console.log(location);
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
    <nav
      style={{
        padding: "10px 20px",
        background: "#282c34",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            marginRight: "15px",
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </Link>
        <Link to="/addData" style={{ color: "white", textDecoration: "none" }}>
          Add Data
        </Link>
      </div>
      {!hideSearch && (
        <div>
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
