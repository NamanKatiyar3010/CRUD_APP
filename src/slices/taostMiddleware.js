// src/middleware/toastMiddleware.js
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

export const toastMiddleware = () => (next) => (action) => {
  if (!isRejectedWithValue(action)) return next(action);

  const { message, statusCode, status } = action.payload || {};
  const errorMsg = message || (typeof action.payload === "string" ? action.payload : "Something went wrong");
  const code = statusCode || status;

  const statusMessages = {
    400: "Bad Request. Please check your input.",
    401: "Unauthorized. Please login.",
    403: "Forbidden. You do not have permission.",
    404: "Resource not found.",
    429: "Too many requests. Try again later.",
    500: "Server error. Please try again later.",
  };

  toast.error(statusMessages[code] || `${errorMsg}. Please try again later!`);
  
  return next(action);
};
