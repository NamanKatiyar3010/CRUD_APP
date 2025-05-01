import React from "react";
import Navbar from "../components/Navbar";
import { Navigate, Outlet } from "react-router-dom";

const Layout = () => {
  if (!sessionStorage.getItem("token")) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
