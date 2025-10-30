// import axios from "axios";
// import { NEXT_BASE_URL, NEXT_PUBLIC_CASE_API_KEY } from "../constants";
// import { getToken } from "@/server/auth";


// const DEFAULT_TIMEOUT = 10000;

// const axiosInstance = axios.create({
//   baseURL: NEXT_BASE_URL,
//   timeout: DEFAULT_TIMEOUT,
// });

// axiosInstance.interceptors.request.use(async (config: any) => {
//   const token = await getToken();
//   if (token) {
//     config.headers.Authorization = token;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
//       return Promise.reject({
//         ...error,
//         message: "Request timed out. Please try again.",
//       });
//     }
//     return Promise.reject(error);
//   }
// );
// const publicAxiosInstance = axios.create({
//   baseURL: NEXT_BASE_URL,
//   timeout: DEFAULT_TIMEOUT,
// });

// publicAxiosInstance.interceptors.request.use(async (config: any) => {
//   const token = NEXT_PUBLIC_CASE_API_KEY;
//   if (token) {
//     config.headers.Authorization = token;
//   }
//   return config;
// });

// publicAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
//       return Promise.reject({
//         ...error,
//         message: "Request timed out. Please try again.",
//       });
//     }
//     return Promise.reject(error);
//   }
// );

// export { axiosInstance, publicAxiosInstance };



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

  console.log("🔵 Request [Auth]:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
    params: config.params,
  });

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 Response [Auth]:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error("🔴 Error Response [Auth]:", {
      url: error?.config?.url,
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    // Handle expired/invalid tokens
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("🔒 Authentication failed - token is invalid or expired");

      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        // Store the current URL to redirect back after login
        const currentPath = window.location.pathname;
        window.location.href = `/signin?callbackUrl=${encodeURIComponent(currentPath)}`;
      }

      return Promise.reject({
        ...error,
        message: "Your session has expired. Please sign in again.",
      });
    }

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

  console.log("🔵 Request [Public]:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
    params: config.params,
  });

  return config;
});

publicAxiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 Response [Public]:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error("🔴 Error Response [Public]:", {
      url: error?.config?.url,
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    // Handle expired/invalid API keys
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("🔒 Authentication failed - API key is invalid or expired");

      return Promise.reject({
        ...error,
        message: "API authentication failed. Please contact support.",
      });
    }

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
