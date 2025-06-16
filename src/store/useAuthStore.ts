import { create } from "zustand";
import api from "@/utils/api";
import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/login", { email, password });
      await api.get("/auth/me").then((res) => set({ user: res.data }));
    } catch {
      set({ error: "Failed to fetch user data" });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/logout");
      Cookies.remove("token");
      set({ user: null });
    } catch {
      set({ error: "Failed to logout" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      user: null,
      loading: false,
      error: null,
    });
  },
}));
