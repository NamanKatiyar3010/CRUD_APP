import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./src/slices/userSlice";
import authSlice from "./src/slices/authSlice"

const store = configureStore({
  reducer: {
    users: userSlice,
    auth: authSlice,
  },
});

export default store;
