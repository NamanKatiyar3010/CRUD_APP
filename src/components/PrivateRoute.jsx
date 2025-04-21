// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
