import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./src/slices/userSlice";
import authSlice from "./src/slices/authSlice"
import { toastMiddleware } from "./src/slices/taostMiddleware";

const store = configureStore({
  reducer: {
    users: userSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});

export default store;
