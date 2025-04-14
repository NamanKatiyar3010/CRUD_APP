import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./src/slices/userSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
  },
});

export default store;
