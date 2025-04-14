import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ limit, page, search }, thunkAPI) => {
    const query = new URLSearchParams({ limit, page, search }).toString();
    const res = await fetch(`${import.meta.env.VITE_API_APP_URL}?${query}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data;
  }
);

export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (id, thunkAPI) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_APP_URL}/${id}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    return data;
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (formData, thunkAPI) => {
    const res = await fetch(import.meta.env.VITE_API_APP_URL, {
      method: "POST",
      // headers: formData,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add user");
    return data;
  }
);

const initialState = {
  users: [],
  totalUsers: 0,
  isUsersLoaded:false,
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
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalUsers = action.payload.totalData;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
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

      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload.data); 
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSingleUser } = userSlice.actions;
export default userSlice.reducer;
