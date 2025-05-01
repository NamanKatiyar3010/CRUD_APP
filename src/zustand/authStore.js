import {create} from "zustand";
import axios from "axios";

const url = import.meta.env.VITE_API_APP_URL;

const useAuthStore = create((set) => ({
  token: sessionStorage.getItem("token") || "",
  loading: false,
  error: null,
  userEmail: "",
  userSignUp: async (formValue) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${url}/auth/signup`, formValue);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data || error.message });
    }
  },
  userLogin: async (formValue) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${url}/auth/login`, formValue);
      const token = res.data?.data?.token;
      sessionStorage.setItem("token", token);
      set({ loading: false, token });
    } catch (error) {
      set({ loading: false, error: error.response?.data || error.message });
    }
  },
  userLogout: () => {
    sessionStorage.clear();
    sessionStorage.removeItem("token");
    set({ token: "", userEmail: "" });
  },
  setUserEmail: (email) => set({ userEmail: email }),
  clearUserEmail: () => set({ userEmail: "" }),
}));

export default useAuthStore;
