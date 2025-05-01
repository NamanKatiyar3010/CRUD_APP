import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkWrapper } from "./apiThunkWrapper";
import axios from "axios";

const url = import.meta.env.VITE_API_APP_URL;
//-------------------Signup-------------------
export const userSignUp = createAsyncThunk(
  "user/signUp",
  async (formvalue, thunkApi) =>
    apiThunkWrapper(async () => {
      const res = await axios.post(`${url}/auth/signup`, formvalue);
      return res.data; 
    }, thunkApi)
);

//-------------------Login-------------------
export const userLogin = createAsyncThunk(
  "user/login",
  async ({formvalue}, thunkApi) =>   
    apiThunkWrapper(async () => {
      const res = await axios.post(`${url}/auth/login`, formvalue);
      // console.log(res,"login........")
      return res.data.data; 
    }, thunkApi)
  
);

const initialState = {
  token: sessionStorage.getItem("token") || "",
  loading: false,
  error: null,
  userEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogout: (state) => {
      state.token = "";
      sessionStorage.clear();
      sessionStorage.removeItem("token");
    },
    setUserEmail : (state,action) => {
      state.userEmail = action.payload;
    },
    clearUserEmail: (state) => {
      state.userEmail="";
    }
  },
  extraReducers: (builder) => {
    builder
      //---------signUp-------------------
      .addCase(userSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(userSignUp.fulfilled, (state) => {
        state.loading = false;

      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //---------login-------------------
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token;
        sessionStorage.setItem("token", action.payload?.token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { userLogout,setUserEmail,clearUserEmail } = authSlice.actions;
export default authSlice.reducer;
