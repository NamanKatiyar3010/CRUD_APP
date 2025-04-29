import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_API_APP_URL;

export const useUserStore = create((set, get) => ({
  users: [],
  totalUsers: 0,
  isUsersLoaded: false,
  singleUser: null,
  loading: false,
  childLoading: false,
  error: null,
  updatingUserId: "",

  // Clear Single user
  clearSingleUser: () => set({ singleUser: null }),

  resetUsersLoaded: () => set({ isUsersLoaded: false }),

  // Fetch all users
  fetchUsers: async (searchParams) => {
    set({ loading: true, error: null, isUsersLoaded: false });

    const queryParams = new URLSearchParams(searchParams);

    const limit = Math.min(Number(queryParams.get("limit")) || 10, 50);
    const page = Number(queryParams.get("page")) || 1;
    const search = queryParams.get("search") || "";

    const query = new URLSearchParams({ limit, page, search }).toString();

    try {
      const res = await axios.get(`${url}/users?${query}`);
      set({
        users: res.data.data,
        totalUsers: res.data.totalData,
        isUsersLoaded: true,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to fetch users.",
      });
      toast.error(err.response.data.message);
    }
  },

  // Fetch Single User
  fetchSingleUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${url}/users/${id}`);
      set({ singleUser: res.data.data, loading: false });
    } catch (err) {
      toast.error(err.response.data.message);
      set({ loading: false, error: err.message });
    }
  },

  // Add User
  addUser: async (FormData) => {
    set({ loading: true, error: null });
    try {
      console.log(FormData);
      
      const resp = await axios.post(`${url}/users`, FormData);
      const data = resp.data;
      const { users, totalUsers } = get();
      const currentParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(currentParams.get("page") || "1");
      const limit = parseInt(currentParams.get("limit") || "10");

      const newUsers = [...users];
      if (currentPage === 1) {
        newUsers.unshift(data.data);
        if (newUsers.length > limit) {
          newUsers.length = limit;
        }
      }

      set({
        users: newUsers,
        totalUsers: totalUsers + 1,
        isUsersLoaded: true,
        loading: false,
      });
      toast.success("User added successfully!");
    } catch (err) {
      toast.error(err.response.data.message);

      set({ loading: false, error: err.response.data.message });
    }
  },

  // Update user Status
  updateUserStatus: async (id, status) => {
    set({ childLoading: true, error: null, updatingUserId: id });

    try {
      // console.log("inside try");

      const resp = await axios.patch(
        `${url}/users/${id}/status`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { users } = get();
      const updatedUsers = users.map((user) =>
        user._id === id ? { ...user, status: !user.status } : user
      );
      set({ users: updatedUsers, updatingUserId: null, childLoading: false });
    } catch (err) {
      toast.error(err.response.data.message);
      set({ childLoading: false, error: err.message });
    } finally {
      set({ childLoading: false });
    }
  },

  // Delete User
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${url}/users/${id}`);

      const { users, totalUsers } = get();
      set({
        users: users.filter((user) => user._id !== id),
        totalUsers: totalUsers - 1,
        loading: false,
      });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false, error: error.message || "An error occurred" });
    }
  },

  // Update User
  updateUser: async ({ id, formData }) => {
    set({ loading: true, error: null });
    try {
      const resp = await axios.put(`${url}/users/${id}`, formData);
      const data = resp.data;

      const { users } = get();
      const updatedUsers = users.map((user) =>
        user._id === id ? { ...user, ...data.data } : user
      );

      set({ users: updatedUsers, loading: false });
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false, error: error.message });
    }
  },
}));
