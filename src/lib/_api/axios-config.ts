import axios from "axios";
import { NEXT_BASE_URL, NEXT_PUBLIC_CASE_API_KEY } from "../constants";
import { getToken } from "@/server/auth";


const DEFAULT_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: NEXT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      return Promise.reject({
        ...error,
        message: "Request timed out. Please try again.",
      });
    }
    return Promise.reject(error);
  }
);
const publicAxiosInstance = axios.create({
  baseURL: NEXT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});

publicAxiosInstance.interceptors.request.use(async (config: any) => {
  const token = NEXT_PUBLIC_CASE_API_KEY;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

publicAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      return Promise.reject({
        ...error,
        message: "Request timed out. Please try again.",
      });
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, publicAxiosInstance };
