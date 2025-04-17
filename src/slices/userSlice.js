import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkWrapper } from "./apiThunkWrapper";
import axios from "axios";

const url = import.meta.env.VITE_API_APP_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ limit, page, search }, thunkAPI) =>
    apiThunkWrapper(async () => {
      const query = new URLSearchParams({
        limit: limit || 10,
        page: page || 1,
        search: search || "",
      }).toString();
      const res = await fetch(`${url}/users?${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      return data;
    }, thunkAPI)
);

export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (id, thunkAPI) =>
    apiThunkWrapper(async () => {
      const res = await fetch(`${url}/users/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      return data;
    }, thunkAPI)
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (formData, thunkAPI) =>
    apiThunkWrapper(async () => {
      // console.log("running add");

      const res = await fetch(`${url}/users`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      return data;
    }, thunkAPI)
);

export const upDateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ id, status }, thunkAPI) =>
    apiThunkWrapper(async () => {
      // console.log("runnig update");

      const res = await fetch(`${url}/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      return data;
    }, thunkAPI)
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) =>
    apiThunkWrapper(async () => {
      // console.log("running delete");

      const res = await fetch(`${url}/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      return data;
    }, thunkAPI)
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, formData }, thunkApi) =>
    apiThunkWrapper(async () => {
      const res = await fetch(`${url}/users/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      return data;
    }, thunkApi)
);

const initialState = {
  users: [],
  totalUsers: 0,
  isUsersLoaded: false,
  singleUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSingleUser: (state) => {
      state.singleUser = null;
    },
    resetUsersLoaded: (state) => {
      state.isUsersLoaded = false;
    },
  },

  extraReducers: (builder) => {
    builder
      //-----------fetch all user----------------------
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUsersLoaded = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalUsers = action.payload.totalData;
        state.isUsersLoaded = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //---------fetch single user------------------
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload.data;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //--------add user-------------------------
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers += 1;

        const currentParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(currentParams.get("page") || "1");
        const limit = parseInt(currentParams.get("limit") || "10");
        if (currentPage === 1) {
          state.users.unshift(action.payload.data);
          if (state.users.length > limit) {
            state.users = state.users.slice(0, limit);
          }
        }

        state.isUsersLoaded = true;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //----------update user------------------
      .addCase(upDateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upDateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        let statId = action.meta.arg.id;
        state.users = state.users.map((user) => {
          if (user._id == statId) {
            let { status, ...rest } = user;
            return { ...rest, status: !status };
          } else {
            return user;
          }
        });
      })
      .addCase(upDateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //----------delete user------------------
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg.id
        );
        state.totalUsers -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { clearSingleUser, resetUsersLoaded } = userSlice.actions;
export default userSlice.reducer;
