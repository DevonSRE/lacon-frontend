"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { NEXT_BASE_URL } from "../constants";
import { stripSensitiveResponses } from "./sanitize";

export const authConfig = axios.create({
  baseURL: NEXT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});



export const authTemp = axios.create({
  baseURL: NEXT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

stripSensitiveResponses(authConfig);
stripSensitiveResponses(authTemp);

// Add interceptor
authTemp.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("TempToken")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
