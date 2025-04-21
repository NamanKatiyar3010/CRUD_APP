import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  if (sessionStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
