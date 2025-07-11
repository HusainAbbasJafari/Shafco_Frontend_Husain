import { setError, setLoading } from "@/store/slices/apiSlice";
import store from "@/store/store";
import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const state = store.getState();
      const token = state?.auth?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        delete config.headers["Authorization"];
      }
    } catch (error) {
      console.warn("Token fetch error from Redux store", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    store.dispatch(setLoading(false));
    store.dispatch(setError(error.response?.data?.message || "Something went wrong"));
    return Promise.reject(error);
  }
);

export default api;
