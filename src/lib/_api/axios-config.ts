import axios from "axios";
import { NEXT_BASE_URL } from "../constants";
import { getToken } from "@/server/auth";


const DEFAULT_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: NEXT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = await getToken();
  console.log("first", token)
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

export { axiosInstance };
