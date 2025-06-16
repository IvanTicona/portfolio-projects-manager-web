import { useAuthStore } from "@/store/useAuthStore";
import { useProjectsStore } from "@/store/useProjectsStore";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl: string = error.config?.url ?? "";

    if (status === 401 && !requestUrl.includes("/me")) {
      useAuthStore.getState().reset();
      useProjectsStore.getState().reset();
      Router.replace("/");
    }
    return Promise.reject(error);
  }
);

export default api;
