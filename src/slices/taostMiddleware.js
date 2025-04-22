import { isRejectedWithValue } from "@reduxjs/toolkit";
import { Toaster, toast } from "react-hot-toast";

export const toastMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload || {};
    const message =
      payload.message ||
      (typeof payload === "string" ? payload : "Something went wrong");

    // Debugging: Log the payload to verify its structure
    // console.log("Payload received in toastMiddleware:", payload);

    // Extract status code from payload
    const statusCode = payload?.statusCode || payload?.status;

    // Check for specific status codes
    switch (statusCode) {
      case 400:
        toast.error(" Bad Request. Please check your input.");
        break;
      case 401:
        toast.error(" Unauthorized. Please login.");
        break;
      case 403:
        toast.error(" Forbidden. You do not have permission.");
        break;
      case 404:
        toast.error(" Resource not found.");
        break;
      case 429:
        // Specific handling for Too Many Requests
        toast.error(payload.message || "⏳ Too many requests. Try again later.");
        break;
      case 500:
        toast.error(" Server error. Please try again later.");
        break;
      default:
        toast.error(` ${message}. Please try again later!`);
    }
  }

  return next(action);
};
