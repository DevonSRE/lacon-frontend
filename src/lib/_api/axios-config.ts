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
import { stripSensitiveResponses } from "./sanitize";

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
    params: config.params,
  });

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 Response [Auth]:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    console.error("🔴 Error Response [Auth]:", {
      url: error?.config?.url,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      apiMessage: error.response?.data?.message,
    });

    // This client only runs server-side (server actions), so callers surface
    // these messages; middleware handles redirecting signed-out users.
    if (error.response?.status === 401) {
      return Promise.reject({
        ...error,
        message: "Your session has expired. Please sign in again.",
      });
    }
    if (error.response?.status === 403) {
      return Promise.reject({
        ...error,
        message: "You don't have permission to do this.",
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

stripSensitiveResponses(axiosInstance);

const publicAxiosInstance = axios.create({
  baseURL: NEXT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});
stripSensitiveResponses(publicAxiosInstance);

publicAxiosInstance.interceptors.request.use(async (config: any) => {
  const token = NEXT_PUBLIC_CASE_API_KEY;
  if (token) {
    config.headers.Authorization = token;
  }

  console.log("🔵 Request [Public]:", {
    url: config.url,
    method: config.method,
    params: config.params,
  });

  return config;
});

publicAxiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 Response [Public]:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    console.error("🔴 Error Response [Public]:", {
      url: error?.config?.url,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      apiMessage: error.response?.data?.message,
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
