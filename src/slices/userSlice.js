import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = import.meta.env.VITE_API_APP_URL;
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ limit, page, search }, thunkAPI) => {
    try {
      const query = new URLSearchParams({
        limit: limit || 10,
        page: page || 1,
        search: search || "",
      }).toString();
      const res = await fetch(`${url}?${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "An unexpected error occurred"
      );
    }
  }
);

export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${url}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "An unexpected error occurred"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",

  async (formData, thunkAPI) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        // headers: formData,
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "An unexpected error occurred"
      );
    }
  }
);

export const upDateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({id, status}, thunkAPI) => {
    try {
      let new_url = url + `/${id}/status`;
      console.log(id,status);
      
      const res = await fetch(new_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status:status }),
      });
      const result = await res.json();
      console.log(result,'result............');
      
      if (!res.ok) throw new Error(result.message || "Failed to add user");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "An unexpected error occurred"
      );
    }
  }
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

      .addCase(upDateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upDateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        let statId = action.meta.arg.id
        state.users = state.users.map(user => {
if(user._id == statId){
  let {status , ...rest } = user
  return { ...rest , status: !status}
}else{ 
  return user
}
        })
      })
      .addCase(upDateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSingleUser, resetUsersLoaded } = userSlice.actions;
export default userSlice.reducer;
