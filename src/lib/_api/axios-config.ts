import axios from "axios";
import { NEXT_BASE_URL } from "../constants";
import { getToken } from "@/server/auth";


const DEFAULT_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: NEXT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  // const token = await getToken();
  const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXQiOnsidXNlcl9pZCI6IjkyZWRhYTgzLTg1MDAtNDI2Zi1hNjQ2LTljOTAzYjhlZmQ4ZSIsInVzZXJfdHlwZSI6IlBMQVRGT1JNIEFETUlOIn0sImV4cCI6MTc0ODg2NTk5MSwiaWF0IjoxNzQ4Nzc5NTkxfQ.hjkI1w8tJKU4UbyICZtgNeW0qhAMDjA_u-24PkVNdan2xOAqpX0qpNTj8a0tzchYzLXDSLj3fQYt9JUoh4eL1dOrG1NTLj7M1--Rl25c3pOf417xq0w8tiXKOxT9_TU3KC36LI5TG9HtVED98_s-Rczfc4SDWkyRSnFcDopX1UhYX5lqxOId-AlPMa_oh6Jpfyusx816NvbFVaGLyb0AHaBm_2Mfi2_BmMVbg4eVDYZJ9Fvr0pBBkrCh6V70ggcNYC9pl0K6cH5D8-MCtLsIsU-vruL7YJrMBJNgH9XWofDxhrHNAHzrw1sAoQmVGRYwm0sG4K9s1fb0pmag3T98Q3bA2A3Ri9UQO90if_FWUzN4fuf2SEriPWFrWnZx08QtWHgj-2AMVXNi6Z2xdu894B4RjlYfHCPY5BxXcNHlgjA2nrXcNIwcIJEVTm0-uOV66rXEvTkriKQV8Dw4FYM9GIAgpfTIAXNF070IoqQJIbDzYkkM5lasSGpyFuvheQEjwy-NtOC06rNbGSgbcJjTOxlhLvoBJfFqoSQxjkzL42OeVDZCLZrgv5if7e0Mq1xhop4miDpPSywWc3mMY4OsUV2ttWy0v61X7VVVKKtSedMP0eaFtTxBIFSZpVellmVtdZX5OE962N0vqsIMHDKnoTN8X3ILsxQB_7ACz9NSupg";
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
